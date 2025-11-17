import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, html, text }) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
  return info;
}

// TEMP TEST – remove after testing
(async () => {
  try {
    await sendMail({
      to: "bakehub.mailer@gmail.com", // your own email
      subject: "Brevo SMTP Test",
      html: "<h1>SMTP test from BakeHub</h1>",
    });
    console.log("TEST EMAIL SENT");
  } catch (err) {
    console.error("TEST EMAIL ERROR:", err);
  }
})();
