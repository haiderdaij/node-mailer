require("dotenv").config();

const express = require("express");
const { movies } = require("./movies");
const http = require("http");
const { Server } = require("socket.io");
const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());

const PORT = 3500;
const IP_ADDRESS = process.env.IP_ADDRESS;

let transporter = nodemailer.createTransport({
  service: process.env.SERVICE_TYPE,
  auth: {
    user: process.env.USER_NAME,
    pass: process.env.PASS_WORD,
  },
});

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    let info = await transporter.sendMail({
      from: process.env.USER_NAME,
      to: to,
      subject: subject,
      text: text,
    });
    let messageId = info.messageId;
    console.log("Message sent: %s", messageId);
    res.send({
      message: "Email sent successfully",
      messageId: messageId,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send({ error: "Failed to send email" });
  }
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [`http://${IP_ADDRESS}:3000`, "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
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
