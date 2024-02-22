import "dotenv/config";
import express from "express";
import pkg from "pg";
import { decrypt, encrypt } from "../services/crypto";
import { Task } from "../types/entities";

const { Client } = pkg;

const router = express.Router();

router
  .get("/", async function (req, res) {
    if (!req.query.userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();

    let result: Task[] = [];
    try {
      const res = await client.query(
        "SELECT * from tasks where user_id = $1 order by title ASC",
        [req.query.userId]
      );
      result = res.rows;

      result = result.map((task) => {
        task.title = decrypt(task.title, task.title_iv);
        return task;
      });
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

    const { encryptedData, iv } = encrypt(req.body.title);

    try {
      await client.query(
        "INSERT into tasks (title, frequency, due_date, user_id, title_iv) VALUES ($1, $2, $3, $4, $5)",
        [
          encryptedData,
          req.body.frequency,
          req.body.dueNext,
          req.body.userId,
          iv,
        ]
      );
    } catch (err) {
      console.log(err);
      await client.end();
      return res.status(500).json({ error: err });
    }

    await client.end();
    return res.json({ success: true });
  })
  .delete("/:id", async function (req, res) {
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
