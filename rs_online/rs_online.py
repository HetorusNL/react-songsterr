import asyncio
import json
import logging
import random
import time
import threading
import uuid
import websockets

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class RSOnline(object):
    def __init__(self):
        self.state = {"value": 0}
        self.users = {}
        self.groups = {}

        # setup user and group logging
        self.log_every_x_sec = 10
        threading.Thread(target=self.logging_function, daemon=True).start()

    def logging_function(self):
        while True:
            time.sleep(self.log_every_x_sec)
            logger.debug(
                f"users: {json.dumps(self.users, default=lambda o: '<not serializable>')}"
            )
            logger.debug(
                f"groups: {json.dumps(self.groups, default=lambda o: '<not serializable>')}"
            )

    def start(self):
        """blocking function that doesn't return"""
        start_server = websockets.serve(
            self.ws_handler, host="192.168.1.200", port=5678
        )
        logger.info("server created, waiting for clients")

        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

    def state_event(self):
        return json.dumps({"type": "state", **self.state})

    def users_event(self):
        return json.dumps({"type": "users", "count": len(self.users)})

    def generate_uuid(self):
        """generate a collision-safe uuid for the users"""
        _uuid = str(uuid.uuid4())
        while _uuid in self.users:
            _uuid = uuid.uuid4()
        return _uuid

    def generate_random_code(self, size):
        return "".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ", k=size))

    def user_leave_group(self, user_uuid):
        """remove the user from the group or destroy the entire group when empty"""
        logger.debug(f"user {user_uuid} tries to leave group")
        group_code = self.users[user_uuid].get("group_code")
        if group_code:
            logger.info(f"user {user_uuid} leaves group {group_code}")
            del self.users[user_uuid]["group_code"]
            # if only user in group: delete group
            if len(self.groups[group_code]["members"]) == 1:
                logger.info(f"user was only member, group destroyed")
                del self.groups[group_code]
            else:
                # otherwise remove the user from the group
                self.groups[group_code]["members"].remove(user_uuid)
                logger.info(f"group had more menbers, removing the user")
                if self.groups[group_code]["admin"] == user_uuid:
                    # if the user was admin, choose a random new admin
                    new_admin = random.choice(self.groups[group_code]["members"])
                    self.groups[group_code]["admin"] = new_admin
                    logger.info(f"user was admin, new admin: {new_admin}")
                logger.debug(f"new group info: {self.groups[group_code]}")

    async def generate_group_code(self, user_uuid):
        """generate a collision-safe uuid for a user"""
        # make sure that the user isn't already in a group
        self.user_leave_group(user_uuid)
        logger.debug(f"generating group_code for user: {user_uuid}")
        group_code = self.generate_random_code(4)
        while group_code in self.groups:
            group_code = self.generate_random_code(4)

        user = self.users[user_uuid]
        user["group_code"] = group_code  # add the group code to the user
        # add the group and add the user to the group
        self.groups[group_code] = {"members": [user_uuid], "admin": user_uuid}
        # send the group code to the user
        await self.send_group_code(user_uuid)
        logger.info(f"user {user_uuid} has group_code: {group_code}")

    async def send_pong(self, user_uuid):
        """send pong reply to the ping request of client"""
        # logger.debug(f"sending pong to client {user_uuid}")
        message = json.dumps({"command": "pong"})
        await asyncio.wait([self.users[user_uuid]["websocket"].send(message)])

    async def join_group(self, user_uuid, group_code):
        """add a user to a group, if it exists"""
        # make sure to remove the user from its current goup if it has one
        self.user_leave_group(user_uuid)
        logger.debug(f"trying to add user {user_uuid} to group {group_code}")
        if group_code in self.groups:
            if user_uuid in self.groups[group_code]["members"]:
                logger.warning(f"user {user_uuid} already in group {group_code}!")
            else:
                self.users[user_uuid]["group_code"] = group_code
                self.groups[group_code]["members"].append(user_uuid)
                logger.info(f"added user {user_uuid} to group {group_code}")
                logger.debug(f"group information: {self.groups[group_code]}")
                message = json.dumps(
                    {"command": "group_code", "result": True, "group_code": group_code,}
                )
                # notify all users that a group update happened
                await asyncio.wait(
                    [user["websocket"].send(message) for _, user in self.users.items()]
                )
        else:
            logger.info(f"user {user_uuid}: group code {group_code} doesn't exist!")
            await self.send_group_code(
                user_uuid, reason=f"Group {group_code} doesn't exist!"
            )

    async def send_group_code(self, user_uuid, reason=None):
        """tells the user whether it's in a group"""
        message_json = {"command": "group_code", "result": False}
        group_code = self.users[user_uuid].get("group_code")
        if group_code:
            message_json["result"] = True
            message_json["group_code"] = group_code
        if reason:
            message_json["reason"] = reason
        message = json.dumps(message_json)
        await asyncio.wait([self.users[user_uuid]["websocket"].send(message)])

    async def send_play_pause(self, user_uuid):
        """send play_pause to user or the whole group if the user has a group"""
        logger.debug("play_pause command received")
        group_code = self.users[user_uuid].get("group_code")
        message = json.dumps({"command": "play_pause"})
        if group_code:
            # send play_pause to whole group
            logger.info(
                f"sending play_pause to group: {group_code} ({self.groups[group_code]})"
            )
            await asyncio.wait(
                [
                    self.users[_user_uuid]["websocket"].send(message)
                    for _user_uuid in self.groups[group_code]["members"]
                ]
            )
        else:
            # send only to this user
            logger.info(f"sending play_pause to user: {user_uuid}")
            await asyncio.wait([self.users[user_uuid]["websocket"].send(message)])

    async def notify_state(self):
        if self.users:  # asyncio.wait doesn't accept an empty list
            message = self.state_event()
            await asyncio.wait(
                [
                    user["websocket"].send(message)
                    for user_uuid, user in self.users.items()
                ]
            )

    async def notify_users(self):
        if self.users:  # asyncio.wait doesn't accept an empty list
            message = self.users_event()
            await asyncio.wait(
                [user["websocket"].send(message) for _, user in self.users.items()]
            )

    async def register(self, user_uuid, websocket):
        logger.info(f"user ({user_uuid}) registered!")
        self.users[user_uuid] = {"websocket": websocket}
        await self.notify_users()

    async def unregister(self, user_uuid):
        logger.info(f"user ({user_uuid}) unregistered!")
        # make sure to remove the user from its current group if it has one
        self.user_leave_group(user_uuid)
        del self.users[user_uuid]
        await self.notify_users()

    async def ws_handler(self, websocket, path):
        logger.debug(f"ws_handler got request with path: {path}")
        user_uuid = self.generate_uuid()
        await self.register(user_uuid, websocket)
        try:
            await websocket.send(self.state_event())
            async for message in websocket:
                data = json.loads(message)
                if "command" in data:
                    if data["command"] == "create_group":
                        await self.generate_group_code(user_uuid)
                    elif data["command"] == "ping":
                        await self.send_pong(user_uuid)
                    elif data["command"] == "join_group":
                        group_code = data["params"]["group_code"].upper()
                        await self.join_group(user_uuid, group_code)
                    elif data["command"] == "leave_group":
                        self.user_leave_group(user_uuid)
                        await self.send_group_code(user_uuid)
                    elif data["command"] == "play_pause":
                        await self.send_play_pause(user_uuid)
                    else:
                        logger.error(f"unsupported event: {data}")
                elif "action" in data:
                    if data["action"] == "minus":
                        self.state["value"] -= 1
                        await self.notify_state()
                    elif data["action"] == "plus":
                        self.state["value"] += 1
                        await self.notify_state()
                    else:
                        logger.error(f"unsupported event: {data}")
        finally:
            await self.unregister(user_uuid)


if __name__ == "__main__":
    logger.info("Starting RSOnline server")
    rs_online_server = RSOnline()
    rs_online_server.start()
