import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Navbar = ({
  icon,
  iconPlayPause,
  title,
  groupFailReason,
  userIsInGroup,
  connectedToRSOnline,
  navbarCallback,
}) => {
  const [joinGroupClicked, setJoinGroupClicked] = useState(false);
  const [joinGroupCode, setJoinGroupCode] = useState("");

  let joinGroupInputField = null;

  const onCreateGroupClicked = () => {
    console.log("clicked on the create group button!");
    navbarCallback("createGroup");
    setJoinGroupClicked(false);
  };

  const onJoinGroupClicked = () => {
    console.log("clicked on the join group button!");
    setJoinGroupClicked(true);
  };

  // when the 'Join Group' button is clicked, focus the group code input field
  useEffect(() => {
    if (joinGroupInputField && joinGroupClicked) joinGroupInputField.focus();
  }, [joinGroupInputField, joinGroupClicked]);

  const onLeaveGroupClicked = () => {
    console.log("clicked on the leave group button!");
    navbarCallback("leaveGroup");
    setJoinGroupClicked(false);
  };

  const joinGroup = () => {
    console.log("joinGroupCode: ", joinGroupCode);
    navbarCallback("joinGroup", { groupCode: joinGroupCode });
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
              color: connectedToRSOnline
                ? "var(--success-color)"
                : "var(--danger-color)",
            }}
          >
            RS Online
          </h1>
        </li>
        {userIsInGroup ? (
          <Fragment>
            <li style={{ marginLeft: "1em", marginRight: "0.5em" }}>
              Group Code: {userIsInGroup}
            </li>
            <li>
              <button className="btn" onClick={onLeaveGroupClicked}>
                Leave Group
              </button>
            </li>
          </Fragment>
        ) : (
          <Fragment>
            <li>
              <button className="btn" onClick={onCreateGroupClicked}>
                Create Group
              </button>
            </li>
            {joinGroupClicked ? (
              <Fragment>
                <li style={{ marginLeft: "1em", marginRight: "0.5em" }}>
                  Enter group code:
                </li>
                <li>
                  <input
                    value={joinGroupCode}
                    onChange={(e) => setJoinGroupCode(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") joinGroup();
                    }}
                    ref={(inputField) => {
                      joinGroupInputField = inputField;
                    }}
                    type="text"
                    maxLength={4}
                    style={{
                      margin: "0em",
                      width: "5em",
                      textTransform: "uppercase", // SHOW the text (only) in uppercase
                    }}
                  />
                </li>
                <button className="btn" onClick={() => joinGroup()}>
                  Join Group
                </button>
                {groupFailReason && (
                  <li style={{ color: "var(--danger-color" }}>
                    {groupFailReason}
                  </li>
                )}
              </Fragment>
            ) : (
              <li>
                <button className="btn" onClick={onJoinGroupClicked}>
                  Join Group
                </button>
              </li>
            )}
          </Fragment>
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
  groupFailReason: "",
  connectedToRSOnline: false,
  iconPlayPause: "fa-play-circle fa-2x",
  icon: "fab fa-react",
  navbarCallback: undefined,
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  groupFailReason: PropTypes.string.isRequired,
  connectedToRSOnline: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
  iconPlayPause: PropTypes.string.isRequired,
  navbarCallback: PropTypes.func.isRequired,
};

export default Navbar;
