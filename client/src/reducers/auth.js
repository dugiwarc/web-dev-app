import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from "../actions/types";
import Cookies from "universal-cookie";

import getTokenFromCookie from "../utils/getTokenFromCookie";
import deleteCookies from "../utils/deleteCookies";

const cookies = new Cookies();

const initialState = {
  token: getTokenFromCookie(),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      const { token } = payload;
      cookies.set("devToken", token, { maxAge: 50000 });
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
      deleteCookies();
      return {
        ...state,
        ...payload,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
}
