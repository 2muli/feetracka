import { db } from "../connectDB.js";

export const checkIfUserIsActive = async (userId) => {
  if (!userId || typeof userId !== "number") {
    throw new Error("Invalid user ID");
  }

  const [rows] = await db.query("SELECT isActive FROM users WHERE id = ?", [userId]);

  return rows.length > 0 && rows[0].isActive === 1;
};
