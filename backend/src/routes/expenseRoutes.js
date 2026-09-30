const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getExpenses,
  getSummary,
  createExpense,
  deleteExpense,
  updateBudget,
} = require("../controllers/expenseController");

router.use(protect);

router.get("/", getExpenses);
router.get("/summary", getSummary);
router.post("/", createExpense);
router.delete("/:id", deleteExpense);
router.put("/budget", updateBudget);

module.exports = router;