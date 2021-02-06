class RSOnline {
  constructor(callback) {
    this.websocket = new WebSocket(process.env.REACT_APP_WS_URL);
    this.websocket.onmessage = (event) => {
      console.log(event);
      callback && callback(event);
    };
    this.websocketOpen = false;
    this.websocket.onopen = () => {
      this.websocketOpen = true;
      this.pingLoop();
    };
  }

  createGroup = () => {
    // ask the server for a group code
    this.websocketOpen &&
      this.websocket.send(JSON.stringify({ command: "create_group" }));
  };

  joinGroup = (groupCode) => {
    // ask the server for this user to join the specified group
    this.websocketOpen &&
      this.websocket.send(
        JSON.stringify({
          command: "join_group",
          // ensure that groupCode is serialized
          params: { group_code: groupCode || " " },
        })
      );
  };

  leaveGroup = () => {
    this.websocketOpen &&
      this.websocket.send(JSON.stringify({ command: "leave_group" }));
  };

  playPause = () => {
    this.websocketOpen &&
      this.websocket.send(JSON.stringify({ command: "play_pause" }));
  };

  rewind = () => {
    this.websocketOpen &&
      this.websocket.send(JSON.stringify({ command: "rewind" }));
  };

  pingLoop = () => {
    setTimeout(() => {
      this.websocket.send(JSON.stringify({ command: "ping" }));
      this.pingLoop();
    }, 2500);
  };
}

export default RSOnline;
