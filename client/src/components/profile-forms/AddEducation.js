import React, { Fragment, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addEducation } from "../../actions/profile";

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: ""
  });

  const [toDateDisabled, toggleDisabled] = useState(false);

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = formData;

  const onChange = evt =>
    setFormData({ ...formData, [evt.target.name]: evt.target.value });

  return (
    <Fragment>
      <h1 className="display-4 text-center">Add Your Education</h1>
      <p className="lead text-center">
        Add any developer/programming positions that you have had in the past
      </p>
      <small className="d-block pb-3">* = required field</small>
      <form
        onSubmit={evt => {
          evt.preventDefault();
          addEducation(formData, history);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="* Job degree"
            name="degree"
            value={degree}
            onChange={evt => onChange(evt)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="* Company"
            name="school"
            value={school}
            onChange={evt => onChange(evt)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="fieldofstudy"
            name="fieldofstudy"
            value={fieldofstudy}
            onChange={evt => onChange(evt)}
          />
        </div>
        <h6>From Date</h6>
        <div className="form-group">
          <input
            type="date"
            className="form-control form-control-lg"
            name="from"
            value={from}
            onChange={evt => onChange(evt)}
          />
        </div>
        <h6>To Date</h6>
        <div className="form-group">
          <input
            type="date"
            className="form-control form-control-lg"
            name="to"
            value={to}
            onChange={evt => onChange(evt)}
            disabled={toDateDisabled ? "disabled" : ""}
          />
        </div>
        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            name="current"
            checked={current}
            value={current}
            onChange={evt => {
              setFormData({
                ...formData,
                current: !current
              });
              toggleDisabled(!toDateDisabled);
            }}
            id="current"
          />
          <label className="form-check-label" for="current">
            Current Job
          </label>
        </div>
        <div className="form-group">
          <textarea
            className="form-control form-control-lg"
            placeholder="Job Description"
            name="description"
            value={description}
            onChange={evt => onChange(evt)}
          />
          <small className="form-text text-muted">
            Some of your responsabilities, etc
          </small>
        </div>
        <input type="submit" className="btn btn-info btn-block mt-4" />
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { addEducation }
)(withRouter(AddEducation));
