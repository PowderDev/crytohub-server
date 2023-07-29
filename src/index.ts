import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import { envKeys, validateAndSetEnv } from './config/keys'
import { errorHandler } from './errorHandler'
import { migrateToLatest } from './database/migrator'
import { initDatabase } from './database'
import { logger } from './config/logger'

const isMigration = process.argv.includes('--migrate')

dotenv.config()
validateAndSetEnv()

if (envKeys.NODE_ENV === 'production') {
  console.log('Removing console transport from logger')
  logger.remove(logger.transports[0])
}

export const db = initDatabase()

if (isMigration) {
  await migrateToLatest(db)
  await db.destroy()
  process.exit(0)
}

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use(errorHandler)

app.listen(envKeys.PORT, () => {
  console.log(`Running on port ${envKeys.PORT}`)
})
