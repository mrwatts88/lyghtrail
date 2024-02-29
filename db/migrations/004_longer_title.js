import client from "../client.js";

await client.connect();

try {
  await client.query(`ALTER TABLE tasks ALTER COLUMN title TYPE VARCHAR(511);`);
} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
