import { db } from "../connectDB.js";

export const addRemedialPayment = async (req, res) => {
  const { studentId, amountPaid, paymentMethod, term } = req.body;
  
  if (!studentId || !amountPaid || !paymentMethod || !term) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Verify student exists
    const [student] = await db.query("SELECT id FROM students WHERE id = ?", [studentId]);
    if (student.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const createdAt = new Date();
    const [result] = await db.query(
      `INSERT INTO remedialpayments (
        student_id, 
        Amount_paid, 
        payment_method, 
        term, 
        createdAt
      ) VALUES (?, ?, ?, ?, ?)`,
      [studentId, amountPaid, paymentMethod, term, createdAt]
    );

    res.status(201).json({ 
      message: "Remedial Payment recorded successfully", 
      paymentId: result.insertId 
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRemedialPayments = async (req, res) => {
  try {
    const [payments] = await db.query(
      `SELECT 
        p.id,
        p.student_id,   
        p.Amount_paid,
        p.payment_method,
        p.term,
        p.createdAt,
        s.first_name,
        s.second_name,
        s.last_name,
        s.student_AdmNo AS admissionNo
      FROM remedialpayments p
      JOIN students s ON p.student_id = s.id
      ORDER BY p.createdAt DESC`
    );
    
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};  
export const getRemedialPaymentByStudentId = async (req, res) => {
  const { studentId } = req.params;
  if (!studentId) return res.status(400).json({ error: "Student ID is required" });

  try {
    const [payments] = await db.query(
      `SELECT 
        p.id,
        p.student_id,   
        p.Amount_paid,
        p.payment_method,
        p.term,
        p.createdAt,
        s.first_name,
        s.second_name,
        s.class,
        s.last_name,
        s.student_AdmNo AS admissionNo  
      FROM remedialpayments p
      JOIN students s ON p.student_id = s.id
      WHERE p.student_id = ?
      ORDER BY p.createdAt DESC`,
      [studentId]
    );
    if(payments.length === 0){
      return res.status(404).json({ error: "Payments not found for this student" });
    } 
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments by student ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getRemedialTodayPayments = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(), 
      today.getMonth(), 
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(), 
      today.getMonth(), 
      today.getDate(), 
      23, 59, 59
    );

    const [result] = await db.query(
      `SELECT SUM(Amount_paid) AS totalPaidToday 
       FROM remedialpayments 
       WHERE createdAt BETWEEN ? AND ?`,
      [startOfDay, endOfDay]
    );

    res.status(200).json({ 
      totalPaidToday: result[0].totalPaidToday || 0 
    });
  } catch (error) {
    console.error("Error fetching today's payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRemedialTotalPayments = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT SUM(Amount_paid) AS totalPaid FROM remedialpayments"
    );
    res.status(200).json({ 
      totalPaid: result[0].totalPaid || 0 
    });
  } catch (error) {
    console.error("Error fetching total payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getRemedialBalance = async (req, res) => {
  try {
    const [[{ totalExpected }]] = await db.query(
      "SELECT SUM(Amount_paid) AS totalExpected FROM remedial"
    );
    const [[{ totalPaid }]] = await db.query(
      "SELECT SUM(Amount_paid) AS totalPaid FROM remedialpayments"
    );

    res.status(200).json({ 
      totalExpected: totalExpected || 0, 
      totalPaid: totalPaid || 0, 
      balance: (totalExpected || 0) - (totalPaid || 0) 
    });
  } catch (error) {
    console.error("Error calculating balance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getRemedialPaymentSummary = async (req, res) => {
  const studentId = req.query.studentId;
  const term = req.query.term;

  if (!studentId || !term) {
    return res.status(400).json({ 
      error: "Student ID and term are required" 
    });
  }

  try {
    const [[student]] = await db.query(
      `SELECT class, first_name, second_name, last_name 
       FROM students WHERE id = ?`,
      [studentId]
    );
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const [[feeRow]] = await db.query(
      `SELECT Amount_paid 
       FROM remedial 
       WHERE class = ? AND term = ?`,
      [student.class, term]
    );
    const requiredFee = feeRow?.Amount_paid || 0;

    const [[payment]] = await db.query(
      `SELECT SUM(Amount_paid) AS totalPaid 
       FROM remedialpayments 
       WHERE student_id = ? AND term = ?`,
      [studentId, term]
    );
    const totalPaid = payment.totalPaid || 0;

    res.status(200).json({
      fullName: `${student.first_name} ${student.second_name} ${student.last_name}`,
      requiredFee,
      totalPaid,
      balance: requiredFee - totalPaid
    });
  } catch (error) {
    console.error("Error fetching payment summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getRemedialStudentBalance = async (req, res) => {
  const { class: studentClass, term, minBalance } = req.query;

  if (!studentClass || !term || !minBalance) {
    return res.status(400).json({ error: "Class, term, and minBalance are required" });
  }

  try {
    const [results] = await db.query(
      `
      SELECT 
        s.id AS studentId,
        s.student_AdmNo,
        s.class,
        s.first_name,
        s.second_name,
        s.last_name,
        fs.Amount_paid AS requiredFee,
        IFNULL(SUM(p.Amount_paid), 0) AS totalPaid,
        (fs.Amount_paid - IFNULL(SUM(p.Amount_paid), 0)) AS balance
      FROM students s
      JOIN remedial fs 
        ON fs.term = ?
      LEFT JOIN remedialpayments p 
        ON s.id = p.student_id AND p.term = ?
      WHERE s.class = ?
      GROUP BY s.id, fs.Amount_paid
      HAVING balance >= ?
      `,
      [term, term, studentClass, minBalance]
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching student balances:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateRemedialPayment = async (req, res) => {
  const { id } = req.params;
  const { studentId, amountPaid, paymentMethod, term } = req.body;

  if (!id || !studentId || !amountPaid || !paymentMethod || !term) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [student] = await db.query(
      "SELECT id FROM students WHERE id = ?", 
      [studentId]
    );
    if (student.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const [result] = await db.query(
      `UPDATE remedialpayments SET 
        student_id = ?, 
        Amount_paid = ?, 
        payment_method = ?, 
        term = ? 
       WHERE id = ?`,
      [studentId, amountPaid, paymentMethod, term, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Remedial payment not found" });
    }

    res.status(200).json({ message: "Remedial payment updated successfully" });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRemedialPaymentById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Remedial Payment ID is required" });

  try {
    const [payment] = await db.query(
      `SELECT 
        p.id,
        p.student_id,
        p.Amount_paid,
        p.payment_method,
        p.term,
        p.createdAt,
        s.first_name,
        s.second_name,
        s.last_name,
        s.student_AdmNo AS admissionNo
       FROM remedialpayments p
       JOIN students s ON p.student_id = s.id
       WHERE p.id = ?`,
      [id]
    );

    if (payment.length === 0) {
      return res.status(404).json({ error: "Remedial payment not found" });
    }

    res.status(200).json(payment[0]);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteRemedialPayment = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Remedial Payment ID is required" });

  try {
    const [result] = await db.query(
      "DELETE FROM remedialpayments WHERE id = ?", 
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Remedial payment not found" });
    }

    res.status(200).json({ message: "Remedial payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};