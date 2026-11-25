// v1 schema: replaced by the Postgres migrations in 2024.
module.exports = async (db) => {
  await db.query('CREATE TABLE todos (id SERIAL PRIMARY KEY, title TEXT)')
}
