import { DatabaseTransaction } from '../database/dto/databaseTransaction.dto'
import { db } from '../index'
import { AppError } from '../errorHandler'
import { PortfolioItem } from '../dto/portfolioItem.dto'

export async function makeTransaction(tx: DatabaseTransaction) {
  const cryptocurrency = await db
    .selectFrom('cryptocurrency')
    .selectAll()
    .where('symbol', '=', tx.symbol)
    .executeTakeFirst()

  if (!cryptocurrency) {
    throw new AppError('CryptoCurrency does not exist', 400)
  }

  let portfolioItems = await db
    .selectFrom('portfolio_item')
    .where('portfolioName', '=', tx.portfolioName)
    .selectAll()
    .execute()

  portfolioItems = portfolioItems.map(PortfolioItem.create)

  let pi: PortfolioItem | undefined = portfolioItems.find((item) => item.symbol === tx.symbol)

  if (!pi) {
    pi = PortfolioItem.create({
      symbol: cryptocurrency.symbol,
      profit: 0,
      portfolioName: tx.portfolioName,
      changeInShare: 0,
      amount: tx.amount,
      avgPrice: tx.price,
      share: 0,
    })

    await db.insertInto('portfolio_item').values(pi).execute()
  }

  const newAmount = pi.amount + tx.amount
  const newAvgPrice = (pi.avgPrice * pi.amount + tx.price * tx.amount) / newAmount
  const profit = (cryptocurrency.price - newAvgPrice) * newAmount
  const allInvestedMoney = portfolioItems.reduce(
    (acc, item) => acc + item.amount * item.avgPrice,
    0,
  )
  const newShare = (newAmount * newAvgPrice) / allInvestedMoney

  await db
    .updateTable('portfolio_item')
    .set({
      amount: newAmount,
      avgPrice: newAvgPrice,
      profit,
      share: newShare,
    })
    .where('portfolioName', '=', tx.portfolioName)
    .where('symbol', '=', tx.symbol)
    .execute()
}
