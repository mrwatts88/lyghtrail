import dayjs from "dayjs";
import "dotenv/config";
import express from "express";
import pkg from "pg";
import { decrypt } from "~/services/crypto";
import { Task } from "~/types/entities";

const { Client } = pkg;

const router = express.Router();

router
  .get("/", async function (req, res) {
    if (!req.query.userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const localDate = req.query["localDate"];

    if (!localDate) {
      return res.status(400).json({ error: "localDate is required" });
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    let dueTasks: Task[] = [];
    try {
      const { rows } = await client.query(
        `SELECT * from tasks where due_date::date <= '${localDate}'::date and user_id = '${req.query.userId}' order by title ASC`
      );

      dueTasks = rows.map((task) => {
        task.title = decrypt(task.title, task.title_iv);
        return task;
      });
    } catch (err) {
      console.error(err);
      await client.end();
      return res.status(500).json({ error: err });
    }

    await client.end();
    return res.json(dueTasks);
  })
  .put("/:id", async function (req, res) {
    if (!req.params.id) {
      return res.status(400).json({ error: "id is required" });
    }
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();

    try {
      const { rows } = await client.query(
        "SELECT frequency, due_date from tasks where id = $1",
        [req.params.id]
      );

      const frequency = rows[0].frequency;
      const previousDueDate = dayjs(rows[0].due_date);
      let newDueDate = previousDueDate;
      const frequencyValue = frequency.slice(0, -1);
      const frequencyUnit = frequency.slice(-1);

      switch (frequencyUnit) {
        case "D":
          newDueDate = previousDueDate.add(frequencyValue, "day");
          break;
        case "W":
          newDueDate = previousDueDate.add(frequencyValue, "week");
          break;
        case "M":
          newDueDate = previousDueDate.add(frequencyValue, "month");
          break;
        case "Y":
          newDueDate = previousDueDate.add(frequencyValue, "year");
          break;
        default:
          break;
      }

      await client.query("UPDATE tasks SET due_date = $1 WHERE id = $2", [
        newDueDate.toISOString().substring(0, 10),
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
