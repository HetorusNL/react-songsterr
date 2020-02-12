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
    columns: 2
  };

  // initially add a single Songsterr to the page when the page loads
  componentDidMount() {
    this.setState({ loading: true });
    this.setState({ songsterrs: [{ id: 1 }, { id: 2 }] });
    this.setState({ loading: false });
  }

  render() {
    const { loading, songsterrs, rows, columns } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Fragment>
                  <Songsterrs
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
