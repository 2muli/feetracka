import { db } from "../connectDB.js";

export const addFee = async (req, res) => {
  const { classPaid, term, amountPaid } = req.body;

  if (!classPaid || !term || !amountPaid) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const createdAt = new Date();
    const currentYear = createdAt.getFullYear();
    const [existing] = await db.query(
      "SELECT * FROM fee_striucture WHERE class = ? AND term = ? AND Year = ?",
      [classPaid, term, currentYear]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "Fee for that class and term has already been added" });
    }
    // Proceed to insert since no duplicate
    const [results] = await db.query(
      "INSERT INTO fee_striucture (class, term, Amount_paid, created_at, Year) VALUES (?, ?, ?, ?, ?)",
      [classPaid, term, amountPaid, createdAt, currentYear]
    );

    res.status(201).json({
      message: "Fee added successfully",
      feeId: results.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getFees = async (req, res) => {
  try {
    const [fees] = await db.query("SELECT * FROM fee_striucture ORDER BY class ASC, term ASC");
    res.status(200).json(fees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFeeById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Fee ID is required" });

  try {
    const [fee] = await db.query("SELECT * FROM fee_striucture WHERE id = ?", [id]);
    if (fee.length === 0) return res.status(404).json({ error: "Fee not found" });

    res.status(200).json(fee[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateFee = async (req, res) => {
  const { id } = req.params;
  const { classPaid, term, amountPaid } = req.body;

  if (!id || !classPaid || !term || !amountPaid) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM fee_striucture WHERE class = ? AND term = ? AND id != ?",
      [classPaid, term, id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Fee for this class and term already exists" });
    }

    const [result] = await db.query(
      "UPDATE fee_striucture SET class = ?, term = ?, Amount_paid = ? WHERE id = ?",
      [classPaid, term, amountPaid, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Fee not found" });
    }

    res.status(200).json({ message: "Fee updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteFee = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Fee ID is required" });

  try {
    const [result] = await db.query("DELETE FROM fee_striucture WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Fee not found" });
    }

    res.status(200).json({ message: "Fee deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTerms = async (req, res) => {
  try {
    const [terms] = await db.query("SELECT DISTINCT term FROM fee_striucture");
    res.status(200).json(terms.map(row => row.term));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch terms" });
  }
};
export const getStudentTermBalances = async (req, res) => {
  const { studentId } = req.params;
  if (!studentId) return res.status(400).json({ error: "Student ID is required" });

  try {
    // Step 1: Get the student's class
    const [[student]] = await db.query(
      "SELECT class, first_name, second_name, last_name FROM students WHERE id = ?",
      [studentId]
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const studentClass = student.class;
    const fullName = `${student.first_name} ${student.second_name} ${student.last_name}`;

    
    const [feeStructure] = await db.query(
      `SELECT term, Amount_paid FROM fee_striucture WHERE class = ? ORDER BY term ASC`,
      [studentClass]
    );

    const [payments] = await db.query(
      `SELECT Amount_paid FROM payments WHERE student_id = ? ORDER BY createdAt ASC`,
      [studentId]
    );

    let totalPaid = payments.reduce((sum, p) => sum + p.Amount_paid, 0);
    let carryForward = totalPaid;
    const breakdown = [];

    for (const fee of feeStructure) {
      const requiredFee = fee.Amount_paid;
      const term = fee.term;

      let balance = carryForward - requiredFee;
      let status = "";
      let actualBalance = 0;

      if (balance >= 0) {
        status = "Cleared / Overpaid";
        actualBalance = 0;
        carryForward = balance;
      } else {
        status = "Not Cleared";
        actualBalance = Math.abs(balance);
        carryForward = 0;
      }

      breakdown.push({
        term,
        requiredFee,
        totalPaidUpToThisTerm: totalPaid,
        balance: actualBalance,
        status,
        carryForward
      });

      // Reduce totalPaid only when there’s underpayment
      if (balance < 0) totalPaid = 0;
    }

    return res.status(200).json({
      studentId,
      studentName: fullName,
      class: studentClass,
      feeStatus: breakdown
    });
  } catch (error) {
    console.error("Error in term balance logic:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check if previous term is cleared before allowing payment
export const canPayForTerm = async (req, res) => {
  const { studentId, term } = req.body;
  if (!studentId || !term) return res.status(400).json({ error: "Student ID and term required" });

  try {
    const termOrder = { "Term 1": 1, "Term 2": 2, "Term 3": 3 };
    const currentTermIndex = termOrder[term];

    if (currentTermIndex === 1) {
      return res.status(200).json({ allowed: true });
    }

    const prevTerm = Object.keys(termOrder).find(key => termOrder[key] === currentTermIndex - 1);

    const [studentRow] = await db.query("SELECT class FROM students WHERE id = ?", [studentId]);
    if (studentRow.length === 0) return res.status(404).json({ error: "Student not found" });

    const studentClass = studentRow[0].class;

    // Get fee required for the previous term
    const [[prevFee]] = await db.query(
      "SELECT Amount_paid FROM fee_striucture WHERE class = ? AND term = ?",
      [studentClass, prevTerm]
    );

    const required = prevFee?.Amount_paid || 0;

    // Get total payments for the previous term
    const [[prevPaid]] = await db.query(
      "SELECT SUM(Amount_paid) AS totalPaid FROM payments WHERE student_id = ? AND term = ?",
      [studentId, prevTerm]
    );

    const paid = prevPaid?.totalPaid || 0;

    if (paid < required) {
      return res.status(403).json({
        allowed: false,
        message: `Payment blocked: Student has not cleared ${prevTerm}. Outstanding balance is ${required - paid}`
      });
    }

    res.status(200).json({ allowed: true });
  } catch (error) {
    console.error("Error checking term eligibility:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
    
export const getFeeByClassAndTerm = async (req, res) => {
  const { classPaid, term } = req.params;
  if (!classPaid || !term) return res.status(400).json({ error: "Class and term are required" });
  try {
      const [fees] = await db.query("SELECT * FROM fee_striucture WHERE class = ? AND term = ?", [classPaid, term]);
      res.status(200).json(fees);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
};
