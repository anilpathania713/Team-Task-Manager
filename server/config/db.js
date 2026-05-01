const mysql = require("mysql2");

const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// Prevent crash on connection loss
db.on("error", (err) => {
  console.error("DB Error:", err.message);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("Reconnecting to DB...");
  }
});

module.exports = db;