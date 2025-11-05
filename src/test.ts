import pool from "../src/repository/PostgreSQL/ConnectionManager";

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected successfully at:", res.rows[0]);
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    pool.end();
  }
})();