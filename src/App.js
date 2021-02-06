import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import queryString from "query-string";
import "./App.css";

import Navbar from "./components/layout/Navbar";
import Songsterrs from "./components/songsterr/Songsterrs";
import RSOnline from "./components/utils/RSOnline";
import CacheBuster from "./components/utils/CacheBuster";

class App extends Component {
  state = {
    songsterrs: [],
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
        case "rewind":
          this.songsterrsRef.current.rewind();
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
    // call update to update the rows and columns based on search string
    this.update();
  }

  update() {
    if (this.songsterrsRef.current) {
      var search = queryString.parse(
        this.songsterrsRef.current.props.location.search
      );
      var rows = search.rows ? parseInt(search.rows) : this.state.rows;
      var columns = search.columns
        ? parseInt(search.columns)
        : this.state.columns;
    }
    // only update when changed
    if (rows * columns !== this.state.songsterrs.length) {
      this.updateRowsColumns(rows, columns);
    }
  }

  updateRowsColumns(newRows, newColumns) {
    // calculate the new values of the songsterrs array
    var songsterrs = this.state.songsterrs;
    const newLength = newRows * newColumns;
    const oldLength = songsterrs.length;
    const diff = newLength - oldLength;
    console.log("updating rows and columns of songsterr: diff: ", diff);
    if (diff > 0) {
      for (var i = oldLength; i < newLength; i++) {
        songsterrs.push({ id: i });
      }
    } else if (diff < 0) {
      songsterrs.length = newLength;
    } else {
      return; // not changed
    }

    this.updateQueryString({ rows: newRows, columns: newColumns });

    // set the new state properties
    this.setState({
      rows: newRows,
      columns: newColumns,
      songsterrs: songsterrs,
    });
  }

  updateQueryString(updates) {
    var props = this.songsterrsRef.current.props;
    var search = queryString.parse(props.location.search);
    props.history.push({
      ...props.location,
      search: queryString.stringify({ ...search, ...updates }),
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
        break;
      case "rewind":
        console.log("connectedtoRSOnline: ", this.state.connectedToRSOnline);
        if (this.state.connectedToRSOnline) {
          console.log("sending rewind to RSOnline");
          this.rsOnline.rewind();
        } else {
          console.log("running rewind locally");
          this.songsterrsRef.current.rewind();
        }
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
          <CacheBuster>
            {({
              loading,
              isLatestVersion,
              currentVersion,
              latestVersion,
              refreshCacheAndReload,
            }) => {
              if (!loading && !isLatestVersion) {
                return (
                  <div
                    style={{
                      color: "var(--danger-color)",
                      margin: "auto",
                      padding: "1em",
                    }}
                    onClick={refreshCacheAndReload}
                  >
                    There is a new version of React Songsterr available!
                    <br />
                    You are using {currentVersion} and {latestVersion} is
                    available.
                    <br /> Click on this message to reload the window. <br />
                    If this doesn't work try pressing Ctrl+F5 to force refresh
                  </div>
                );
              }
              return null;
            }}
          </CacheBuster>
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Fragment>
                  <Songsterrs
                    ref={this.songsterrsRef}
                    songsterrs={songsterrs}
                    rows={rows}
                    columns={columns}
                    update={this.update.bind(this)}
                    {...props}
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
