const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = async (to, subject, htmlMessage) => {
  try {
    const mailOptions = {
      from: {
        name: "IT Help Desk System",
        address: process.env.EMAIL_USER,
      },
      to,
      subject,
      html: htmlMessage,
      text: htmlMessage.replace(/<[^>]*>?/gm, ""), // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    console.log(`Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Email template for new ticket notification to admin
const newTicketEmailTemplate = (ticketData, userData) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🚨 New IT Support Ticket</h1>
  </div>
  
  <div style="padding: 20px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
    <p>Hello Admin,</p>
    <p>A new IT support ticket has been created and requires your attention.</p>
    
    <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #667eea;">
      <h3 style="color: #667eea; margin-top: 0;">Ticket Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Ticket Number:</td>
          <td style="padding: 8px; color: #333;">${ticketData.ticketNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Status:</td>
          <td style="padding: 8px; color: #333;">
            <span style="background: #ffc107; color: #000; padding: 4px 8px; border-radius: 3px; font-size: 12px;">
              ${ticketData.status}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Date Occurred:</td>
          <td style="padding: 8px; color: #333;">${new Date(ticketData.problem_dateOccurred).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Problem Statement:</td>
          <td style="padding: 8px; color: #333;">${ticketData.problemStatement}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
      <h3 style="color: #28a745; margin-top: 0;">User Information</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Name:</td>
          <td style="padding: 8px; color: #333;">${userData.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Employee ID:</td>
          <td style="padding: 8px; color: #333;">${userData.employeeID}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Department:</td>
          <td style="padding: 8px; color: #333;">${userData.department || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Branch:</td>
          <td style="padding: 8px; color: #333;">${userData.branch || 'N/A'}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/dashboard" 
         style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Ticket in Dashboard
      </a>
    </div>
    
    <p style="margin-top: 30px; color: #666; font-size: 14px;">
      Best regards,<br>
      IT Help Desk System
    </p>
  </div>
</div>
`;

// Email template for ticket status update notification to user
const ticketStatusUpdateEmailTemplate = (ticketData, userData, oldStatus, newStatus) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">📋 Ticket Status Updated</h1>
  </div>
  
  <div style="padding: 20px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
    <p>Hello ${userData.name},</p>
    <p>Your IT support ticket status has been updated.</p>
    
    <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
      <h3 style="color: #28a745; margin-top: 0;">Status Update</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Ticket Number:</td>
          <td style="padding: 8px; color: #333;">${ticketData.ticketNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Previous Status:</td>
          <td style="padding: 8px; color: #333;">
            <span style="background: #6c757d; color: white; padding: 4px 8px; border-radius: 3px; font-size: 12px;">
              ${oldStatus}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">New Status:</td>
          <td style="padding: 8px; color: #333;">
            <span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 3px; font-size: 12px;">
              ${newStatus}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #555;">Problem Statement:</td>
          <td style="padding: 8px; color: #333;">${ticketData.problemStatement}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/dashboard" 
         style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        View Ticket in Dashboard
      </a>
    </div>
    
    <p style="margin-top: 30px; color: #666; font-size: 14px;">
      Best regards,<br>
      IT Help Desk Team
    </p>
  </div>
</div>
`;



module.exports = {
  sendEmail,
  newTicketEmailTemplate,
  ticketStatusUpdateEmailTemplate,
}; 