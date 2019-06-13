import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProfileTop = ({
  profile: {
    status,
    company,
    location,
    website,
    social,
    user: { name, avatar }
  }
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img className="round-img my-1" src={avatar} alt="" />
      <h1 className="large">{name}</h1>
      <p className="lead">Developer at Microsoft</p>
      <p>Seattle, WA</p>
      <div className="icons my-1">
        <Link href="#" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-globe fa-2x" />
        </Link>
        <Link href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter fa-2x" />
        </Link>
        <Link href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook fa-2x" />
        </Link>
        <Link href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin fa-2x" />
        </Link>
        <Link href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-youtube fa-2x" />
        </Link>
        <Link href="#" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram fa-2x" />
        </Link>
      </div>
    </div>
  );
};

ProfileTop.propTypes = { profile: PropTypes.object.isRequired };

export default ProfileTop;
