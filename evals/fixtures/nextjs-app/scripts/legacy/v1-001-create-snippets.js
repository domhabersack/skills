// v1 schema: replaced by the Postgres migrations in 2024.
module.exports = async (db) => {
  await db.query('CREATE TABLE snippets (id SERIAL PRIMARY KEY, code TEXT)')
}
