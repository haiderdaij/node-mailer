require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

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
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;
