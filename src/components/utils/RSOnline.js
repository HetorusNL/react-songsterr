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

  requestGroupCode = () => {
    // ask the server for a group code
    this.websocketOpen &&
      this.websocket.send(JSON.stringify({ command: "get_group_code" }));
  };

  pingLoop = () => {
    setTimeout(() => {
      this.websocket.send(JSON.stringify({ command: "ping" }));
      this.pingLoop();
    }, 2500);
  };
}

export default RSOnline;
