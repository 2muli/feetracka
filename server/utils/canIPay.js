import { db } from "../connectDB.js";

const termOrder = ['1', '2', '3'];

const termIndex = (term) => termOrder.indexOf(term);

export const canIPay = async (req, res, next) => {
  const { studentId, term, paymentId } = req.body;

  if (!studentId || !term) {
    return res.status(400).json({ error: "Student ID and term are required" });
  }

  const requestedTermIndex = termIndex(term.toString());
  if (requestedTermIndex === -1) {
    return res.status(400).json({ error: "Invalid term provided" });
  }

  try {
    const [studentRow] = await db.query(
      "SELECT class FROM students WHERE id = ?",
      [studentId]
    );
    const studentClass = studentRow[0]?.class;

    if (!studentClass) {
      return res.status(404).json({ error: "Student not found or class missing" });
    }
    if (term === '1') return next();

    if (paymentId) {
      const [existingPayment] = await db.query(
        "SELECT id FROM payments WHERE id = ? AND student_id = ? AND term = ?",
        [paymentId, studentId, term]
      );

      if (existingPayment.length > 0) {
        return next(); 
      }
    }

    const previousTerm = termOrder[requestedTermIndex - 1];

    const [paymentRow] = await db.query(
      "SELECT SUM(Amount_paid) AS totalPaid FROM payments WHERE student_id = ? AND term = ?",
      [studentId, previousTerm]
    );
    const totalPaid = paymentRow[0]?.totalPaid || 0;

    const [feeRow] = await db.query(
      "SELECT Amount_paid FROM fee_striucture WHERE class = ? AND term = ? LIMIT 1",
      [studentClass, previousTerm]
    );
    const feeAmount = feeRow[0]?.Amount_paid || 0;

    if (feeAmount === 0) return next();

    if (totalPaid === 0) return next();

    if (totalPaid < feeAmount) {
      return res.status(403).json({
        error: `Cannot pay for Term ${term} until Term ${previousTerm} is fully paid. Paid: ${totalPaid}, Required: ${feeAmount}`,
      });
    }

    // Passed all checks
    next();

  } catch (error) {
    console.error("Middleware error:", error);
    return res.status(500).json({ error: "Server error during fee validation" });
  }
};
