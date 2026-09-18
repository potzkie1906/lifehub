const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");

router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;