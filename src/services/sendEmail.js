
import nodemailer from "nodemailer"

export async function sendEmail(to,subject,html) {
const transporter = nodemailer.createTransport({
    service:'gmail',
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAILSENDER,
    pass: process.env.PASSWORDSENDER,
  },
});

  const info = await transporter.sendMail({
    from: `"B-Shop" <${process.env.EMAILSENDER}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });

  return info;

}