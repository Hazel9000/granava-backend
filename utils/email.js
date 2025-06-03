import nodemailer from "nodemailer"

export const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || "GlobalJet Solutions <noreply@globaljetsolutions.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  }

  // Send email
  await transporter.sendMail(mailOptions)
}
