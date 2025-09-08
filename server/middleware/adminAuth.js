const verifyToken = require("./verifyToken");
const { getUserByEmployeeID } = require("../models/userModel");

const adminAuth = async (req, res, next) => {
  try {
    // First verify the token
    await verifyToken(req, res, async () => {
      const { employeeID } = req.user;

      // Get user details to check role
      const user = await getUserByEmployeeID(employeeID);

      if (!user) {
        return res.status(404).sendEncrypted({ message: "User not found" });
      }

      // Check if user is admin
      if (user.role !== "admin") {
        return res
          .status(403)
          .sendEncrypted({
            message: "Access denied. Admin privileges required.",
          });
      }

      // Add user info to request for use in controllers
      req.adminUser = user;
      next();
    });
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).sendEncrypted({ message: "Server error" });
  }
};

const superAdminAuth = async (req, res, next) => {
  try {
    await verifyToken(req, res, async () => {
      const { employeeID } = req.user;

      const user = await getUserByEmployeeID(employeeID);

      if (!user) {
        return res.status(404).sendEncrypted({ message: "User not found" });
      }

      if (user.role !== "super_admin") {
        return res
          .status(403)
          .sendEncrypted({
            message: "Access denied. Super Admin privileges required.",
          });
      }

      req.superAdminUser = user;
      next();
    });
  } catch (error) {
    console.error("SuperAdmin auth error:", error);
    res.status(500).sendEncrypted({ message: "Server error" });
  }
};

const adminORsuperAdmin = async (req, res, next) => {
  try {
    await verifyToken(req, res, async () => {
      const { employeeID } = req.user;

      const user = await getUserByEmployeeID(employeeID);

      if (!user) {
        return res.status(404).sendEncrypted({ message: "User not found" });
      }

      // ✅ Allow only admin or super_admin
      if (user.role === "admin" || user.role === "super_admin") {
        req.authUser = user; // store user info
        return next(); // ✅ Let the request continue
      }

      // ❌ If not admin/super_admin → block
      return res
        .status(403)
        .sendEncrypted({ message: "Access denied. Admin or Super Admin required." });
    });
  } catch (error) {
    console.error("AdminOrSuperAdmin auth error:", error);
    res.status(500).sendEncrypted({ message: "Server error" });
  }
};


module.exports = { adminAuth, superAdminAuth, adminORsuperAdmin };
