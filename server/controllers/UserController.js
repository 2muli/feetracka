import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../connectDB.js";

// Utility function for database queries
const query = async (sql, params) => {
  try {
    const [results] = await db.query(sql, params);
    return results;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
};

// Error response utility
const errorResponse = (res, status, message) => {
  return res.status(status).json({ success: false, error: message });
};

// Success response utility
const successResponse = (res, status, data = {}) => {
  return res.status(status).json({ success: true, ...data });
};

// 🟢 1. GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await query(
      "SELECT id, first_name, second_name, last_name, email, phone, role, createdAt FROM users"
    );
    return successResponse(res, 200, { users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

export const Register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        error: "User with this email or phone already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await db.query(
      "INSERT INTO users (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, phone, hashedPassword]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        phone
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      error: "Registration failed. Please try again."
    });
  }
};
// 🟢 3. LOGIN (Fixed implementation)
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 400, "Email and password are required");
  }
  try {
    const [user] = await query(
      "SELECT id, first_name, last_name, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (!user || !user.password) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // 1 day
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 24 * 1000, // 1 day
      path: "/",
    });

    return successResponse(res, 200, {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// 🟢 4. VERIFY TOKEN MIDDLEWARE (Fixed implementation)
export const verifyToken = async (req, res, next) => {
  const token = req.cookies?.access_token || 
               req.headers?.authorization?.split(' ')[1];

  if (!token) {
    console.log('No authentication token found');
    return errorResponse(res, 401, "Unauthorized - No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [user] = await query("SELECT id, email, role FROM users WHERE id = ?", [decoded.id]);

    if (!user) {
      console.log(`Token valid but user not found: ${decoded.id}`);
      return errorResponse(res, 403, "Invalid user");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, 403, "Token expired");
    }
    console.error("Token verification error:", error);
    return errorResponse(res, 403, "Invalid token");
  }
};

// 🟢 5. GET LOGGED USER
export const getLoggedUser = async (req, res) => {
  try {
    if (!req.user) {
      return errorResponse(res, 401, "Not authenticated");
    }

    // Get full user details (excluding password)
    const [user] = await query(
      "SELECT id, first_name, second_name, last_name, email, phone, role, createdAt FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, {
      user: {
        id: user.id,
        firstName: user.first_name,
        secondName: user.second_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Error getting logged user:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, secondName = null, lastName } = req.body;

  if (!id || !firstName || !lastName) {
    return errorResponse(res, 400, "First name and last name are required");
  }

  if (req.body.email || req.body.phone || req.body.role || req.body.password) {
    return errorResponse(res, 403, "You are not allowed to update email, phone, role, or password");
  }

  try {
    const result = await query(
      "UPDATE users SET first_name = ?, second_name = ?, last_name = ? WHERE id = ?",
      [firstName, secondName, lastName, id]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, { message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};


// 🟢 7. DELETE USER
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return errorResponse(res, 400, "User ID is required");
  }

  try {
    const [result] = await query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return errorResponse(res, 404, "User not found");
    }

    // Clear the cookie if the deleted user is the currently logged-in user
    if (req.user && req.user.id === parseInt(id)) {
      res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return successResponse(res, 200, { message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// 🟢 8. GET USER BY ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return errorResponse(res, 400, "User ID is required");
  }

  try {
    const [user] = await query(
      "SELECT id, first_name, second_name, last_name, email, phone, role, createdAt FROM users WHERE id = ?",
      [id]
    );

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, {
      user: {
        id: user.id,
        firstName: user.first_name,
        secondName: user.second_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// 🟢 9. GET USER COUNT
export const getUserCount = async (req, res) => {
  try {
    const [rows] = await query("SELECT COUNT(*) AS count FROM users");
    return successResponse(res, 200, { count: rows[0].count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// 🟢 10. LOGOUT
export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/"
  });
  return successResponse(res, 200, { message: "Logged out successfully" });
};
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return errorResponse(res, 400, "All fields are required");
  }
  if (newPassword.length < 6) {
    return errorResponse(res, 400, "New password must be at least 6 characters long");
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    return errorResponse(res, 400, "Password must include uppercase, lowercase, number, and special character.");
  }
  if (newPassword !== confirmPassword) {
    return errorResponse(res, 400, "New password and confirm password do not match");
  }

  try {
    // Verify current password
    const [user] = await query(
      "SELECT id, password FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return errorResponse(res, 401, "Current password is incorrect");
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await query("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, user.id]);

    return successResponse(res, 200, { message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
export const resetPasswordWithToken = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || typeof newPassword !== "string") {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [hashedPassword, token]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Failed to reset password" });
  }
};
