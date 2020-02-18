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
      <ul>
        <li>
          <i
            className={iconPlayPause}
            onClick={() => {
              navbarCallback("playPause");
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
  iconPlayPause: "fas fa-play",
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
