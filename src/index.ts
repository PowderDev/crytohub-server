import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import { envKeys, validateAndSetEnv } from './config/keys'
import { errorHandler } from './errorHandler'
import { migrate } from './database/migrator'
import { initDatabase } from './database'
import { logger } from './config/logger'
import { setExternalPortfolioParsesInterval } from './external'
import { router as portfolioRouter } from './routes/portfolio'

const isMigration = process.argv.includes('--migrate')
const isMigrationDown = process.argv.includes('--migrate-down')

dotenv.config()
validateAndSetEnv()

if (envKeys.NODE_ENV === 'production') {
  logger.info('Removing console transport from logger')
  logger.remove(logger.transports[0])
}

export const db = initDatabase()

if (isMigration) {
  await migrate(db, isMigrationDown ? 'down' : 'up')
  await db.destroy()
  process.exit(0)
}

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/external', portfolioRouter)

app.use(errorHandler)

setExternalPortfolioParsesInterval()

app.listen(envKeys.PORT, () => {
  console.log(`Running on port ${envKeys.PORT}`)
})
