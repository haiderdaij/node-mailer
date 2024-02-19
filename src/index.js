const express = require("express");
const { movies } = require("./movies");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const IP_ADDRESS = "192.168.1.5";

const io = new Server(server, {
  cors: {
    origin: `http://${IP_ADDRESS}:3000`,
    methods: ["GET", "POST"],
  },
});

server.listen(3500, "0.0.0.0", () => {
  console.log("Server is running on port 3500");
});

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  let movieIndex = 0;
  const intervalId = setInterval(() => {
    if (movieIndex < movies.length) {
      socket.emit("movie", movies[movieIndex]);
      movieIndex++;
    } else {
      clearInterval(intervalId);
    }
  }, 6000);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    clearInterval(intervalId);
  });
});
