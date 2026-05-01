const db = require("../config/db");

// ✅ Create Project
exports.createProject = (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ msg: "Project name required" });
  }

  const query = `
    INSERT INTO projects (name, description, created_by)
    VALUES (?, ?, ?)
  `;

  db.query(query, [name, description, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Error creating project" });
    }

    const projectId = result.insertId;

    // ⭐ FIX 1: Automatically add the creator to project_members as 'admin'
    const memberQuery = `
      INSERT INTO project_members (project_id, user_id, role)
      VALUES (?, ?, ?)
    `;

    db.query(memberQuery, [projectId, userId, "admin"], (err2) => {
      if (err2) console.error("Error adding creator as member:", err2);
    });

    res.json({
      msg: "Project created",
      projectId
    });
  });
};

// ✅ Get all projects for logged-in user
exports.getProjects = (req, res) => {
  const userId = req.user.id;

  // ⭐ FIX: Show projects if you created them, are in project_members, OR have a task assigned to you
  const query = `
    SELECT DISTINCT p.*
    FROM projects p
    LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ?
    LEFT JOIN tasks t ON p.id = t.project_id AND t.assigned_to = ?
    WHERE p.created_by = ? OR pm.user_id = ? OR t.assigned_to = ?
  `;

  db.query(query, [userId, userId, userId, userId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Error fetching projects" });
    }

    res.json(results);
  });
};

// ✅ Add member to project
exports.addMember = (req, res) => {
  const { project_id, user_id, role } = req.body;

  if (!project_id || !user_id) {
    return res.status(400).json({ msg: "Project ID and User ID required" });
  }

  // ⭐ FIX 3: Use INSERT IGNORE so it doesn't crash if they are already a member
  const query = `
    INSERT IGNORE INTO project_members (project_id, user_id, role)
    VALUES (?, ?, ?)
  `;

  db.query(query, [project_id, user_id, role || "member"], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Error adding member" });
    }

    res.json({ msg: "Member added successfully" });
  });
};