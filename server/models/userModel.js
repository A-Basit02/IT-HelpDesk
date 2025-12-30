const { query } = require("mssql");
const { sql, pool } = require("../config/db");

const getUserByEmail = async (email) => {
  const request = pool.request();
  const result = await request
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");
  return result.recordset[0];
};

const getUserById = async (id) => {
  const request = pool.request();
  const result = await request
    .input("id", sql.Int, id)
    .query("SELECT * FROM Users WHERE id = @id");
  return result.recordset[0];
};

const getUserByEmployeeID = async (employeeID) => {
  const request = pool.request();
  const result = await request
    .input("employeeID", sql.VarChar, employeeID)
    .query("SELECT * FROM Users WHERE employeeID = @employeeID");
  return result.recordset[0];
};

const getAllUsers = async () => {
  const request = pool.request();
  const result = await request
    .query("SELECT id, name, email, employeeID, department, branch, role, approval_status FROM users ORDER BY id DESC ");
  return result.recordset;
};

const createUser = async (user) => {
  const request = pool.request();
  await request
    .input("name", sql.VarChar, user.name)
    .input("email", sql.VarChar, user.email)
    .input("password", sql.VarChar, user.password)
    .input("employeeID", sql.VarChar, user.employeeID)
    .input("department", sql.VarChar, user.department)
    .input("branch", sql.VarChar, user.branch)
    .input("role", sql.VarChar, user.role)
    .input("approval_status", sql.VarChar, user.approval_status)
    .query(`
      INSERT INTO Users (name, email, password, employeeID, department, branch, role, approval_status)
      VALUES (@name, @email, @password, @employeeID, @department, @branch, @role, @approval_status)
    `);
};

const updateUser = async (id, userData) => {
  const request = pool.request();
  await request
    .input("id", sql.Int, id)
    .input("name", sql.VarChar, userData.name)
    .input("email", sql.VarChar, userData.email)
    .input("employeeID", sql.VarChar, userData.employeeID)
    .input("department", sql.VarChar, userData.department)
    .input("branch", sql.VarChar, userData.branch)
    .input("role", sql.VarChar, userData.role)
    .input("approval_status", sql.VarChar, userData.approval_status)
    .query(`
      UPDATE Users 
      SET name = @name, email = @email, employeeID = @employeeID, 
          department = @department, branch = @branch, role = @role, approval_status = @approval_status
      WHERE id = @id
    `);
};

const updateUserPassword = async (employeeID, hashedPassword) => {
  const request = pool.request();
  await request
    .input("employeeID", sql.VarChar, employeeID)
    .input("password", sql.VarChar, hashedPassword)
    .query("UPDATE Users SET password = @password WHERE employeeID = @employeeID");
};

const deleteUser = async (id) => {
  const request = pool.request();
  await request
    .input("id", sql.Int, id)
    .query("DELETE FROM Users WHERE id = @id");
};

const setResetOTP = async (employeeID, otp, expiry) => {
  try {
    const request = pool.request();
    await request
      .input("employeeID", sql.VarChar, employeeID)
      .input("resetOTP", sql.VarChar, otp)
      .input("resetExpiry", sql.DateTime, expiry)
      .query(`
        UPDATE [users]
        SET [resetOTP] = @resetOTP, [resetExpiry] = @resetExpiry
        WHERE [employeeID] = @employeeID
      `);
  } catch (err) {
    console.error("Error in setResetOTP: ", err);
    throw err;
  }
};

const verifyResetExpiry = async (employeeID) => {
  const request = pool.request();
  const result = await request
    .input("employeeID", sql.VarChar, employeeID)
    .query(
      "SELECT id, employeeID, resetOTP, resetExpiry FROM users WHERE employeeID = @employeeID"
    );

  return result.recordset[0];
};

const clearResetOTP = async (employeeID) => {
  const request = pool.request();
  await request 
  .input("employeeID", sql.VarChar, employeeID)
  .query("UPDATE users SET resetOTP = NULL, resetExpiry = NULL WHERE employeeID = @employeeID");
}


module.exports = {
  getUserByEmail,
  getUserById,
  getUserByEmployeeID,
  getAllUsers,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  setResetOTP,
  verifyResetExpiry,
  clearResetOTP
};
