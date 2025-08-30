import { db } from "../connectDB.js";
export const addPayment = async (req, res) => {
  const { studentId, amountPaid, paymentMethod, term } = req.body;
const type="payment";
  if (!studentId || !amountPaid || !paymentMethod || !term || !type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [student] = await db.query(
      "SELECT id, class FROM students WHERE id = ?",
      [studentId]
    );

    if (student.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const studentClass = student[0].class;
    const createdAt = new Date();

    const [result] = await db.query(
      `INSERT INTO payments (
        student_id, Amount_paid, payment_method, term,type, class, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [studentId, amountPaid, paymentMethod, term, type, studentClass, createdAt]
    );

    res.status(201).json({
      message: "Payment recorded successfully",
      paymentId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPayments = async (req, res) => {
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
        s.student_AdmNo AS admissionNo,
        s.class
      FROM payments p
      JOIN students s ON p.student_id = s.id
      ORDER BY p.createdAt DESC`
    );
    
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};  
export const getPaymentByStudentId = async (req, res) => {
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
      FROM payments p
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
export const getTodayPayments = async (req, res) => {
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
       FROM payments 
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

export const getTotalPayments = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT SUM(Amount_paid) AS totalPaid FROM payments"
    );
    res.status(200).json({ 
      totalPaid: result[0].totalPaid || 0 
    });
  } catch (error) {
    console.error("Error fetching total payments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getBalance = async (req, res) => {
  try {
    const [[{ totalExpected }]] = await db.query(
      "SELECT SUM(Amount_paid) AS totalExpected FROM fee_striucture"
    );
    const [[{ totalPaid }]] = await db.query(
      "SELECT SUM(Amount_paid) AS totalPaid FROM payments"
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

export const getPaymentSummary = async (req, res) => {
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
       FROM fee_striucture 
       WHERE class = ? AND term = ?`,
      [student.class, term]
    );
    const requiredFee = feeRow?.Amount_paid || 0;

    const [[payment]] = await db.query(
      `SELECT SUM(Amount_paid) AS totalPaid 
       FROM payments 
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
export const getStudentBalance = async (req, res) => {
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
      JOIN fee_striucture fs 
        ON s.class = fs.class AND fs.term = ?
      LEFT JOIN payments p 
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

export const updatePayment = async (req, res) => {
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
      `UPDATE payments SET 
        student_id = ?, 
        Amount_paid = ?, 
        payment_method = ?, 
        term = ? 
       WHERE id = ?`,
      [studentId, amountPaid, paymentMethod, term, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json({ message: "Payment updated successfully" });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPaymentById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Payment ID is required" });

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
       FROM payments p
       JOIN students s ON p.student_id = s.id
       WHERE p.id = ?`,
      [id]
    );

    if (payment.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(payment[0]);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePayment = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Payment ID is required" });

  try {
    const [result] = await db.query(
      "DELETE FROM payments WHERE id = ?", 
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};