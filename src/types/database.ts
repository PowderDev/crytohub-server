import { Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface Database {
  portfolio_item: PortfolioItemTable
  cryptocurrency: CryptoCurrencyTable
  transaction: TransactionTable
  portfolio: PortfolioTable
  profit: ProfitTable
}

export interface PortfolioTable {
  name: string
}

export interface PortfolioItemTable {
  symbol: string
  avgPrice: number
  share: number
  profit: number
  portfolioName: string
  amount: number
  changeInShare: number
}

export type Portfolio = Selectable<PortfolioItemTable>
export type NewPortfolio = Insertable<PortfolioItemTable>
export type PortfolioUpdate = Updateable<PortfolioItemTable>

export interface CryptoCurrencyTable {
  symbol: string
  name: string
  price: number
}

export type CryptoCurrency = Selectable<CryptoCurrencyTable>
export type NewCryptoCurrency = Insertable<CryptoCurrencyTable>
export type CryptoCurrencyUpdate = Updateable<CryptoCurrencyTable>

export interface TransactionTable {
  id: Generated<number>
  symbol: string
  amount: number
  price: number
  createdAt: Date
}

export type Transaction = Selectable<TransactionTable>
export type NewTransaction = Insertable<TransactionTable>
export type TransactionUpdate = Updateable<TransactionTable>

export interface ProfitTable {
  id: Generated<number>
  date: Date
  profit: number
  portfolioName: string
}

export type Profit = Selectable<TransactionTable>
export type NewProfit = Insertable<TransactionTable>
export type ProfitUpdate = Updateable<TransactionTable>
