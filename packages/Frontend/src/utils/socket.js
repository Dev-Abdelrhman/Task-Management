// // src/sockets/socket.js
// import { io } from "socket.io-client";

// const socket = io("http://localhost:9999", {
//   path: "/depiV1/socket.io",
//   transports: ["websocket"],
// });

// export default socket;
// src/sockets/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:9999", {
  transports: ["websocket"],
});

export default socket;
