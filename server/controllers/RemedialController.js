// controllers/remedialController.js
import { db } from "../connectDB.js";

export const addRemedial = async (req, res) => {
  const { term, amountPaid } = req.body;

  if (!term || !amountPaid) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const createdAt = new Date();

    // ✅ Check if remedial already exists for same class, term, and year
    const [existing] = await db.query(
      "SELECT * FROM remedial WHERE term = ?",
      [term]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "Remedial for term has already been added" });
    }

    // ✅ Proceed to insert since no duplicate
    const [results] = await db.query(
      "INSERT INTO remedial ( term, Amount_paid, createdAt) VALUES (?, ?, ?)",
      [term, amountPaid, createdAt]
    );

    res.status(201).json({
      message: "Remedial added successfully",
      remedialId: results.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getRemedials = async (req, res) => {
  try {
    const [remedials] = await db.query("SELECT * FROM remedial");
    res.status(200).json(remedials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRemedialById = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "remedial ID is required" });

  try {
    const [remedial] = await db.query("SELECT * FROM remedial WHERE id = ?", [id]);
    if (remedial.length === 0) return res.status(404).json({ error: "remedial not found" });

    res.status(200).json(remedial[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateRemedial = async (req, res) => {
  const { id } = req.params;
  const { term, amountPaid } = req.body;

  if (!id || !term || !amountPaid) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM remedial WHERE term = ? AND id != ?",
      [term, id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "remedial for this class and term already exists" });
    }

    const [result] = await db.query(
      "UPDATE remedial SET term = ?, Amount_paid = ? WHERE id = ?",
      [term, amountPaid, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "remedial not found" });
    }

    res.status(200).json({ message: "remedial updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteRemedial = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "remedial ID is required" });

  try {
    const [result] = await db.query("DELETE FROM remedial WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "remedial not found" });
    }

    res.status(200).json({ message: "remedial deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRemedialTerms = async (req, res) => {
  try {
    const [terms] = await db.query("SELECT DISTINCT term FROM remedial");
    res.status(200).json(terms.map(row => row.term));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch terms" });
  }
};
export const getRemedialByTerm = async (req, res) => {
  const { term } = req.params;
  if (!term) return res.status(400).json({ error: "Term is required" });
  try {
      const [fees] = await db.query("SELECT * FROM remedial WHERE term = ?", [term]);
      res.status(200).json(fees);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
  }
};