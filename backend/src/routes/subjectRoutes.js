const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

router.use(protect); // every route below this line requires a valid token

router.get("/", getSubjects);
router.post("/", createSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;