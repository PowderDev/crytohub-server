import { DatabasePortfolioItem } from '../database/dto/databasePortfolioItem.dto'
import { db } from '../index'
import { Database } from '../types/database'
import { sql } from 'kysely'
import { logger } from '../config/logger'
import { AppError } from '../errorHandler'

export async function saveParsedPortfolio(name: string, items: DatabasePortfolioItem[]) {
  const itemsToSave = items.map<Database['portfolio_item']>((item) =>
    DatabasePortfolioItem.convertToPlain(item),
  )

  await db
    .insertInto('portfolio')
    .values({ name })
    .onConflict((c) => c.column('name').doNothing())
    .execute()

  const calcChangeInShare = await db
    .insertInto('portfolio_item')
    .values(itemsToSave)
    .onConflict((c) =>
      c.column('symbol').doUpdateSet({
        name: sql`excluded.name`,
        amount: sql`excluded.amount`,
        avgPrice: sql`excluded."avgPrice"`,
        portfolioName: sql`excluded."portfolioName"`,
        rank: sql`excluded.rank`,
        symbol: sql`excluded.symbol`,
        share: sql`excluded.share`,
        profit: sql`excluded.profit`,
        changeInShare: sql`
    case when portfolio_item."changeInShare" - excluded."changeInShare" = portfolio_item."changeInShare" 
    then 0
    else portfolio_item."changeInShare" - excluded."changeInShare"
    end;`,
      }),
    )
    .execute()

  logger.info(`Saved "${name}" portfolio`)
}

export async function getPortfolioItems(portfolioName: string) {
  if (!portfolioName) {
    throw new AppError('Portfolio name is required', 400)
  }

  const items = await db
    .selectFrom('portfolio_item')
    .selectAll()
    .where('portfolioName', '=', portfolioName)
    .execute()

  return items.map((items) => DatabasePortfolioItem.create(items))
}
