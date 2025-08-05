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
    .query("SELECT id, name, email, employeeID, department, branch, role, createdAt FROM Users ORDER BY createdAt DESC");
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
    .query(`
      INSERT INTO Users (name, email, password, employeeID, department, branch, role)
      VALUES (@name, @email, @password, @employeeID, @department, @branch, @role)
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
    .query(`
      UPDATE Users 
      SET name = @name, email = @email, employeeID = @employeeID, 
          department = @department, branch = @branch, role = @role
      WHERE id = @id
    `);
};

const updateUserPassword = async (id, hashedPassword) => {
  const request = pool.request();
  await request
    .input("id", sql.Int, id)
    .input("password", sql.VarChar, hashedPassword)
    .query("UPDATE Users SET password = @password WHERE id = @id");
};

const deleteUser = async (id) => {
  const request = pool.request();
  await request
    .input("id", sql.Int, id)
    .query("DELETE FROM Users WHERE id = @id");
};

module.exports = {
  getUserByEmail,
  getUserById,
  getUserByEmployeeID,
  getAllUsers,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
};
