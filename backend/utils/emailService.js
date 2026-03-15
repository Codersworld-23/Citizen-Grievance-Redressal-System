// import nodemailer from "nodemailer";
// import Notification from "../models/Notification.js";
// import dotenv from "dotenv";

// dotenv.config();

// /*
// Create Ethereal test account automatically
// */
// const testAccount = await nodemailer.createTestAccount();

// /*
// SMTP transporter
// */
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: testAccount.user,
//     pass: testAccount.pass
//   }
// });

// const DEMO_INBOX = process.env.DEMO_EMAIL || "citygrievanceportal@gmail.com";

// console.log("📧 Ethereal Email Service Ready");
// console.log("Test account:", testAccount.user);

// /*
// Send email
// */
// export const sendEmail = async (
//   to,
//   subject,
//   html,
//   userId = null,
//   complaintId = null,
//   type = null
// ) => {

//   try {

//     /*
//     Redirect fake authority domains
//     */
//     if (to.endsWith("@cgrs.in")) {
//       console.log(`📬 Redirecting ${to} → ${DEMO_INBOX}`);
//       to = DEMO_INBOX;
//     }

//     const info = await transporter.sendMail({
//       from: `"City Grievance Portal" <no-reply@cgrs.com>`,
//       to,
//       subject,
//       html
//     });

//     console.log("✅ Email sent:", info.messageId);

//     /*
//     Ethereal preview URL
//     */
//     console.log("📨 Preview URL:", nodemailer.getTestMessageUrl(info));

//     /*
//     Save notification in DB
//     */
//     if (userId) {
//       try {
//         await Notification.create({
//           userId,
//           email: to,
//           subject,
//           complaintId,
//           type
//         });
//       } catch (notifErr) {
//         console.warn("Notification logging failed:", notifErr.message);
//       }
//     }

//   } catch (err) {
//     console.error("❌ Email failed:", err.message);
//   }

// };

import { Resend } from "resend";
import Notification from "../models/Notification.js";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("📧 Resend email service initialized");

export const sendEmail = async (
  to,
  subject,
  html,
  userId = null,
  complaintId = null,
  type = null
) => {

  try {

    // Redirect fake authority domains to demo inbox
    if (to.endsWith("@cgrs.in")) {
      console.log(`Redirecting ${to} → ${process.env.DEMO_EMAIL}`);
      to = process.env.DEMO_EMAIL;
    }

    const { data, error } = await resend.emails.send({
      from: "City Grievance Portal <onboarding@resend.dev>",
      to,
      subject,
      html
    });

    if (error) {
      console.error("Resend error:", error);
      return;
    }

    console.log("📨 Email sent:", data.id);

    // Save notification log
    if (userId) {
      await Notification.create({
        userId,
        email: to,
        subject,
        complaintId,
        type
      });
    }

  } catch (err) {
    console.error("Email failed:", err.message);
  }

};