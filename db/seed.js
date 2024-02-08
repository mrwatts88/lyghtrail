// drop, create, and seed the database

import "dotenv/config";
import pkg from "pg";

const { Client } = pkg;
const client = new Client();

await client.connect();

try {
  await client.query("DROP TABLE IF EXISTS tasks");

  await client.query(`
        CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) UNIQUE NOT NULL,
          frequency VARCHAR(50) NOT NULL,
          due_date VARCHAR(10) NOT NULL
        )
    `);

  await client.query(`
        INSERT INTO tasks (title, frequency, due_date) VALUES
          ('clean house', '1D', '2024-02-04'),
          ('water plants', '3D', '2024-02-04'),
          ('do laundry', '7D', '2024-02-04'),
          ('buy groceries', '14D', '2024-02-08'),
          ('pay bills', '30D', '2024-02-07')
    `);
} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
