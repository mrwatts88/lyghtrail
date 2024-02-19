import "dotenv/config";
import express from "express";
import pkg from "pg";
const { Client } = pkg;

const router = express.Router();

router
  .get("/", async function (req, res, next) {

    if (!req.query.userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();

    let result = [];
    try {
      const res = await client.query("SELECT * from tasks where user_id = $1 order by title ASC", [
        req.query.userId,
      ]);
      result = res.rows;
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    } finally {
      await client.end();
      return res.json(result);
    }
  })
  .post("/", async function (req, res) {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();

    try {
      await client.query(
        "INSERT into tasks (title, frequency, due_date, user_id) VALUES ($1, $2, $3, $4)",
        [req.body.title, req.body.frequency, req.body.dueNext, req.body.userId]
      );
    } catch (err) {
      console.log(err);
      // unique_violation, title already exists
      if (err.code !== "23505") {
        await client.end();
        return res.status(500).json({ error: err });
      }
    }

    await client.end();
    return res.json({ success: true });
  })
  .delete("/:id", async function (req, res, next) {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();

    try {
      await client.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    } catch (err) {
      console.error(err);
      await client.end();
      return res.status(500).json({ error: err });
    }

    await client.end();
    return res.json({ success: true });
  });

export default router;
