import { encrypt } from "../../server/services/crypto.js";
import client from "../client.js";

await client.connect();

try {
  const { rows } = await client.query(
    "SELECT * from tasks WHERE title_iv IS NULL"
  );

  const updatedRows = rows.map((row) => {
    const { encryptedData, iv } = encrypt(row.title);
    row.title = encryptedData;
    row.title_iv = iv;
    return row;
  });

  for (const row of updatedRows) {
    await client.query(
      "UPDATE tasks SET title = $1, title_iv = $2 WHERE id = $3",
      [row.title, row.title_iv, row.id]
    );
  }
} catch (err) {
  console.error(err);
} finally {
  await client.end();
}
