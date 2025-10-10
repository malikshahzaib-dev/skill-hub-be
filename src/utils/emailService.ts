import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "malikshahzaib3295@gmail.com",
    pass: "euui hmjk burj qlfx",
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  data: string,
  template?: string
) => {
  try {
    const email = await transporter.sendMail({
      from: "malikshahzaib3295@gmail.com",
      to: to,
      subject: subject,
      text: data,
    });
    console.log("✅ email has been sent sucessfully", email.messageId);
  } catch (error) {
    console.log("❌ Error sending email:", error);
  }
};
