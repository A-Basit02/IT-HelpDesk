const { pool, sql, poolConnect } = require("../config/db");

// Get all admin users' emails
const getAdminEmails = async () => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .query("SELECT email FROM Users WHERE role = 'admin'");
    
    return result.recordset.map(user => user.email);
  } catch (error) {
    console.error("Error fetching admin emails:", error);
    return [];
  }
};

// Get user details by employeeID
const getUserDetailsByEmployeeID = async (employeeID) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("employeeID", sql.VarChar, employeeID)
      .query("SELECT name, email, employeeID, department, branch, role FROM Users WHERE employeeID = @employeeID");
    
    return result.recordset[0] || null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

// Get ticket details by ticket number
const getTicketDetails = async (ticketNumber) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("ticketNumber", sql.VarChar, ticketNumber)
      .query("SELECT * FROM Tickets WHERE ticketNumber = @ticketNumber");
    
    return result.recordset[0] || null;
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    return null;
  }
};

// Get old ticket status before update
const getOldTicketStatus = async (ticketNumber) => {
  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("ticketNumber", sql.VarChar, ticketNumber)
      .query("SELECT status FROM Tickets WHERE ticketNumber = @ticketNumber");
    
    return result.recordset[0]?.status || null;
  } catch (error) {
    console.error("Error fetching old ticket status:", error);
    return null;
  }
};

module.exports = {
  getAdminEmails,
  getUserDetailsByEmployeeID,
  getTicketDetails,
  getOldTicketStatus,
}; 