import { start } from './server'
import { SERVER_PORT } from './config'
import startDb from './util/db'

(async () => {
  const db = await startDb()
  await start(SERVER_PORT, db)
})()
