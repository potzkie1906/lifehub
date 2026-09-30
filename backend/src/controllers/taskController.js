const pool = require("../config/db");

const getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, priority, due_date } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const result = await pool.query(
      "INSERT INTO tasks (user_id, title, priority, due_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.userId, title, priority || "medium", due_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, priority, status, due_date } = req.body;
    const result = await pool.query(
      "UPDATE tasks SET title = $1, priority = $2, status = $3, due_date = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
      [title, priority, status, due_date, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Task not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };