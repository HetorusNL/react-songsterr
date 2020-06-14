import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/layout/Navbar";
import Songsterrs from "./components/songsterr/Songsterrs";
import RSOnline from "./components/utils/RSOnline";

class App extends Component {
  state = {
    songsterrs: [],
    loading: false,
    rows: 1,
    columns: 1,
    iconPlayPause: "fas fa-play-circle fa-2x",
    groupFailReason: "",
    userIsInGroup: "",
    lastConnectTime: 0,
    connectedToRSOnline: false,
  };

  constructor(props) {
    super(props);
    this.songsterrsRef = React.createRef();
    this.rsOnline = new RSOnline(this.rsOnlineCallback);
    this.checkForPingLoop();
  }

  rsOnlineCallback = (event) => {
    try {
      const data = JSON.parse(event.data);
      switch (data.command) {
        case "pong":
          this.setState({ lastConnectTime: new Date().getTime() });
          this.setState({ connectedToRSOnline: true });
          break;
        case "group_code":
          console.log(data);
          this.setState({ userIsInGroup: data.result ? data.group_code : "" });
          this.setState({ groupFailReason: data.result ? "" : data.reason });
          break;
        case "play_pause":
          this.setState({
            iconPlayPause:
              this.state.iconPlayPause === "fas fa-play-circle fa-2x"
                ? "fas fa-pause-circle fa-2x"
                : "fas fa-play-circle fa-2x",
          });
          this.songsterrsRef.current.playPause();
          break;
        default:
          console.log("unsupported event.data", data);
      }
    } catch (SyntaxError) {
      console.log("unsupported event", event);
    }
  };

  checkForPingLoop = () => {
    setTimeout(() => {
      // reset connection of not connected for the last 5 seconds
      if (new Date().getTime() > this.state.lastConnectTime + 5000) {
        this.setState({ connectedToRSOnline: false });
      }
      this.checkForPingLoop();
    }, 5000);
  };

  // initially add rows*columns number of Songsterrs to the page when the page loads
  componentDidMount() {
    this.setState({ loading: true });
    this.updateRowsColumns(this.state.rows, this.state.columns);
    this.setState({ loading: false });
  }

  updateRowsColumns(newRows, newColumns) {
    // calculate the new values of the songsterrs array
    var songsterrs = this.state.songsterrs;
    const newLength = newRows * newColumns;
    const oldLength = songsterrs.length;
    const diff = newLength - oldLength;
    if (diff > 0) {
      for (var i = oldLength; i < newLength; i++) {
        songsterrs.push({ id: i });
      }
    } else if (diff < 0) {
      songsterrs.length = newLength;
    }

    // set the new state properties
    this.setState({
      rows: newRows,
      columns: newColumns,
      songsterrs: songsterrs,
    });
  }

  navbarCallback(command, params = undefined) {
    console.log("navbarCallback(", command, ",", params, ")");
    switch (command) {
      case "playPause":
        console.log("connectedtoRSOnline: ", this.state.connectedToRSOnline);
        if (this.state.connectedToRSOnline) {
          console.log("sending playpause to RSOnline");
          this.rsOnline.playPause();
        } else {
          console.log("running playpause locally");
          this.setState({
            iconPlayPause:
              this.state.iconPlayPause === "fas fa-play-circle fa-2x"
                ? "fas fa-pause-circle fa-2x"
                : "fas fa-play-circle fa-2x",
          });
          this.songsterrsRef.current.playPause();
        }
        console.log("done performing callback");
        break;
      case "rowsMin":
        if (this.state.rows > 1) {
          this.updateRowsColumns(this.state.rows - 1, this.state.columns);
        }
        break;
      case "rowsPlus":
        this.updateRowsColumns(this.state.rows + 1, this.state.columns);
        break;
      case "columnsMin":
        if (this.state.columns > 1) {
          this.updateRowsColumns(this.state.rows, this.state.columns - 1);
        }
        break;
      case "columnsPlus":
        this.updateRowsColumns(this.state.rows, this.state.columns + 1);
        break;
      case "fontPlus":
        this.songsterrsRef.current.changeFont(1);
        break;
      case "fontMin":
        this.songsterrsRef.current.changeFont(-1);
        break;
      case "createGroup":
        this.rsOnline.createGroup();
        break;
      case "joinGroup":
        this.rsOnline.joinGroup(params.groupCode);
        break;
      case "leaveGroup":
        this.rsOnline.leaveGroup();
        break;
      default:
        console.log("unknown command: ", command);
        break;
    }
  }

  render() {
    const {
      loading,
      songsterrs,
      rows,
      columns,
      iconPlayPause,
      groupFailReason,
      userIsInGroup,
      connectedToRSOnline,
    } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar
            iconPlayPause={iconPlayPause}
            groupFailReason={groupFailReason}
            userIsInGroup={userIsInGroup}
            connectedToRSOnline={connectedToRSOnline}
            navbarCallback={this.navbarCallback.bind(this)}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Fragment>
                  <Songsterrs
                    ref={this.songsterrsRef}
                    loading={loading}
                    songsterrs={songsterrs}
                    rows={rows}
                    columns={columns}
                  />
                </Fragment>
              )}
            />
            <Route exact path="/about" render={(props) => <p>About page</p>} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
