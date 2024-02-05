// drop, create, and seed the database

import "dotenv/config";
import pkg from "pg";
const { Client } = pkg;

const client = new Client();
await client.connect();

try {
  await client.query("DROP TABLE IF EXISTS processes");

  await client.query(`
        CREATE TABLE processes (
          title VARCHAR(255) PRIMARY KEY,
          frequency VARCHAR(50) NOT NULL,
          due_next VARCHAR(10) NOT NULL
        )
    `);

  await client.query(`
        INSERT INTO processes (title, frequency, due_next) VALUES
          ('clean house', '1D', '2024-02-04'),
          ('water plants', '3D', '2024-02-04'),
          ('do laundry', '7D', '2024-02-04'),
          ('buy groceries', '14D', '2024-02-04'),
          ('pay bills', '30D', '2024-02-04')
    `);
} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
