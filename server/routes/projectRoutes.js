const express = require("express");
const router = express.Router();

const { auth, authorizeRoles } = require("../middleware/auth");
const {
  createProject,
  getProjects,
  addMember
} = require("../controllers/projectController");

//  Anyone logged in can view projects
router.get("/", auth, getProjects);

// Only ADMIN can create project
router.post("/", auth, authorizeRoles("admin"), createProject);

// Only ADMIN can add members
router.post("/add-member", auth, authorizeRoles("admin"), addMember);

module.exports = router;