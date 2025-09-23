function mapSqlError(err) {
  if (!err) return "Unknown error";

  // ✅ Duplicate ticket number
  if (err.number === 2627 || err.number === 2601) {
    return "Ticket number already exists (duplicate key).";
  }

  // ✅ Missing Ticket Number
  if (err.message.includes("Ticket number is required")) {
    return "Ticket number is missing.";
  }

  // ✅ Missing Employee ID
  if (err.message.includes("EmployeeID cannot be null")) {
    return "Employee ID is required.";
  }

  // ✅ Foreign key constraint (invalid employeeID)
  if (err.message.includes("conflicted with the FOREIGN KEY constraint")) {
    return "Employee ID is not valid.";
  }

  // ✅ Date issues
  if (err.message.includes("Conversion failed when converting date")) {
    return "Invalid date format in Excel file.";
  }

  // ✅ Fallback
  return `Database error: ${err.message}`;
}

module.exports = mapSqlError;
