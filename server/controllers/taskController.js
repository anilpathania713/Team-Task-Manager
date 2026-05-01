const db = require("../config/db");

// ✅ Create Task
exports.createTask = (req, res) => {
  const { title, description, project_id, assigned_to, due_date } = req.body;
  const created_by = req.user.id;

  if (!title || !project_id) {
    return res.status(400).json({ msg: "Title and project required" });
  }

  const query = `
    INSERT INTO tasks (title, description, project_id, assigned_to, due_date, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [title, description, project_id, assigned_to, due_date, created_by],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error creating task" });
      }

      res.json({
        msg: "Task created",
        taskId: result.insertId
      });
    }
  );
};

// ✅ Update task status
exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ msg: "Status required" });
  }

  const query = `
    UPDATE tasks SET status = ?
    WHERE id = ?
  `;

  db.query(query, [status, taskId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Error updating task" });
    }

    res.json({ msg: "Task updated" });
  });
};

// ✅ Get tasks by project
exports.getTasksByProject = (req, res) => {
  const projectId = req.params.projectId;

  const query = `
    SELECT * FROM tasks
    WHERE project_id = ?
  `;

  db.query(query, [projectId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Error fetching tasks" });
    }

    res.json(results);
  });
};

// ✅ Dashboard stats
exports.getDashboard = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT
      COUNT(*) AS total,
      COALESCE(SUM(status = 'done'), 0) AS completed,
      COALESCE(SUM(status = 'todo'), 0) AS pending,
      COALESCE(SUM(status != 'done' AND due_date < CURDATE()), 0) AS overdue
    FROM tasks
    WHERE assigned_to = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ msg: "Server error" });
    }

    res.json(result[0]);
  });
};