require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db"); // Import the database connection
const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);

app.get("/", (req, res) => {
  res.send("LifeHub API is running...");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});