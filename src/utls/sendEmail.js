import nodemailer from "nodemailer";
import { emailTemplet } from "./emailTemplete.js";

export async function sendEmail(to, subject, userName = "", token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAILSENDER,
      pass: process.env.PASSWORDSENDER,
    },
  });

  const info = await transporter.sendMail({
    from: `"S-Shop" <${process.env.EMAILSENDER}>`,
    to,
    subject,
    html: emailTemplet(to, userName, token),
  });

  return info;
}
