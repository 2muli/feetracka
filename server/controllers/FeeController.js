// controllers/feeController.js
import { db } from "../connectDB.js";

export const addFee = async (req, res) => {
  const { classPaid, term, amountPaid } = req.body;

  if (!classPaid || !term || !amountPaid) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const createdAt = new Date();
    const currentYear = createdAt.getFullYear();

    // ✅ Check if fee already exists for same class, term, and year
    const [existing] = await db.query(
      "SELECT * FROM fee_striucture WHERE class = ? AND term = ? AND Year = ?",
      [classPaid, term, currentYear]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "Fee for that class and term has already been added" });
    }

    // ✅ Proceed to insert since no duplicate
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
    const [fees] = await db.query("SELECT * FROM fee_striucture");
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
