const nodemailer = require("nodemailer");

// Create transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email
// to - Recipient email
// subject - Email subject
// html - Email content (HTML)
// Nodemailer send mail response
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Send notification to seller when selected for a project
// sellerEmail - Seller's email address
// sellerName - Seller's name
// project - Project details
exports.sendSellerSelectionNotification = async (
  sellerEmail,
  sellerName,
  project
) => {
  const subject = `Congratulations! You've been selected for project: ${project.title}`;
  const html = `
    <h1>Congratulations, ${sellerName}!</h1>
    <p>You have been selected for the following project:</p>
    <h2>${project.title}</h2>
    <p>${project.description}</p>
    <p><strong>Budget Range:</strong> ₹${project.budgetMin} - ₹${
    project.budgetMax
  }</p>
    <p><strong>Deadline:</strong> ${new Date(
      project.deadline
    ).toLocaleDateString()}</p>
    <p>Please log in to our platform to start the project and review all the details.</p>
    <p>Thank you for using our platform!</p>
  `;

  return sendEmail(sellerEmail, subject, html);
};

//Send notification when project is completed
// email - Recipient's email address
// name - Recipient's name
// project - Project details
// isBuyer - Whether the recipient is the buyer or seller
exports.sendProjectCompletionNotification = async (
  email,
  name,
  project,
  isBuyer
) => {
  const subject = `Project Completed: ${project.title}`;
  let html;

  if (isBuyer) {
    html = `
      <h1>Project Completed</h1>
      <p>Hello ${name},</p>
      <p>The seller has marked your project "${project.title}" as completed.</p>
      <p>Please log in to review the deliverables and provide feedback.</p>
      <p>Thank you for using our platform!</p>
    `;
  } else {
    html = `
      <h1>Project Completion Confirmed</h1>
      <p>Hello ${name},</p>
      <p>The buyer has confirmed the completion of the project "${project.title}".</p>
      <p>Please log in to see any feedback provided by the buyer.</p>
      <p>Thank you for using our platform!</p>
    `;
  }

  return sendEmail(email, subject, html);
};
