const axios = require("axios");
const mailer = require("nodemailer");
require("dotenv").config();

let urlWBMAngebote = "https://www.wbm.de/wohnungen-berlin/angebote/";

function configureMail() {
  return mailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

function sendMail(to, subject, text) {
  const mail = configureMail();

  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to,
    subject,
    text,
  };

  mail.sendMail(mailOptions, (err) => {
    if (err) {
      console.log("failed to send email");
    } else {
      console.log("send");
      mail.close();
    }
  });
}

function monitorChange() {
  axios
    .get(urlWBMAngebote)
    .then((response) => {
      if (
        response.data.includes(
          "LEIDER HABEN WIR DERZEIT KEINE VERFÜGBAREN WOHNUNGSANGEBOTE"
        )
      ) {
        console.log("Keine Angebote");
      } else {
        console.log("Angebote");
        sendMail(process.env.EMAIL_USER, "WBM Angebote", "New angebote");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

setInterval(monitorChange, 600000);
console.log("Monitoring started");
