// v1 schema: replaced by the Postgres migrations in 2024.
module.exports = async (db) => {
  await db.query('ALTER TABLE snippets ADD COLUMN theme TEXT')
}
