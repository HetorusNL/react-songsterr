import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/layout/Navbar";
import Songsterrs from "./components/songsterr/Songsterrs";

class App extends Component {
  state = {
    songsterrs: [],
    loading: false,
    rows: 1,
    columns: 2,
    iconPlayPause: "fas fa-play-circle fa-2x"
  };

  constructor(props) {
    super(props);
    this.songsterrsRef = React.createRef();
  }

  // initially add a single Songsterr to the page when the page loads
  componentDidMount() {
    this.setState({ loading: true });
    // { songsterrs: [{ id: 1 }] } { songsterrs: [{ id: 1 }, { id: 2 }] }
    this.setState({ songsterrs: [{ id: 0 }, { id: 1 }] });
    this.setState({ loading: false });
  }

  navbarCallback(command) {
    console.log(command);
    switch (command) {
      case "playPause":
        this.setState({
          iconPlayPause:
            this.state.iconPlayPause === "fas fa-play-circle fa-2x"
              ? "fas fa-pause-circle fa-2x"
              : "fas fa-play-circle fa-2x"
        });
        this.songsterrsRef.current.playPause();
        console.log("done performing callback");
        break;
      default:
        console.log("unknown command: ", command);
        break;
    }
  }

  render() {
    const { loading, songsterrs, rows, columns, iconPlayPause } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar
            iconPlayPause={iconPlayPause}
            navbarCallback={this.navbarCallback.bind(this)}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
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
            <Route exact path="/about" render={props => <p>About page</p>} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
