import { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface Database {
  portfolioItem: PortfolioItemTable
  coinPrice: CoinPriceTable
  transaction: TransactionTable
  portfolio: PortfolioTable
}

export interface PortfolioTable {
  name: string
}

export interface PortfolioItemTable {
  rank: number
  name: string
  symbol: string
  avgPrice: number
  share: number
  portfolioId: number
  amount: number
  created_at: Date
}

export type Portfolio = Selectable<PortfolioItemTable>
export type NewPortfolio = Insertable<PortfolioItemTable>
export type PortfolioUpdate = Updateable<PortfolioItemTable>

export interface CoinPriceTable {
  symbol: string
  price: number
}

export type CoinPrice = Selectable<CoinPriceTable>
export type NewCoinPrice = Insertable<CoinPriceTable>
export type CoinPriceUpdate = Updateable<CoinPriceTable>

export interface TransactionTable {
  id: Generated<number>
  symbol: string
  amount: number
  price: number
  created_at: Date
}

export type Transaction = Selectable<TransactionTable>
export type NewTransaction = Insertable<TransactionTable>
export type TransactionUpdate = Updateable<TransactionTable>

export interface ProfitTable {
  id: Generated<number>
  date: Date
  profit: number
}

export type Profit = Selectable<TransactionTable>
export type NewProfit = Insertable<TransactionTable>
export type ProfitUpdate = Updateable<TransactionTable>
