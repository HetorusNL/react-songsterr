import React, { Component } from "react";
import PropTypes from "prop-types";

import Spinner from "../layout/Spinner";

class Songsterr extends Component {
  state = {
    loading: true
  };

  static propTypes = {
    songsterr: PropTypes.object.isRequired,
    rows: PropTypes.number.isRequired
  };

  iframeOnLoad(obj) {
    this.setState({ loading: false });
  }

  playPause() {
    var element = document.getElementById(
      "songsterr-window-" + this.props.songsterr.id
    );
    console.log(element);
    element.contentWindow.postMessage(
      JSON.stringify({ command: "play_pause" }),
      "http://localhost:3003"
    );

    // code to send a keyboard event (unusable at cross origin content)
    //const ke = new KeyboardEvent("keydown", {
    //  bubbles: true,
    //  cancelable: true,
    //  keyCode: 32
    //});
    //element.contentWindow.dispatchEvent(ke);
  }

  render() {
    const { rows } = this.props;
    const { id } = this.props.songsterr;
    console.log(this.props);

    return (
      <div>
        <p>A songsterr will be displayed here with id: {id}</p>
        {this.state.loading && (
          <Spinner height={(document.body.scrollHeight - 100) / rows - 25} />
        )}
        <iframe
          id={"songsterr-window-" + id}
          src="http://localhost:3003"
          title={"songsterr window " + id}
          width="100%"
          height={(document.body.scrollHeight - 100) / rows - 25}
          onLoad={this.iframeOnLoad.bind(this)}
          style={{
            backgroundColor: "white",
            display: this.state.loading ? "none" : "block"
          }}
        ></iframe>
      </div>
    );
  }
}

export default Songsterr;
