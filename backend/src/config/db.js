const { Pool, types } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// DATE columns (due_date, expense_date) have no time and no timezone.
// By default the pg library turns them into JavaScript Date objects at midnight
// *local* time. In the Philippines (UTC+8) that's "2026-09-24T16:00:00.000Z",
// the day before, and saving that value back moves the due date one day earlier.
// This tells pg to hand DATE values over as plain text like "2026-09-25" instead.
// 1082 is PostgreSQL's internal ID for the DATE type.
types.setTypeParser(1082, (value) => value);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // For local development, you might want to set this to false
  },    
});

// Check the connection once at startup, then give that connection back to the pool
pool.connect()
  .then((client) => {
    console.log("PostgreSQL connected");
    client.release();
  })
  .catch((err) => {
    console.error("PostgreSQL connection failed:", err.message);
    process.exit(1);
  });

module.exports = pool;