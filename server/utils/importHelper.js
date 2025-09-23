const ExcelJS = require("exceljs");

async function importTicketsFromExcel(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1); // first sheet
  const tickets = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const ticket = {
      employeeID: row.getCell(1).value,
      name: row.getCell(2).value,
      status: row.getCell(3).value,
      problem_dateOccurred: row.getCell(4).value,
      problemStatement: row.getCell(5).value,
      createdAt: row.getCell(6).value,
      updatedAt: row.getCell(7).value,
    };

    tickets.push(ticket);
  });

  return tickets;
}

module.exports = { importTicketsFromExcel };
