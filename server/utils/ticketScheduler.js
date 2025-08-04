const cron = require('node-cron');
const { pool, sql, poolConnect } = require("../config/db");
const { sendEmail } = require("./emailService");
const { getAdminEmails } = require("./emailHelpers");

// Function to get stale tickets (open or in progress for 3+ days)
const getStaleTickets = async () => {
  try {
    await poolConnect;
    
    // Get tickets that are open or in progress for 3+ days (based on last update)
    const result = await pool
      .request()
      .query(`
        SELECT 
          t.ticketNumber,
          t.name,
          t.employeeID,
          t.status,
          t.problemStatement,
          t.createdAt,
          t.updatedAt,
          t.problem_dateOccurred,
          DATEDIFF(day, t.updatedAt, GETDATE()) as daysSinceLastUpdate
        FROM Tickets t
        WHERE t.status IN ('open', 'in progress')
        AND DATEDIFF(day, t.updatedAt, GETDATE()) >= 1
        ORDER BY t.updatedAt ASC
      `);
    
    return result.recordset;
  } catch (error) {
    console.error("Error fetching stale tickets:", error);
    return [];
  }
};

// Function to create email template for stale tickets notification
const createStaleTicketsEmailTemplate = (staleTickets) => {
  const ticketRows = staleTickets.map(ticket => `
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 12px; text-align: left;">${ticket.ticketNumber}</td>
      <td style="padding: 12px; text-align: left;">${ticket.name}</td>
      <td style="padding: 12px; text-align: left;">${ticket.employeeID}</td>
      <td style="padding: 12px; text-align: left;">
        <span style="
          background-color: ${ticket.status === 'open' ? '#ff9800' : '#2196f3'}; 
          color: white; 
          padding: 4px 8px; 
          border-radius: 4px; 
          font-size: 12px;
        ">
          ${ticket.status.toUpperCase()}
        </span>
      </td>
      <td style="padding: 12px; text-align: left;">${ticket.daysSinceLastUpdate} days</td>
      <td style="padding: 12px; text-align: left;">${new Date(ticket.updatedAt).toLocaleDateString()}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Stale Tickets Alert</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f44336; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .alert-box { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background-color: white; }
        th { background-color: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #ddd; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Stale Tickets Alert</h1>
          <p>${staleTickets.length} ticket(s) require immediate attention</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <strong>⚠️ Attention Required:</strong> The following tickets have been open or in progress for 3 or more days without any updates and require immediate attention from the IT support team.
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Created By</th>
                <th>Employee ID</th>
                <th>Status</th>
                <th>Days Since Last Update</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              ${ticketRows}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-radius: 5px;">
            <strong>📋 Action Required:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Review each ticket and update the status accordingly</li>
              <li>Contact the ticket creator if additional information is needed</li>
              <li>Prioritize tickets based on business impact</li>
              <li>Update ticket status to 'in progress' or 'resolved' as appropriate</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from the IT Help Desk System.</p>
            <p>Please log into the system to take action on these tickets.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to send stale tickets notification to admins
const sendStaleTicketsNotification = async () => {
  try {
    console.log("🔍 Checking for stale tickets...");
    
    const staleTickets = await getStaleTickets();
    
    if (staleTickets.length === 0) {
      console.log("✅ No stale tickets found");
      return;
    }
    
    console.log(`⚠️ Found ${staleTickets.length} stale ticket(s)`);
    
    // Get admin emails
    const adminEmails = await getAdminEmails();
    
    if (adminEmails.length === 0) {
      console.log("❌ No admin emails found");
      return;
    }
    
    // Create email content
    const htmlMessage = createStaleTicketsEmailTemplate(staleTickets);
    const subject = `🚨 Stale Tickets Alert: ${staleTickets.length} ticket(s) require attention`;
    
    // Send email to all admins
    for (const adminEmail of adminEmails) {
      try {
        await sendEmail(adminEmail, subject, htmlMessage);
        console.log(`✅ Stale tickets notification sent to ${adminEmail}`);
      } catch (emailError) {
        console.error(`❌ Failed to send email to admin ${adminEmail}:`, emailError);
      }
    }
    
    console.log("✅ Stale tickets notification process completed");
    
  } catch (error) {
    console.error("❌ Error in stale tickets notification process:", error);
  }
};

// Initialize the cron scheduler
const initializeTicketScheduler = () => {
  console.log("🕐 Initializing ticket scheduler...");
  
  // Schedule the job to run at 11 AM every day
  // Cron format: minute hour day month day-of-week
  cron.schedule('0 11 * * *', async () => {
    console.log("⏰ Running stale tickets check (every Day at 11AM)...");
    await sendStaleTicketsNotification();
  }, {
    scheduled: true,
    timezone: "Asia/Karachi" // Pakistan timezone
  });
  
  console.log("✅ Ticket scheduler initialized - will run every day at 11 AM (PKT)");
  console.log("📝 Note: This is set to 11 AM every day.");
};

// Function to manually trigger stale tickets check (for testing)
const manualStaleTicketsCheck = async () => {
  console.log("🔧 Manual stale tickets check triggered");
  await sendStaleTicketsNotification();
};

module.exports = {
  initializeTicketScheduler,
  sendStaleTicketsNotification,
  manualStaleTicketsCheck,
  getStaleTickets
}; 