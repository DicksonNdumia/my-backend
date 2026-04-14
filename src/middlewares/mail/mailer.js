import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export const sendEmail = async (to, title) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM,
      subject: "Booking Confirmed 🎉",
      html: `
        <h2>Booking Confirmed</h2>
       
        <p>See you there 🔥</p>
      `,
    };

    await sgMail.send(msg);
    console.log("Email sent ✅");
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message);
    console.log(error.response.body);
  }
};
