require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./src/config/db"); // Import the database connection
const authRoutes = require("./src/routes/authRoutes");
const subjectRoutes = require("./src/routes/subjectRoutes");
const assignmentRoutes = require("./src/routes/assignmentRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const expenseRoutes = require("./src/routes/expenseRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("LifeHub API is running...");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});