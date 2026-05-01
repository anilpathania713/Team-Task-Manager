const express = require("express");
const router = express.Router();

const { auth, authorizeRoles } = require("../middleware/auth");
const {
  createTask,
  updateTask,
  getTasksByProject,
  getDashboard
} = require("../controllers/taskController");

router.get("/dashboard", auth, getDashboard);

//  All logged-in users can view tasks
router.get("/project/:projectId", auth, getTasksByProject);

//  Only ADMIN or MEMBER can create task
router.post("/", auth, authorizeRoles("admin", "member"), createTask);

//  Only ADMIN or assigned user can update (simple version: allow both roles)
router.put("/:id", auth, authorizeRoles("admin", "member"), updateTask);

module.exports = router;