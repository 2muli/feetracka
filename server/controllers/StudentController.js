import { db } from "../connectDB.js";

export const getStudents = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addStudent = async (req, res) => {
  const {
    firstName,
    secondName,
    lastName,
    admissionNo,
    className
  } = req.body;

  if (
    !firstName ||
    !secondName ||
    !lastName ||
    !admissionNo ||
    !className 
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM students WHERE `student_AdmNo` = ?",
      [admissionNo]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Admission number already exists" });
    }

    const createdAt = new Date();
    const [results] = await db.query(
      "INSERT INTO students (first_name, second_name, last_name, `student_AdmNo`, class, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [
        firstName,
        secondName,
        lastName,
        admissionNo,
        className,
        createdAt,
      ]
    );

    res.status(201).json({
      message: "Student added successfully",
      studentId: results.insertId,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    secondName,
    lastName,
    admissionNo,
    className,
  } = req.body;

  if (
    !id ||
    !firstName ||
    !secondName ||
    !lastName ||
    !admissionNo ||
    !className 
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if admission number exists for another student
    const [existing] = await db.query(
      "SELECT id FROM students WHERE `student_AdmNo` = ? AND id != ?",
      [admissionNo, id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Admission number already exists" });
    }

    const [result] = await db.query(
      "UPDATE students SET first_name = ?, second_name = ?, last_name = ?, `student_AdmNo` = ?, `class` = ? WHERE id = ?",
      [firstName, secondName, lastName, admissionNo, className,id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  try {
    const [result] = await db.query("DELETE FROM students WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const searchStudents = async (req, res) => {
  const { q } = req.query;

  try {
    const [rows] = await db.query(
      "SELECT * FROM students WHERE first_name LIKE ? OR `student_AdmNo` LIKE ?",
      [`%${q}%`, `%${q}%`]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error searching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const payingStudent = async (req, res) => {
  try {
    const [students] = await db.query(`
      SELECT 
        id, 
        \`student_AdmNo\` AS admissionNo, 
        first_name, 
        second_name, 
        last_name 
      FROM students
    `);
    res.json(students);
  } catch (error) {
    console.error("Error fetching paying students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const getStudentById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
         id, 
         first_name, 
         second_name, 
         last_name, 
         \`student_AdmNo\` AS admissionNo, 
         class, 
         parent_name, 
         parent_contact 
       FROM students 
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStudentsByClass = async (req, res) => {
  const { className } = req.query;

  if (!className) {
    return res.status(400).json({ error: "Class name is required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM students WHERE class = ?", [className]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No students found for this class" });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching students by class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getLatestTenStudents = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM students ORDER BY createdAt DESC LIMIT 10"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching latest students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStudentCount = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM students");
    res.status(200).json({ count: rows[0].count });
  } catch (error) {
    console.error("Error fetching student count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStudentCountByClass = async (req, res) => {
  const { className } = req.params;

  if (!className) {
    return res.status(400).json({ error: "Class name is required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS count FROM students WHERE class = ?",
      [className]
    );
    res.status(200).json({ count: rows[0].count });
  } catch (error) {
    console.error("Error fetching student count by class:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getClasses = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT DISTINCT class FROM students ORDER BY class");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
