import React, { Component } from "react";
import PropTypes from "prop-types";

import Songsterr from "./Songsterr";

class Songsterrs extends Component {
  state = {
    zoom: 100,
  };

  static propTypes = {
    songsterrs: PropTypes.array.isRequired,
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  };

  createRefs() {
    for (let i = 0; i < this.props.songsterrs.length; i++) {
      var songsterr = this.props.songsterrs[i];
      if (!songsterr.hasOwnProperty("ref")) {
        songsterr.ref = React.createRef();
      }
    }
  }

  componentDidUpdate() {
    // props (passed by App.js) aren't updated here (yet)
    this.props.update();
  }

  playPause() {
    console.log("playpause in songsterrs called");
    for (let i = 0; i < this.props.songsterrs.length; i++) {
      var songsterr = this.props.songsterrs[i];
      songsterr.ref.current.playPause();
    }
  }

  rewind() {
    console.log("rewind in songsterrs called");
    for (let i = 0; i < this.props.songsterrs.length; i++) {
      var songsterr = this.props.songsterrs[i];
      songsterr.ref.current.rewind();
    }
  }

  broadcast(url) {
    console.log("broadcast in songsterrs called");
    for (let i = 0; i < this.props.songsterrs.length; i++) {
      var songsterr = this.props.songsterrs[i];
      songsterr.ref.current.broadcast(url);
    }
  }

  changeFont(value) {
    console.log("fontPlus or fontMin in songsterrs called");
    if (value > 0) {
      this.setState({ zoom: this.state.zoom + 25 });
    } else {
      if (this.state.zoom >= 50) {
        this.setState({ zoom: this.state.zoom - 25 });
      }
    }
  }

  render() {
    const { songsterrs, rows, columns } = this.props;
    this.createRefs();

    const songsterrContainerStyle = {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      height: "100%",
    };
    const songsterrStyle = {
      width: (100 / columns / this.state.zoom) * 100 + "%",
      height: (100 / rows / this.state.zoom) * 100 + "%",
      zoom: this.state.zoom / 100,
      MozTransform: "scale(" + this.state.zoom / 100 + ")",
      MozTransformOrigin: "0 0",
      OTransform: "scale(" + this.state.zoom / 100 + ")",
      OTransformOrigin: "0 0",
      WebkitTransform: "scale(" + this.state.zoom / 100 + ")",
      WebkitTransformOrigin: "0 0",
    };
    return (
      <div style={songsterrContainerStyle}>
        <div style={songsterrStyle}>
          {songsterrs.map((songsterr) => (
            <Songsterr
              ref={songsterr.ref}
              key={songsterr.id}
              songsterr={songsterr}
              rows={rows}
              columns={columns}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Songsterrs;
