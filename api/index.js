require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const movies = require("../movies");

const PORT = process.env.PORT;
const IP_ADDRESS = process.env.IP_ADDRESS;

const app = express();
app.use(express.json());

let x = 10;
console.log(x);

app.use(
  cors({
    origin: `http://${IP_ADDRESS}:3000`,
    methods: ["GET", "POST"],
  })
);

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE_TYPE,
  auth: {
    user: process.env.USER_NAME,
    pass: process.env.PASS_WORD,
  },
});

app.get("/", (req, res) =>
  res.send("Hello there, this is a nodeMailer app based on SMTP.")
);

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    let info = await transporter.sendMail({
      from: process.env.USER_NAME,
      to,
      subject,
      text,
    });
    console.log("Message sent: %s", info.messageId);
    res.send({
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send({ error: "Failed to send email" });
  }
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `http://${IP_ADDRESS}:3000`,
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);
  let movieIndex = 0;
  const intervalId = setInterval(() => {
    if (movieIndex < movies.length) {
      socket.emit("movie", movies[movieIndex++]);
    } else {
      clearInterval(intervalId);
    }
  }, 6000);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    clearInterval(intervalId);
  });
});
