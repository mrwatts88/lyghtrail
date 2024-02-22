import client from "./client.js";

await client.connect();

try {
  const { rows } = await client.query(`
    SELECT table_name, column_name, data_type, character_maximum_length
    FROM information_schema.columns
    WHERE table_name = 'tasks';
  `);

  console.log(rows);
} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
