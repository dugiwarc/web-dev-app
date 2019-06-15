import uuid from "uuid";
import io from "socket.io-client";

import { SET_ALERT, REMOVE_ALERT } from "./types";

export const setAlert = (msg, alertType, timeout = 3000) => dispatch => {
  let socket;

  const sendChatAction = value => {
    socket.emit("chat-message", value);
    console.log("MESSAGE EMIT", value);
  };

  if (!socket) {
    socket = io(":3001");
    socket.on("chat-message", msg => {
      console.log("MESSAGE ON", msg);
      // dispatch({ type: "RECEIVE_MESSAGE", payload: msg });
    });
  }
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
