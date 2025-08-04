const sql = require("mssql");
const pool = require("../config/db");

const getUserByEmail = async (email) => {
  const request = (await pool).request();
  const result = await request
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");
  return result.recordset[0];
};

const getUserById = async (id) => {
  const request = (await pool).request();
  const result = await request
    .input("id", sql.Int, id)
    .query("SELECT * FROM Users WHERE id = @id");
  return result.recordset[0];
};

const createUser = async (user) => {
  const request = (await pool).request();
  await request
    .input("name", sql.VarChar, user.name)
    .input("email", sql.VarChar, user.email)
    .input("password", sql.VarChar, user.password)
    .input("employeeID", sql.VarChar, user.employeeID)
    .input("department", sql.VarChar, user.department)
    .input("branch", sql.VarChar, user.branch)
    .input("role", sql.VarChar, user.role)
    .query(`
      INSERT INTO Users (name, email, password, employeeID, department, branch, role)
      VALUES (@name, @email, @password, @employeeID, @department, @branch, @role)
    `);
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
};
