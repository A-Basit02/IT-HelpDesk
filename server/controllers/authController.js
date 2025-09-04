const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { sql, pool } = require("../config/db");
require("dotenv").config();
const {
  getUserByEmail,
  getUserById,
  createUser,
} = require("../models/userModel");

const register = async (req, res) => {
  const { name, email, password, employeeID, department, branch, role } =
    req.decryptedBody;

  if (
    !name ||
    !email ||
    !password ||
    !employeeID ||
    !department ||
    !branch ||
    !role
  ) {
    return res
      .status(400)
      .sendEncrypted({ message: "All fields are required" });
  }

  try {
    const checkRequest = pool.request();
    const checkUser = await checkRequest
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    if (checkUser.recordset.length > 0) {
      return res.status(409).sendEncrypted({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertRequest = pool.request();
    await insertRequest
      .input("name", sql.VarChar, name)
      .input("email", sql.VarChar, email)
      .input("password", sql.VarChar, hashedPassword)
      .input("employeeID", sql.VarChar, employeeID)
      .input("department", sql.VarChar, department)
      .input("branch", sql.VarChar, branch)
      .input("role", sql.VarChar, role)
      .input("approval_status", sql.VarChar, "Pending") // ✅ add this
      .query(`
    INSERT INTO Users (name, email, password, employeeID, department, branch, role, approval_status)
    VALUES (@name, @email, @password, @employeeID, @department, @branch, @role, @approval_status)
  `);

    res.sendEncrypted({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res
      .status(500)
      .sendEncrypted({ message: "Server error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { employeeID, password } = req.decryptedBody;

    if (!employeeID || !password) {
      return res.sendEncrypted({
        message: "employeeID and password are required",
      });
    }

    const request = pool.request();

    const result = await request
      .input("employeeID", sql.VarChar, employeeID)
      .query("SELECT * FROM Users WHERE employeeID = @employeeID");

    if (result.recordset.length === 0) {
      return res.status(401).sendEncrypted({ message: "User not found" });
    }

    const user = result.recordset[0];

    if (user.approval_status === "Pending") {
      return res.sendEncrypted({
        message: "You are not allowed to access it, waiting for approval",
      });
    }
    console.log("\n\n\nuser.approval_status", user.approval_status);
    
    if (user.approval_status === "Reject") {
      return res.sendEncrypted({
        message: "You are not allowed to access this application",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).sendEncrypted({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { employeeID: user.employeeID },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.sendEncrypted({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        employeeID: user.employeeID,
        role: user.role,
        email: user.email,
        department: user.department,
        branch: user.branch,
        approval_status: user.approval_status,
      },
    }); 
  } catch (error) {
    console.error("Login error:", error);
    res.sendEncrypted({ message: "Server error" });
  }
};

const getLoggedInUser = async (req, res) => {
  try {
    const { employeeID } = req.user;

    const request = pool.request();
    const result = await request
      .input("employeeID", sql.VarChar, employeeID)
      .query(
        "SELECT id, name, email, role, department, branch, employeeID, approval_status FROM Users WHERE employeeID = @employeeID"
      );

    const user = result.recordset[0];

    if (!user) {
      return res.sendEncrypted({ message: "User not found" });
    }

    const token = jwt.sign(
      { employeeID: user.employeeID },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.sendEncrypted({
      message: "User verified",
      token,
      user,
    });
  } catch (err) {
    console.error("Get User Error:", err);
    res.sendEncrypted({ message: "Server error", error: err.message });
  }
};

module.exports = {
  register,
  login,
  getLoggedInUser,
};
