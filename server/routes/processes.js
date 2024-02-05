import "dotenv/config";
import express from "express";
import pkg from "pg";
const { Client } = pkg;

const router = express.Router();

/*
CREATE TABLE processes (
    title VARCHAR(255) PRIMARY KEY,
    frequency VARCHAR(50) NOT NULL,
    due_next DATE NOT NULL
);
*/
router
  .get("/", async function (req, res, next) {
    const client = new Client();
    await client.connect();

    let result = [];
    try {
      const res = await client.query("SELECT * from processes");
      result = res.rows;
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    } finally {
      await client.end();
      return res.json(result);
    }
  })
  .post("/", async function (req, res, next) {
    const client = new Client();
    await client.connect();

    try {
      await client.query(
        "INSERT into processes (title, frequency, due_next) VALUES ($1, $2, $3)",
        [req.body.title, req.body.frequency, req.body.dueNext]
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
    const client = new Client();
    await client.connect();

    try {
      await client.query("DELETE FROM processes WHERE title = $1", [
        req.params.id,
      ]);
    } catch (err) {
      console.error(err);
      await client.end();
      return res.status(500).json({ error: err });
    }

    await client.end();
    return res.json({ success: true });
  });

export default router;
