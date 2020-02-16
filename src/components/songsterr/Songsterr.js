import React, { Component } from "react";
import PropTypes from "prop-types";

import Spinner from "../layout/Spinner";

class Songsterr extends Component {
  state = {
    loading: true
  };

  static propTypes = {
    songsterr: PropTypes.object.isRequired
  };

  iframeOnLoad(obj) {
    console.log(obj);
    console.log(obj.target.scrollHeight);
    this.setState({ loading: false });
    //obj.style.height = 0;
    //obj.style.height = obj.contentWindow.document.body.scrollHeight + "px";
  }

  handleClick(obj) {
    console.log(obj);
    console.log("songsterr-window-" + this.props.songsterr.id);
    var element = document.getElementById(
//      "songsterr-window-" + this.props.songsterr.id
      "songsterr-window-1"
    );
    console.log(element);
    console.log("main domain: ", document.domain);
    console.log("iframe: ", element.contentWindow);
    const ke = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      keyCode: 32
    });
    element.contentWindow.postMessage(JSON.stringify({"command": "play_pause"}), "http://localhost:3003");
    //element.contentWindow.dispatchEvent(ke);

    // ugly hack to send play pause to two windows:
    var element2 = document.getElementById(
      "songsterr-window-2"
    );
    console.log(element2);
    element2.contentWindow.postMessage(JSON.stringify({"command": "play_pause"}), "http://localhost:3003");
  }

  render() {
    const { id } = this.props.songsterr;
    console.log(this.props);

    return (
      <div>
        <p>A songsterr will be displayed here with id: {id}</p>
        <p onClick={this.handleClick.bind(this)}>
          &lt; Click here to send "play" event to all Songsterrs &gt;
        </p>
        {this.state.loading && (
          <Spinner height={document.body.scrollHeight - 150} />
        )}
        <iframe
          id={"songsterr-window-" + id}
          src="http://localhost:3003"
          title={"songsterr window " + id}
          width="100%"
          height={document.body.scrollHeight - 150}
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
