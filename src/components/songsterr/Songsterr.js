import React, { Component } from "react";
import PropTypes from "prop-types";

import Spinner from "../layout/Spinner";

class Songsterr extends Component {
  state = {
    loading: true,
  };

  static propTypes = {
    songsterr: PropTypes.object.isRequired,
  };

  iframeOnLoad(obj) {
    // first send the apply_css command
    this.sendCommand("apply_css", {
      href: "/static/SongsterrHacks.css",
      rel: "stylesheet",
      type: "text/css",
    });
    // then set the state that causes a rerender of the iframe
    this.setState({ loading: false });
  }

  playPause() {
    this.sendCommand("play_pause");
  }

  changeFont(value) {
    this.sendCommand("change_font", { change_value: value });
  }

  sendCommand(command, params = undefined) {
    var element = document.getElementById(
      "songsterr-window-" + this.props.songsterr.id
    );
    console.log(element);
    element.contentWindow.postMessage(
      JSON.stringify({ command: command, params: params }),
      "https://songsterr.rs.hetorus.nl"
    );
  }

  render() {
    const { id } = this.props.songsterr;
    console.log(this.props);

    return (
      <div style={{ position: "relative" }}>
        <iframe
          id={"songsterr-window-" + id}
          src="https://songsterr.rs.hetorus.nl"
          title={"songsterr window " + id}
          width="100%"
          height="100%"
          onLoad={this.iframeOnLoad.bind(this)}
          style={{
            backgroundColor: "white",
            display: "block",
            position: "absolute",
          }}
        ></iframe>
        {this.state.loading && <Spinner />}
      </div>
    );
  }
}

export default Songsterr;
