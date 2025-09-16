const ExcelJS = require("exceljs");

const exportTicketsToExcel = async (tickets) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Tickets");

  // Define columns (headers)
  worksheet.columns = [
    { header: "Ticket Number", key: "ticketNumber", width: 20 },
    { header: "Employee ID", key: "employeeID", width: 15 },
    { header: "Name", key: "name", width: 20 },
    { header: "Status", key: "status", width: 15 },
    { header: "Problem Date", key: "problem_dateOccurred", width: 20 },
    { header: "Problem Statement", key: "problemStatement", width: 40 },
    { header: "Created At", key: "createdAt", width: 20 },
    { header: "Updated At", key: "updatedAt", width: 20 },
  ];

  // Add rows (tickets data)


  tickets.forEach((ticket) => {
    worksheet.addRow({
      ticketNumber: ticket.ticketNumber,
      employeeID: ticket.employeeID,
      name: ticket.name,
      status: ticket.status,
      problem_dateOccurred: ticket.problem_dateOccurred,
      problemStatement: ticket.problemStatement,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    });
  });

  // 5️⃣ Style the header row
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF007ACC" }, // blue header background
  };

  // 6️⃣ Auto filter (dropdowns on headers in Excel)
  worksheet.autoFilter = {
    from: "A1",
    to: "H1", // A to H (8 columns)
  };

  // 7️⃣ Return the workbook (controller will send it in response)

  return workbook;
};

module.exports = {
  exportTicketsToExcel,
};
