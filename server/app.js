require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.FRONTEND_URL || "https://graceful-contentment-production-c5d2.up.railway.app"
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());

require("./config/db");

app.get("/", (req, res) => {
  res.send("API is running...");
});

// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes);
// app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});