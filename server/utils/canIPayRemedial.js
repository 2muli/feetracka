import { db } from "../connectDB.js";

const termOrder = ['1', '2', '3'];

const termIndex = (term) => termOrder.indexOf(term);
export const canIPayRemedial = async (req, res, next) => {
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

    // ✅ Always allow Term 1 payments
    if (term === '1') return next();

    // ✅ Allow editing if paymentId exists
    if (paymentId) {
      const [existingPayment] = await db.query(
        "SELECT id FROM remedialpayments WHERE id = ? AND student_id = ? AND term = ?",
        [paymentId, studentId, term]
      );
      if (existingPayment.length > 0) return next();
    }

    // ✅ Check if newcomer (no previous payments at all)
    const [allPayments] = await db.query(
      "SELECT COUNT(*) AS count FROM remedialpayments WHERE student_id = ?",
      [studentId]
    );
    const isNewcomer = Number(allPayments[0]?.count) === 0;

    if (isNewcomer) {
      // Allow first payment ONLY if it's for Term 1
      if (term === '1') return next();

      // ❌ Newcomer trying to pay Term 2 or 3 first — reject
      return res.status(403).json({
        error: `New student must first pay for Term 1 before proceeding to Term ${term}`,
      });
    }

    // ✅ Check previous term payments
    const previousTerm = termOrder[requestedTermIndex - 1];

    const [paymentRow] = await db.query(
      "SELECT SUM(Amount_paid) AS totalPaid FROM remedialpayments WHERE student_id = ? AND term = ?",
      [studentId, previousTerm]
    );
    const totalPaid = Number(paymentRow[0]?.totalPaid) || 0;

    const [feeRow] = await db.query(
      "SELECT Amount_paid FROM remedial WHERE term = ? LIMIT 1",
      [previousTerm]
    );
    const feeAmount = Number(feeRow[0]?.Amount_paid) || 0;

    if (totalPaid < feeAmount) {
      return res.status(403).json({
        error: `Cannot pay for Term ${term} until Term ${previousTerm} is fully paid. Paid: ${totalPaid}, Required: ${feeAmount}`,
      });
    }

    return next();

  } catch (error) {
    console.error("Middleware error:", error);
    return res.status(500).json({ error: "Server error during fee validation" });
  }
};
