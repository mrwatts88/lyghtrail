// drop, create, and seed the database

import "dotenv/config";
import pkg from "pg";

const { Client } = pkg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

try {
  await client.query("DROP TABLE IF EXISTS tasks");
  await client.query("DROP TABLE IF EXISTS users");

  await client.query(`
        CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) UNIQUE NOT NULL,
          frequency VARCHAR(50) NOT NULL,
          due_date VARCHAR(10) NOT NULL,
          user_id VARCHAR(255) NOT NULL
        )
    `);

  await client.query(`
        INSERT INTO tasks (user_id, title, frequency, due_date) VALUES
          ('user_2cW51io0uEbSGg4vFxgZWAt6lYm', 'clean house', '1D', '2024-02-04'),
          ('user_2cW51io0uEbSGg4vFxgZWAt6lYm', 'water plants', '3D', '2024-02-04'),
          ('user_2cW51io0uEbSGg4vFxgZWAt6lYm', 'do laundry', '7D', '2024-02-04'),
          ('user_2cW51io0uEbSGg4vFxgZWAt6lYm', 'buy groceries', '14D', '2024-02-08'),
          ('user_2cW51io0uEbSGg4vFxgZWAt6lYm', 'pay bills', '30D', '2024-02-07'),
          ('user_2cW51io0uEbSGg4vFxgZWAt6lY2', 'clean jess', '1D', '2024-02-04')
    `);
} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
