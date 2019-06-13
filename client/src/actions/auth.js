import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from "./types";
// import { setAlert } from "./alert";
import getTokenFromCookie from "../utils/getTokenFromCookie";
import setAuthToken from "../utils/setAuthToken";

// Load user
export const loadUser = () => async dispatch => {
  let token = getTokenFromCookie();
  if (token) {
    setAuthToken(token);
  }

  try {
    const res = await axios.get("/api/auth");
    console.log("AUTH SUCCESS");

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (error) {
    console.log("AUTH ERROR");
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register user
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ name, email, password });
  console.log("Body received");
  try {
    const res = await axios.post("/api/users", body, config);

    console.log("Response received");
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (error) {
    // const errors = error.response.data.errors;
    // console.log(errors.message);
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    // }
    console.log(error);
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login user
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);
    console.log(res);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (error) {
    // const errors = error.response.data.errors;

    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    // }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({
    type: CLEAR_PROFILE
  });
  dispatch({
    type: LOGOUT
  });
};
