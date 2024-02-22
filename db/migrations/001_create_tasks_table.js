import client from "../client.js";

await client.connect();

try {
  await client.query(`
        CREATE TABLE tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) UNIQUE NOT NULL,
          frequency VARCHAR(50) NOT NULL,
          due_date VARCHAR(10) NOT NULL,
          user_id VARCHAR(255) NOT NULL
        )
    `);

} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
