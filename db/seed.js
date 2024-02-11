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
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        )
    `);

  await client.query(`
        CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) UNIQUE NOT NULL,
          frequency VARCHAR(50) NOT NULL,
          due_date VARCHAR(10) NOT NULL,
          user_id INTEGER REFERENCES users(id)
        )
    `);

  await client.query(`
        INSERT INTO users (username, password) VALUES
          ('matt', 'password')
    `);

  await client.query(`
        INSERT INTO tasks (title, frequency, due_date, user_id) VALUES
          ('clean house', '1D', '2024-02-04', 1),
          ('water plants', '3D', '2024-02-04', 1),
          ('do laundry', '7D', '2024-02-04', 1),
          ('buy groceries', '14D', '2024-02-08', 1),
          ('pay bills', '30D', '2024-02-07', 1)
    `);
} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
