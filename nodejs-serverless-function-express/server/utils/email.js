import nodemailer from "nodemailer";

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send emails to both customer and admin
const sendContactFormEmails = async (contactDetails) => {
  // Email content for the customer
  const customerMailOptions = {
    from: process.env.EMAIL_USER,
    to: contactDetails.email,
    subject: "Thank you for contacting Mantra Mountain",
    html: `
      <p>Dear ${contactDetails.name},</p>
      <p>Thank you for reaching out to us! We have received your message, and one of our team members will get back to you soon.</p>
      <p><strong>Your Message:</strong> ${contactDetails.message}</p>
      <p>Best regards,<br>Mantra Mountain</p>
    `,
  };

  // Email content for admin notification
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: "prabinparajuli496@gmail.com",
    subject: "New Contact Form Submission",
    html: `
      <p><strong>New Submission:</strong></p>
      <p><strong>Name:</strong> ${contactDetails.name}</p>
      <p><strong>Email:</strong> ${contactDetails.email}</p>
      <p><strong>Message:</strong> ${contactDetails.message}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <p>Please respond to the customer as soon as possible.</p>
    `,
  };

  // Send emails
  return Promise.all([
    transporter.sendMail(customerMailOptions),
    transporter.sendMail(adminMailOptions),
  ]).catch((error) => {
    console.error("Error sending emails:", error);
    // Continue with the submission even if email fails
  });
};

// Function to send booking emails to both customer and admin
const sendBookingEmails = async (
  formData,
  packageData,
  numberOfPeople,
  date
) => {
  // Send confirmation email to customer
  const confirmationEmailOptions = {
    from: "Mantra Mountain <info@mantramountain.com>",
    replyTo: "info@mantramountain.com",
    to: formData.email,
    subject: "Booking Confirmation - Mantra Mountain",
    html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4a4a4a;">Booking Confirmation</h1>
            <p>Dear ${formData.name},</p>
            <p>Thank you for booking <strong>${packageData.packageName}</strong> for <strong>${date}</strong>.</p>
            <p>Number of people: <strong>${numberOfPeople}</strong></p>
            <p>Your booking has been confirmed. We look forward to providing you with an unforgettable experience.</p>
            <p>Best regards,</p>
            <p>Mantra Mountain Team</p>
          </body>
        </html>
      `,
  };

  // Send notification email to admin
  const notificationEmailOptions = {
    from: "Mantra Mountain Booking System <info@mantramountain.com>",
    replyTo: "info@mantramountain.com",
    to: "prabinparajuli496@gmail.com, info@mantramountain.com",
    subject: "New Booking Received - Mantra Mountain",
    html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4a4a4a;">New Booking Received</h2>
            <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Package:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  packageData.packageName
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Customer Name:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  formData.name
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Customer Email:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  formData.email
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Contact Number:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  formData.contactNumber
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Number of People:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${numberOfPeople}</td>
              </tr>
            </table>
            
            <h3 style="color: #4a4a4a; margin-top: 20px;">Customer Message</h3>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${
              formData.message || "No message provided"
            }</p>
            
            <p style="font-size: 0.9em; color: #888; margin-top: 30px;">This is an automated message from the Mantra Mountain Booking System.</p>
          </body>
        </html>
      `,
  };

  // Send both emails in parallel
  return Promise.all([
    transporter.sendMail(confirmationEmailOptions),
    transporter.sendMail(notificationEmailOptions),
  ]).catch((error) => {
    console.error("Error sending booking emails:", error);
    // Continue with the booking process even if sending emails fails
  });
};

export { sendContactFormEmails, sendBookingEmails };
