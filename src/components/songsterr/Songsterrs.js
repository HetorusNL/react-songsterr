import React, { Component } from "react";
import PropTypes from "prop-types";

import Songsterr from "./Songsterr";
import Spinner from "../layout/Spinner";

class Songsterrs extends Component {
  state = {};

  static propTypes = {
    songsterrs: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
  };

  createRefs() {
    console.log(
      "creating refs for " +
        this.props.songsterrs.length +
        " songsterr instances"
    );
    console.log(this.props.songsterrs.length);
    for (let i = 0; i < this.props.songsterrs.length; i++) {
      var songsterr = this.props.songsterrs[i];
      if (!songsterr.hasOwnProperty("ref")) {
        songsterr.ref = React.createRef();
      }
    }
  }

  playPause() {
    console.log("playpause in songsterrs called");
    for (let i = 0; i < this.props.songsterrs.length; i++) {
      var songsterr = this.props.songsterrs[i];
      songsterr.ref.current.playPause();
    }
  }

  changeFont(value) {
    console.log("fontPlus or fontMin in songsterrs called");
    for (let i = 0; i < this.props.songsterrs.length; i++) {
      var songsterr = this.props.songsterrs[i];
      songsterr.ref.current.changeFont(value);
    }
  }

  render() {
    const { songsterrs, loading, rows, columns } = this.props;

    this.createRefs();

    if (loading) {
      return <Spinner />;
    } else {
      const songsterrStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(" + columns + ", 1fr)",
      };
      console.log(songsterrStyle);
      return (
        <div style={songsterrStyle}>
          {console.log(songsterrs)}
          {songsterrs.map((songsterr) => (
            <Songsterr
              ref={songsterr.ref}
              key={songsterr.id}
              songsterr={songsterr}
              rows={rows}
            />
          ))}
        </div>
      );
    }
  }
}

export default Songsterrs;
