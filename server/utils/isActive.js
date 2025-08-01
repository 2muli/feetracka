import { db } from "../connectDB.js";

export const checkIfUserIsActive = async (req, res, next) => {
  const userId = Number(req.user?.id); // Convert to number

  try {   
    if (!userId || isNaN(userId)) {
      throw new Error("Invalid user ID");
    }

    const [rows] = await db.query("SELECT isActive FROM users WHERE id = ?", [userId]);

    if (!rows.length || rows[0].isActive !== 1) {
      return res.status(403).json({ error: "Account is inactive. Contact admin." });
    }

    next(); // All good, continue
  } catch (error) {
    console.error("Middleware error:", error.message);
    res.status(500).json({ error: "Server error validating user activity" });
  }
};
