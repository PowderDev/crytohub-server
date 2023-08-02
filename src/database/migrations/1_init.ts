import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('portfolio')
    .addColumn('name', 'varchar', (col) => col.primaryKey())
    .execute()

  await db.schema
    .createTable('portfolio_item')
    .addColumn('symbol', 'varchar', (col) => col.references('cryptocurrency.symbol').notNull())
    .addColumn('avgPrice', 'decimal', (col) => col.notNull())
    .addColumn('share', 'decimal', (col) => col.notNull())
    .addColumn('rank', 'integer', (col) => col.notNull())
    .addColumn('portfolioName', 'varchar', (col) => col.references('external.name').notNull())
    .addColumn('amount', 'decimal', (col) => col.notNull())
    .addColumn('profit', 'decimal', (col) => col.notNull())
    .addColumn('changeInShare', 'decimal', (c) => c.defaultTo(0).notNull())
    .execute()

  await db.schema
    .createTable('cryptocurrency')
    .addColumn('symbol', 'varchar', (col) => col.primaryKey())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('price', 'decimal', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('transaction')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('symbol', 'varchar', (col) => col.notNull())
    .addColumn('price', 'decimal', (col) => col.notNull())
    .addColumn('amount', 'decimal', (col) => col.notNull())
    .addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('portfolioName', 'varchar', (col) => col.references('external.name').notNull())
    .execute()

  await db.schema
    .createTable('profit')
    .addColumn('symbol', 'varchar', (col) => col.primaryKey())
    .addColumn('profit', 'decimal', (col) => col.notNull())
    .addColumn('date', 'timestamp', (col) => col.defaultTo(sql`date_trunc('day', now())`))
    .execute()

  await db.schema
    .createIndex('portfolio_item_symbol_index')
    .on('portfolio_item')
    .column('symbol')
    .execute()

  await db.schema
    .createIndex('portfolio_item_portfolio_name_index')
    .on('portfolio_item')
    .column('portfolioName')
    .execute()

  await db.schema
    .createIndex('transaction_symbol_index')
    .on('transaction')
    .column('symbol')
    .execute()
  await db.schema.createIndex('transaction_id_index').on('transaction').column('id').execute()

  await db.schema.createIndex('profit_symbol_index').on('profit').column('symbol').execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('portfolio').execute()
  await db.schema.dropTable('portfolio_item').execute()
  await db.schema.dropTable('coin_price').execute()
  await db.schema.dropTable('transaction').execute()
  await db.schema.dropTable('profit').execute()
  await db.schema.dropIndex('portfolio_item_symbol_index').execute()
  await db.schema.dropIndex('portfolio_item_portfolio_name_index').execute()
  await db.schema.dropIndex('transaction_symbol_index').execute()
  await db.schema.dropIndex('transaction_id_index').execute()
  await db.schema.dropIndex('profit_symbol_index').execute()
}
