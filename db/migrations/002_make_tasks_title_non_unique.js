import client from "../client.js";

await client.connect();

try {
  await client.query(`ALTER TABLE tasks DROP CONSTRAINT tasks_title_key;`);

} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
