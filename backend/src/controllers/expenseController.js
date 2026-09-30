const pool = require("../config/db");

// GET /api/expenses
const getExpenses = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses WHERE user_id = $1 ORDER BY expense_date DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/expenses/summary  — this month's total, by category, vs. budget
const getSummary = async (req, res) => {
  try {
    const totalResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total
       FROM expenses
       WHERE user_id = $1 AND date_trunc('month', expense_date) = date_trunc('month', CURRENT_DATE)`,
      [req.userId]
    );

    const byCategoryResult = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses
       WHERE user_id = $1 AND date_trunc('month', expense_date) = date_trunc('month', CURRENT_DATE)
       GROUP BY category`,
      [req.userId]
    );

    const budgetResult = await pool.query(
      "SELECT monthly_budget FROM users WHERE id = $1",
      [req.userId]
    );

    const spent = parseFloat(totalResult.rows[0].total);
    const budget = parseFloat(budgetResult.rows[0].monthly_budget);

    res.json({
      spent,
      budget,
      remaining: budget - spent,
      byCategory: byCategoryResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { category, amount, description, expense_date } = req.body;
    if (!category || !amount) {
      return res.status(400).json({ message: "Category and amount are required" });
    }

    const result = await pool.query(
      `INSERT INTO expenses (user_id, category, amount, description, expense_date)
       VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE)) RETURNING *`,
      [req.userId, category, amount, description, expense_date || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/budget  (lives here since it's tightly tied to expenses)
const updateBudget = async (req, res) => {
  try {
    const { monthly_budget } = req.body;
    await pool.query("UPDATE users SET monthly_budget = $1 WHERE id = $2", [monthly_budget, req.userId]);
    res.json({ monthly_budget });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getExpenses, getSummary, createExpense, deleteExpense, updateBudget };