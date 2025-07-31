import { checkIfUserIsActive } from "../utils/isActive.js";

export const ensureActiveUser = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. No user ID." });
    }

    const isActive = await checkIfUserIsActive(Number(userId));

    if (!isActive) {
      return res.status(403).json({ error: "Account is inactive. Contact admin." });
    }

    next();
  } catch (error) {
    console.error("Middleware error:", error.message);
    res.status(500).json({ error: "Server error validating user activity" });
  }
};
