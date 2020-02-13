import React, { Component } from "react";
import PropTypes from "prop-types";

class Songsterr extends Component {
  // = ({ songsterr: { id } }) => {

  static propTypes = {
    songsterr: PropTypes.object.isRequired
  };

  resizeIframe(obj) {
    console.log(obj);
    console.log(obj.target.scrollHeight);
    //obj.style.height = 0;
    //obj.style.height = obj.contentWindow.document.body.scrollHeight + "px";
  }

  handleClick(obj) {
    console.log(obj);
    console.log("songsterr-window-" + this.props.songsterr.id);
    var element = document.getElementById(
      "songsterr-window-" + this.props.songsterr.id
    );
    console.log(element);
    console.log(element);
    const ke = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      keyCode: 32
    });
    element.contentWindow.dispatchEvent(ke);
  }

  render() {
    const { id } = this.props.songsterr;
    console.log(this.props);

    return (
      <div>
        <p onClick={this.handleClick.bind(this)}>
          A songsterr will be displayed here with id: {id}
        </p>
        <iframe
          id={"songsterr-window-" + id}
          src="https://songsterr.com"
          title={"songsterr window " + id}
          width="100%"
          height={document.body.scrollHeight - 150}
          onLoad={this.resizeIframe.bind(this)}
        ></iframe>
      </div>
    );
  }
}

export default Songsterr;
