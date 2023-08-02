import { FileMigrationProvider, Kysely, Migrator } from 'kysely'
import { Database } from '../types/database'
import * as path from 'path'
import { logger } from '../config/logger'
import { FileMigrationProviderPath } from 'kysely/dist/esm/migration/file-migration-provider'
import * as fs from 'fs/promises'
import * as os from 'os'

// Kysely has a bug where it doesn't work with Windows paths.
const customPath: FileMigrationProviderPath = {
  join: (...pathParts: string[]) => {
    return path.resolve(...pathParts).replace('C:', 'file:///C:')
  },
}

export async function migrate(db: Kysely<Database>, dir: 'up' | 'down' = 'up') {
  const migrationFolder = path.join('.', 'build', 'database', 'migrations')

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path: os.type() == 'Windows_NT' ? customPath : path,
      migrationFolder,
    }),
  })

  const { error, results } =
    dir == 'up' ? await migrator.migrateToLatest() : await migrator.migrateDown()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      logger.info(`Migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      logger.error(`Failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    logger.error(`Failed to migrate. ${error}`)
    process.exit(1)
  }
}
