// Configurations and Imports
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const nodemailer = require("nodemailer");
const movies = require("./movies").movies;

// Initialize Express App
const app = express();
// app.use(express.json());

// Email Transporter Configuration
// const transporter = nodemailer.createTransport({
//   service: process.env.SERVICE_TYPE,
//   auth: {
//     user: process.env.USER_NAME,
//     pass: process.env.PASS_WORD,
//   },
// });

// Simple Root Route
app.get("/", (req, res) => res.send("Hello there"));

// Email Sending Route
// app.post("/send-email", async (req, res) => {
//   const { to, subject, text } = req.body;

//   try {
//     let info = await transporter.sendMail({
//       from: process.env.USER_NAME,
//       to,
//       subject,
//       text,
//     });
//     console.log("Message sent: %s", info.messageId);
//     res.send({
//       message: "Email sent successfully",
//       messageId: info.messageId,
//     });
//   } catch (error) {
//     console.error("Failed to send email:", error);
//     res.status(500).send({ error: "Failed to send email" });
//   }
// });

// HTTP Server and Socket.IO Configuration
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// Server Listen
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log("Server ready on port 3500."));

// server.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// Socket.IO Connection Handling
// io.on("connection", (socket) => {
//   console.log("New connection:", socket.id);
//   let movieIndex = 0;
//   const intervalId = setInterval(() => {
//     if (movieIndex < movies.length) {
//       socket.emit("movie", movies[movieIndex++]);
//     } else {
//       clearInterval(intervalId);
//     }
//   }, 6000);

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//     clearInterval(intervalId);
//   });
// });

module.exports = {
  app,
  // server,
};
