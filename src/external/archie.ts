import puppeteer from 'puppeteer'
import { ARCHIE_PORTFOLIO_NAME } from './constants'
import { PortfolioItem } from '../dto/portfolioItem.dto'

const URL =
  'https://www.coingecko.com/en/portfolios/public/BAh7BjoRcG9ydGZvbGlvX2lkaQMJELQ=--711a8ae9fb6d6a7f4264d3dcecd202fab056b060'

const coinSymbolSelector = 'td.py-0.coin-name>div>div:nth-child(2)>span'
const holdingsShareSelector = 'td.text-right.col-gecko.no-wrap>div>span'

export async function parseArchiePortfolio() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [`--window-size=${1280},${1200}`],
    defaultViewport: {
      width: 1280,
      height: 1200,
    },
  })
  const page = await browser.newPage()
  // Coin Gecko loads super slow in puppeteer
  await page.goto(URL, { timeout: 120000 })

  const $rows = await page.$$('table>tbody>tr')

  const archiePortfolio = [] as PortfolioItem[]

  for (const $row of $rows) {
    const symbol: string = await $row.$eval(
      coinSymbolSelector,
      (node) => node.textContent.trim() || '',
    )

    const share: number = await $row.$eval(
      holdingsShareSelector,
      (node) => parseFloat(node.textContent.trim()) || 0,
    )

    archiePortfolio.push(
      PortfolioItem.create({
        symbol,
        avgPrice: 0,
        portfolioName: ARCHIE_PORTFOLIO_NAME,
        amount: 0,
        share,
        profit: 0,
        changeInShare: 0,
      }),
    )
  }

  await browser.close()

  return archiePortfolio
}
