import React from "react";
import PropTypes from "prop-types";

const Songsterr = ({ songsterr: { id } }) => {
  return (
    <div>
      <p>A songsterr will be displayed here</p>
      songsterr id: {id}
    </div>
  );
};

Songsterr.propTypes = {
  songsterr: PropTypes.object.isRequired
};

export default Songsterr;
