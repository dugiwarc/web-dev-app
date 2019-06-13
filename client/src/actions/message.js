import { RECEIVE_MESSAGE, EMIT_ERROR } from "./types";

export const sendMessage = value => async dispatch => {
  let socket;
  try {
    socket.emit("chat-message", value);
    dispatch({
      type: RECEIVE_MESSAGE
    });
  } catch (error) {
    dispatch({
      type: EMIT_ERROR
    });
  }
};
