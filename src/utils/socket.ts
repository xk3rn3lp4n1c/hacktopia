// src/utils/socket.js
import { io } from "socket.io-client";
import { APP_API_ENDPOINT_URL } from "../../api/api_endpoint"; // Adjust the path as needed

// Connect to the Socket.IO server
const socket = io(APP_API_ENDPOINT_URL, {
  withCredentials: true,
});

/**
 * Emit an event to the server
 * @param {string} type - The event type
 * @param {any} msg - The message/data to send
 */
export const emitEvent = (type: any, msg: any) => {
  socket.emit(type, { content: msg, userId: 1 });
};

/**
 * Listen for an event from the server
 * @param {string} event - The event type to listen for
 * @param {function} callback - The callback function to execute when the event is received
 */
export const listenToEvent = (event: any, callback: any) => {
  socket.on(event, callback);
};

/**
 * Disconnect from the Socket.IO server
 */
export const disconnectSocket = () => {
  socket.disconnect();
};
