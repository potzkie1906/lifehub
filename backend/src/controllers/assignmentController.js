const pool = require("../config/db");

// GET /api/assignments
const getAssignments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT assignments.*, subjects.name AS subject_name
       FROM assignments
       JOIN subjects ON assignments.subject_id = subjects.id
       WHERE assignments.user_id = $1
       ORDER BY assignments.due_date ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/assignments
const createAssignment = async (req, res) => {
  try {
    const { subject_id, title, description, due_date, priority } = req.body;
    if (!subject_id || !title) {
      return res.status(400).json({ message: "Subject and title are required" });
    }

    const result = await pool.query(
      `INSERT INTO assignments (user_id, subject_id, title, description, due_date, priority)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.userId, subject_id, title, description, due_date, priority || "medium"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/assignments/:id  (also used to just change status, e.g. mark completed)
const updateAssignment = async (req, res) => {
  try {
    const { title, description, due_date, priority, status } = req.body;
    const result = await pool.query(
      `UPDATE assignments
       SET title = $1, description = $2, due_date = $3, priority = $4, status = $5
       WHERE id = $6 AND user_id = $7 RETURNING *`,
      [title, description, due_date, priority, status, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/assignments/:id
const deleteAssignment = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM assignments WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json({ message: "Assignment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAssignments, createAssignment, updateAssignment, deleteAssignment };