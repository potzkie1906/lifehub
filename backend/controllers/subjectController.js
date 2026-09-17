const pool = require("../config/db");

// GET /api/subjects
const getSubjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM subjects WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/subjects
const createSubject = async (req, res) => {
  try {
    const { name, code, teacher } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Subject name is required" });
    }

    const result = await pool.query(
      "INSERT INTO subjects (user_id, name, code, teacher) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.userId, name, code, teacher]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/subjects/:id
const updateSubject = async (req, res) => {
  try {
    const { name, code, teacher } = req.body;
    const result = await pool.query(
      "UPDATE subjects SET name = $1, code = $2, teacher = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [name, code, teacher, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/subjects/:id
const deleteSubject = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM subjects WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.json({ message: "Subject deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };