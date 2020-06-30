import React, { Fragment } from "react";

import spinner from "./spinner.svg";

const Spinner = () => (
  <Fragment>
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        position: "absolute",
        textAlign: "center",
        backgroundColor: "#00000077",
      }}
    >
      <img
        src={spinner}
        alt="Loading..."
        style={{ maxWidth: "75%", maxHeight: "75%", height: "auto" }}
      />
    </div>
  </Fragment>
);

export default Spinner;
