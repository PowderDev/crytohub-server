import { Request, Response } from 'express'
import { getPortfolioItems } from '../repository/portfolio'

export async function handleGetPortfolio(req: Request, res: Response) {
  const { name } = req.params
  const items = await getPortfolioItems(name)
  res.json(items)
}
