import client from "../client.js";

await client.connect();

try {
  await client.query(`ALTER TABLE tasks ADD COLUMN title_iv VARCHAR(255);`);
} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
