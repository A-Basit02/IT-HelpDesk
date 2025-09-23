const { pool, sql, poolConnect } = require("../config/db");
const config = require("../config/db");
const { exportTicketsToExcel } = require("../utils/exportHelper");
const { importTicketsFromExcel } = require("../utils/importHelper");
const mapSqlError = require("../utils/errorMapper"); //
// const { pool, poolConnect } = require("../config/db");

const { 
  sendEmail, 
  newTicketEmailTemplate, 
  ticketStatusUpdateEmailTemplate
} = require("../utils/emailService");
const { 
  getAdminEmails, 
  getUserDetailsByEmployeeID, 
  getTicketDetails, 
  getOldTicketStatus 
} = require("../utils/emailHelpers");

const createTicket = async (req, res) => {
  try {
    await poolConnect;

    const employeeID = req.user.employeeID;
    const { status, problem_dateOccurred, problemStatement } = req.decryptedBody;

    const nameResult = await pool
      .request()
      .input("employeeID", sql.VarChar, employeeID)
      .query("SELECT name FROM Users WHERE employeeID = @employeeID");

    if (nameResult.recordset.length === 0) {
      return res.sendEncrypted({ message: "User not found" });
    }

    const name = nameResult.recordset[0].name;

    // Generate ticket number
    const seqResult = await pool
      .request()
      .query(
        `INSERT INTO TicketSequence DEFAULT VALUES; SELECT SCOPE_IDENTITY() AS ticketId`
      );

    const ticketId = seqResult.recordset[0].ticketId;
    const ticketNumber = `TKT-${String(ticketId).padStart(4, "0")}`;

    // Insert into Tickets
    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("status", sql.VarChar, status)
      .input("problem_dateOccurred", sql.DateTime, problem_dateOccurred)
      .input("problemStatement", sql.VarChar, problemStatement)
      .input("createdAt", sql.DateTime, new Date())
      .input("ticketNumber", sql.VarChar, ticketNumber)
      .input("employeeID", sql.VarChar, employeeID)
      .query(`INSERT INTO Tickets (name, status, problem_dateOccurred, problemStatement, createdAt, ticketNumber, employeeID)
              VALUES (@name, @status, @problem_dateOccurred, @problemStatement, @createdAt, @ticketNumber, @employeeID)`);

    // Send email notification to all admins
    try {
      const adminEmails = await getAdminEmails();
      const userData = await getUserDetailsByEmployeeID(employeeID);
      
      if (adminEmails.length > 0 && userData) {
        const ticketData = {
          ticketNumber,
          status,
          problem_dateOccurred,
          problemStatement,
        };

        const htmlMessage = newTicketEmailTemplate(ticketData, userData);
        const subject = `New IT Support Ticket: ${ticketNumber}`;

        // Send email to all admins
        for (const adminEmail of adminEmails) {
          try {
            await sendEmail(adminEmail, subject, htmlMessage);
          } catch (emailError) {
            console.error(`Failed to send email to admin ${adminEmail}:`, emailError);
          }
        }
      }
    } catch (emailError) {
      console.error("Error sending email notifications:", emailError);
      // Don't fail the ticket creation if email fails
    }

    res.sendEncrypted({ message: "Ticket created successfully", ticketNumber });
  } catch (err) {
    console.error("Create Ticket Error:", err);
    res.sendEncrypted({ message: "Server error", error: err.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    await poolConnect;
    
    // Get pagination, search, and status from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';  // 👈 new
    const offset = (page - 1) * limit;
    
    // Build WHERE clause dynamically
    let whereConditions = [];
    
    if (search.trim()) {
      whereConditions.push(`
        (ticketNumber LIKE '%${search}%' 
        OR name LIKE '%${search}%' 
        OR employeeID LIKE '%${search}%' 
        OR status LIKE '%${search}%' 
        OR problemStatement LIKE '%${search}%')
      `);
    }

    if (status.trim()) {
      whereConditions.push(`status = '${status}'`);
    }

    const whereClause = whereConditions.length > 0 
      ? "WHERE " + whereConditions.join(" AND ") 
      : "";

    // Count query
    const countQuery = `SELECT COUNT(*) as total FROM Tickets ${whereClause}`;
    const countResult = await pool.request().query(countQuery);
    
    const totalTickets = countResult.recordset[0].total;
    const totalPages = Math.ceil(totalTickets / limit);
    
    // Data query
    const result = await pool
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(`
        SELECT id, employeeID, name, ticketNumber, status, problem_dateOccurred, problemStatement, createdAt, updatedAt
        FROM Tickets
        ${whereClause}
        ORDER BY createdAt DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    res.sendEncrypted({ 
      tickets: result.recordset,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalTickets: totalTickets,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: limit
      }
    });
  } catch (err) {
    console.error("Get Tickets Error:", err);
    res.sendEncrypted({ message: "Server error", error: err.message });
  }
};

const getAllTicketsForAnalytics = async (req, res) => {
  try {
    await poolConnect;

    // Query to get all tickets (no pagination, for analytics only)
    const result = await pool.request().query(`
      SELECT id, employeeID, name, ticketNumber, status, problem_dateOccurred, problemStatement, createdAt, updatedAt
      FROM Tickets
      ORDER BY createdAt DESC
    `);

    res.sendEncrypted({
      tickets: result.recordset,
      totalTickets: result.recordset.length
    });
  } catch (err) {
    console.error("Get All Tickets For Analytics Error:", err);
    res.sendEncrypted({ message: "Server error", error: err.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const { status, problemStatement } = req.decryptedBody;

    // Get old status before update
    const oldStatus = await getOldTicketStatus(ticketNumber);

    await poolConnect;
    const request = pool.request()
      .input("ticketNumber", sql.VarChar, ticketNumber)
      .input("status", sql.VarChar, status || null)
      .input("problemStatement", sql.VarChar, problemStatement || null);

    const result = await request.query(`
      UPDATE tickets
      SET 
        status = ISNULL(@status, status),
        problemStatement = ISNULL(@problemStatement, problemStatement),
        updatedAt = GETDATE()
      WHERE ticketNumber = @ticketNumber
    `);

    if (result.rowsAffected[0] === 0) {
      return res.sendEncrypted({ message: "Ticket not found or not updated" });
    }

    // Send email notification only when admin updates ticket
    try {
      const ticketData = await getTicketDetails(ticketNumber);
      if (ticketData) {
        const userData = await getUserDetailsByEmployeeID(ticketData.employeeID);
        
        // Check if the current user is admin (by checking role)
        const currentUser = await getUserDetailsByEmployeeID(req.user.employeeID);
        
        if (userData && currentUser && currentUser.role === 'admin') {
          // Admin is updating the ticket - send notification to the ticket creator
          const htmlMessage = ticketStatusUpdateEmailTemplate(ticketData, userData, oldStatus, status || oldStatus);
          const subject = `Your Ticket Has Been Updated by Admin: ${ticketNumber}`;
          await sendEmail(userData.email, subject, htmlMessage);
        }
      }
    } catch (emailError) {
      console.error("Error sending email notifications:", emailError);
      // Don't fail the ticket update if email fails
    }

    res.sendEncrypted({ message: "✅ Ticket updated successfully" });
  } catch (error) {
    console.error("❌ Error updating ticket:", error);
    res.sendEncrypted({ message: "Server error", error: error.message });
  }
};

const getTicketById = async (req, res) => {
  try {
    await poolConnect;

    const { ticketNumber } = req.params;

    const result = await pool
      .request()
      .input("ticketNumber", sql.VarChar, ticketNumber)
      .query("SELECT * FROM tickets WHERE ticketNumber = @ticketNumber");

    if (result.recordset.length === 0) {
      return res.sendEncrypted({ message: "Ticket not found" });
    }

    res.sendEncrypted(result.recordset[0]);
  } catch (error) {
    console.error("❌ Error fetching ticket by ID:", error);
    res.sendEncrypted({ message: "Server error", error: error.message });
  }
};

const getTicketsByEmployeeId = async (req, res) => {
  try {
    const employeeID = req.user.employeeID;

    await poolConnect;
    
    // Get pagination and search parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;
    
    // Build WHERE clause for search
    let whereClause = `WHERE employeeID = @employeeID`;
    let additionalSearch = '';
    
    if (search.trim()) {
      additionalSearch = `
        AND (ticketNumber LIKE '%${search}%' 
        OR status LIKE '%${search}%' 
        OR problemStatement LIKE '%${search}%')
      `;
    }
    
    // Get total count for pagination with search
    const countQuery = `SELECT COUNT(*) as total FROM tickets ${whereClause} ${additionalSearch}`;
    const countResult = await pool
      .request()
      .input("employeeID", sql.VarChar, employeeID)
      .query(countQuery);
    
    const totalTickets = countResult.recordset[0].total;
    const totalPages = Math.ceil(totalTickets / limit);
    
    if (totalTickets === 0) {
      return res.sendEncrypted({ 
        tickets: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalTickets: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: limit
        }
      });
    }
    
    // Get paginated tickets with search
    const result = await pool
      .request()
      .input("employeeID", sql.VarChar, employeeID)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(`
        SELECT * FROM tickets 
        ${whereClause} ${additionalSearch}
        ORDER BY createdAt DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    res.sendEncrypted({
      tickets: result.recordset,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalTickets: totalTickets,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: limit
      }
    });
  } catch (error) {
    console.error("❌ Error fetching user tickets:", error);
    res.sendEncrypted({ message: "Server error", error: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    await poolConnect;
    const result = await pool
      .request()
      .input("ticketNumber", sql.VarChar, ticketNumber)
      .query("DELETE FROM tickets WHERE ticketNumber = @ticketNumber");

    if (result.rowsAffected[0] === 0) {
      return res.sendEncrypted({ message: "Ticket not found" });
    }

    res.sendEncrypted({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting ticket:", error);
    res.sendEncrypted({ message: "Server error", error: error.message });
  }
};

// Controller to manually check stale tickets (for testing)
const checkStaleTickets = async (req, res) => {
  try {
    const { manualStaleTicketsCheck } = require('../utils/ticketScheduler');
    
    await manualStaleTicketsCheck();
    
    res.sendEncrypted({ 
      message: "Stale tickets check completed successfully",
      note: "Check server logs for details"
    });
  } catch (error) {
    console.error("❌ Error checking stale tickets:", error);
    res.sendEncrypted({ message: "Server error", error: error.message });
  }
};


// 🔹 Export only current user's tickets
const exportMyTickets = async (req, res) => {
  try {
    const employeeID = req.user.employeeID; // 👈 from token
    await poolConnect;

    // Fetch all tickets of this user (no pagination)
    const result = await pool
      .request()
      .input("employeeID", sql.VarChar, employeeID)
      .query(`
        SELECT ticketNumber, employeeID, name, status, problem_dateOccurred, problemStatement, createdAt, updatedAt
        FROM Tickets
        WHERE employeeID = @employeeID
        ORDER BY createdAt DESC
      `);

    const tickets = result.recordset;

    if (!tickets || tickets.length === 0) {
      return res.sendEncrypted({ message: "No tickets found for this user" });
    }

    // Generate workbook
    const workbook = await exportTicketsToExcel(tickets);

    // Send Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=my_tickets.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("❌ Error exporting my tickets:", error);
    res.sendEncrypted({ message: "Server error", error: error.message });
  }
};

// 🔹 Export all tickets (admin / super_admin)
const exportAllTickets = async (req, res) => {
  try {
    await poolConnect;

    // Fetch all tickets (no pagination)
    const result = await pool.request().query(`
      SELECT ticketNumber, employeeID, name, status, problem_dateOccurred, problemStatement, createdAt, updatedAt
      FROM Tickets
      ORDER BY createdAt DESC
    `);

    const tickets = result.recordset;

    if (!tickets || tickets.length === 0) {
      return res.sendEncrypted({ message: "No tickets found in system" });
    }

    // Generate workbook
    const workbook = await exportTicketsToExcel(tickets);

    // Send Excel file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=all_tickets.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("❌ Error exporting all tickets:", error);
    res.sendEncrypted({ message: "Server error", error: error.message });
  }
};

// Controller for imoport Tickits from excel file 

// const importTickets = async (req, res) => {
//   try {
//     await poolConnect;

//     if (!req.file) {
//       return res.sendEncrypted({ message: "No file uploaded" });
//     }

//     // Parse Excel into objects
//     const tickets = await importTicketsFromExcel(req.file.path);

//     if (!tickets.length) {
//       return res.sendEncrypted({ message: "Excel file is empty!" });
//     }

//     // Insert each ticket into DB
//     for (const ticket of tickets) {
//       await pool.request().query(`
//         INSERT INTO Tickets 
//         (ticketNumber, employeeID, name, status, problem_dateOccurred, problemStatement, createdAt, updatedAt)
//         VALUES (
//           '${ticket.ticketNumber}', 
//           '${ticket.employeeID}', 
//           '${ticket.name}', 
//           '${ticket.status}', 
//           '${ticket.problem_dateOccurred}', 
//           '${ticket.problemStatement}', 
//           '${ticket.createdAt}', 
//           '${ticket.updatedAt}'
//         )
//       `);
//     }

//     res.sendEncrypted({ message: "Tickets imported successfully" });
//   } catch (error) {
//     console.error("❌ Error importing tickets:", error);
//     res.sendEncrypted({ message: "Server error", error: error.message });
//   }
// };

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date.toISOString(); // SQL Server accepts ISO
};

const importTickets = async (req, res) => {
  try {
    await poolConnect;

    if (!req.file) {
      return res.sendEncrypted({ 
        message: "No file uploaded", 
        errors: ["Please upload an Excel file first."] 
      });
    }

    const tickets = await importTicketsFromExcel(req.file.path);

    if (!tickets.length) {
      return res.sendEncrypted({ 
        message: "Excel file is empty!", 
        errors: ["No rows found in Excel file."] 
      });
    }

    let successCount = 0;
    let errors = [];

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];

      try {
        // ✅ Validate
        if (!ticket.employeeID) {
          throw new Error("EmployeeID cannot be null");
        }
        if (
          ticket.problem_dateOccurred &&
          isNaN(new Date(ticket.problem_dateOccurred).getTime())
        ) {
          throw new Error(`Invalid date format: ${ticket.problem_dateOccurred}`);
        }

        // ✅ Generate new ticket number (same logic as createTicket)
        const seqResult = await pool
          .request()
          .query(
            `INSERT INTO TicketSequence DEFAULT VALUES; SELECT SCOPE_IDENTITY() AS ticketId`
          );

        const ticketId = seqResult.recordset[0].ticketId;
        const ticketNumber = `TKT-${String(ticketId).padStart(4, "0")}`;

        // ✅ Safe insert into Tickets
        await pool
          .request()
          .input("ticketNumber", sql.VarChar, ticketNumber)
          .input("employeeID", sql.VarChar, ticket.employeeID)
          .input("name", sql.VarChar, ticket.name || "")
          .input("status", sql.VarChar, ticket.status || "Pending")
          .input("problem_dateOccurred", sql.DateTime, ticket.problem_dateOccurred || null)
          .input("problemStatement", sql.VarChar, ticket.problemStatement || "")
          .input("createdAt", sql.DateTime, ticket.createdAt || new Date())
          .input("updatedAt", sql.DateTime, ticket.updatedAt || new Date())
          .query(`
            INSERT INTO Tickets 
            (ticketNumber, employeeID, name, status, problem_dateOccurred, problemStatement, createdAt, updatedAt)
            VALUES (@ticketNumber, @employeeID, @name, @status, @problem_dateOccurred, @problemStatement, @createdAt, @updatedAt)
          `);

        successCount++;
      } catch (err) {
        const userFriendly = mapSqlError(err);
        errors.push(`Row ${i + 2}: ${userFriendly}`);
      }
    }

    return res.sendEncrypted({
      message: `Import completed:\nTickets inserted = ${successCount}\nFailed = ${errors.length}`,
      errors,
    });
  } catch (error) {
    console.error("❌ Error importing tickets:", error);
    return res.sendEncrypted({ 
      message: "Unexpected server error", 
      errors: [error.message] 
    });
  }
};



module.exports = {
  createTicket,
  getTicketById,
  getAllTickets,
  getAllTicketsForAnalytics,
  updateTicket,
  deleteTicket,
  getTicketsByEmployeeId,
  checkStaleTickets,
  exportAllTickets,
  exportMyTickets, 
  importTickets
};

