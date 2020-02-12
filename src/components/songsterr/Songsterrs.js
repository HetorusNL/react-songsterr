import React from "react";
import PropTypes from "prop-types";

import Songsterr from "./Songsterr";
import Spinner from "../layout/Spinner";

const Songsterrs = ({ loading, songsterrs, rows, columns }) => {
  if (loading) {
    return <Spinner />;
  } else {
    const songsterrStyle = {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)"
    };
    return (
      <div style={songsterrStyle}>
        {console.log(songsterrs)}
        {songsterrs.map(songsterr => (
          <Songsterr key={songsterr.id} songsterr={songsterr} />
        ))}
      </div>
    );
  }
};

Songsterrs.propTypes = {
  songsterrs: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired
};

export default Songsterrs;
