import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Navbar = ({
  icon,
  iconPlayPause,
  title,
  ownGroupCode,
  connectedToRSOnline,
  navbarCallback,
}) => {
  const [createGroupClicked, setCreateGroupClicked] = useState(false);
  const [joinGroupClicked, setJoinGroupClicked] = useState(false);

  const onCreateGroupClicked = () => {
    console.log("clicked on the create group button!");
    navbarCallback("getGroupCode");
    setCreateGroupClicked(true);
    setJoinGroupClicked(false);
  };

  const onJoinGroupClicked = () => {
    console.log("clicked on the join group button!");
    setJoinGroupClicked(true);
    setCreateGroupClicked(false);
  };

  return (
    <nav className="navbar bg-primary" style={{ marginBottom: "0px" }}>
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
        <li style={{ marginLeft: "1em" }}>
          <i
            className="fas fa-minus-circle fa-2x"
            onClick={() => {
              navbarCallback("fontMin");
            }}
          ></i>
        </li>
        <li style={{ marginLeft: "0.5em", marginRight: "0.5em" }}>Font size</li>
        <li>
          <i
            className="fas fa-plus-circle fa-2x"
            onClick={() => {
              navbarCallback("fontPlus");
            }}
          ></i>
        </li>
      </ul>
      <ul style={{ alignItems: "center" }}>
        <li style={{ marginLeft: "0.5em", marginRight: "0.5em" }}>
          <h1
            style={{
              color: connectedToRSOnline ? "green" : "red",
            }}
          >
            RS Online
          </h1>
        </li>
        {createGroupClicked ? (
          <Fragment>
            <li style={{ marginLeft: "1em", marginRight: "0.5em" }}>
              Group code:
            </li>
            <li style={{ marginRight: "1em" }}>
              <input
                type="text"
                value={ownGroupCode}
                readOnly={true}
                style={{ margin: "0em", width: "5em" }}
              />
            </li>
          </Fragment>
        ) : (
          <li>
            <button className="btn" onClick={onCreateGroupClicked}>
              {joinGroupClicked ? "Create a group instead" : "Create Group"}
            </button>
          </li>
        )}
        {joinGroupClicked ? (
          <Fragment>
            <li style={{ marginLeft: "1em", marginRight: "0.5em" }}>
              Enter group code:
            </li>
            <li>
              <input
                type="text"
                maxLength={4}
                style={{
                  margin: "0em",
                  width: "5em",
                  textTransform: "uppercase", // SHOW the text (only) in uppercase
                }}
              />
            </li>
            <button
              className="btn"
              onClick={() => {
                navbarCallback("joinGroup");
              }}
            >
              Join Group
            </button>
          </Fragment>
        ) : (
          <li>
            <button className="btn" onClick={onJoinGroupClicked}>
              {createGroupClicked ? "Join a group instead" : "Join Group"}
            </button>
          </li>
        )}
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
  ownGroupCode: "",
  connectedToRSOnline: false,
  iconPlayPause: "fa-play-circle fa-2x",
  icon: "fab fa-react",
  navbarCallback: undefined,
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  ownGroupCode: PropTypes.string.isRequired,
  connectedToRSOnline: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
  iconPlayPause: PropTypes.string.isRequired,
  navbarCallback: PropTypes.func.isRequired,
};

export default Navbar;
