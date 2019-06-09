import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";

import PropTypes from "prop-types";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const { name, email, password, confirm } = formData;

  const handleChange = evt => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const onSubmit = async evt => {
    evt.preventDefault();
    if (password !== confirm) {
      setAlert("Passwords do not match", "danger", 1000);
    } else {
      register({ name, email, password });
      // setFormData({
      //   name: "",
      //   email: "",
      //   password: "",
      //   confirm: ""
      // });
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form
        className="form"
        action="create-profile.html"
        onSubmit={evt => {
          onSubmit(evt);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            value={name}
            onChange={evt => handleChange(evt)}
            placeholder="Name"
            name="name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={evt => handleChange(evt)}
            placeholder="Email Address"
            name="email"
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={evt => handleChange(evt)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={confirm}
            onChange={evt => handleChange(evt)}
            placeholder="Confirm Password"
            name="confirm"
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);
