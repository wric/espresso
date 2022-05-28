import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import appRoot from 'app-root-path'

let cachedDb = null

async function initDb () {
  const date = new Date().toISOString().substring(0, 10)
  const dbPath = `${appRoot}/db/${date}.db`
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })

  await db.exec(
    `
      CREATE TABLE IF NOT EXISTS messages
      (
        source TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        data TEXT NOT NULL
      )
    `
  )

  return db
}

async function getDb () {
  if (!cachedDb) {
    cachedDb = initDb()
  }

  return cachedDb
}

async function writeMessage ({ source, timestamp, data }) {
  const db = await getDb()
  await db.run(
    `
      INSERT INTO messages (source, timestamp, data)
      VALUES (?, ?, ?)
    `,
    source,
    timestamp,
    JSON.stringify(data)
  )
}

export { writeMessage }
