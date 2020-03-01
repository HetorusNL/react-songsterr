import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Navbar = ({ icon, iconPlayPause, title, navbarCallback }) => {
  return (
    <nav className="navbar bg-primary">
      <Link to="/">
        <h1>
          <i className={icon}></i> {title}
        </h1>
      </Link>
      <ul style={{ alignItems: "center" }}>
        <li>
          <i
            className={iconPlayPause}
            onClick={() => {
              navbarCallback("playPause");
            }}
          ></i>
        </li>
        <li style={{ marginLeft: "1em" }}>
          <i
            className="fas fa-minus-circle fa-2x"
            onClick={() => {
              navbarCallback("rowsMin");
            }}
          ></i>
        </li>
        <li style={{ marginLeft: "0.5em", marginRight: "0.5em" }}>Rows</li>
        <li>
          <i
            className="fas fa-plus-circle fa-2x"
            onClick={() => {
              navbarCallback("rowsPlus");
            }}
          ></i>
        </li>
        <li style={{ marginLeft: "1em" }}>
          <i
            className="fas fa-minus-circle fa-2x"
            onClick={() => {
              navbarCallback("columnsMin");
            }}
          ></i>
        </li>
        <li style={{ marginLeft: "0.5em", marginRight: "0.5em" }}>Columns</li>
        <li>
          <i
            className="fas fa-plus-circle fa-2x"
            onClick={() => {
              navbarCallback("columnsPlus");
            }}
          ></i>
        </li>
      </ul>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
};

Navbar.defaultProps = {
  title: "React Songsterr",
  iconPlayPause: "fa-play-circle fa-2x",
  icon: "fab fa-react",
  navbarCallback: undefined
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconPlayPause: PropTypes.string.isRequired,
  navbarCallback: PropTypes.func.isRequired
};

export default Navbar;
