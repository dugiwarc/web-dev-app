import React, { Fragment } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
import Moment from "react-moment";

const Education = ({ education }) => {
  const educations =
    education &&
    education.map(education => (
      <tr key={education._id}>
        <td>{education.company}</td>
        <td className="hide-sm">{education.title}</td>
        <td>
          <Moment format="YYYY/MM/DD">{education.from}</Moment> -{" "}
          {education.to === null ? (
            " Now"
          ) : (
            <Moment format="YYYY/MM/DD">{education.to}</Moment>
          )}
        </td>
        <td>
          <button className="btn btn-danger">Delete</button>
        </td>
      </tr>
    ));
  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
            <th />
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array
};

export default Education;
