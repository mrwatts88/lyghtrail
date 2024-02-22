import client from "../client.js";

await client.connect();

try {
  await client.query("DELETE from tasks WHERE id = $1", [16]);
} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
