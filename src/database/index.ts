import pkg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from '../types/database'
import { envKeys } from '../config/keys'

const { Pool } = pkg

export function initDatabase() {
  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString: envKeys.DATABASE_URL,
      max: 2,
    }),
  })

  return new Kysely<Database>({ dialect })
}
