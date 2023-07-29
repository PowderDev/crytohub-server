import puppeteer from 'puppeteer'
import { PortfolioItem } from '../dtos/portfolioItem.dto'

const URL =
  'https://www.coingecko.com/en/portfolios/public/BAh7BjoRcG9ydGZvbGlvX2lkaQMJELQ=--711a8ae9fb6d6a7f4264d3dcecd202fab056b060'

const rankSelector = 'td:nth-child(2)'
const coinNameSelector =
  'td.py-0.coin-name>div>div:nth-child(2)>a.tw-hidden.d-lg-flex.font-bold.align-items-center.justify-content-between'
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
  await page.goto(URL, { timeout: 60000 })

  const $rows = await page.$$('table>tbody>tr')

  const archiePortfolio = [] as PortfolioItem[]

  for (const $row of $rows) {
    const rank: number = await $row.$eval(
      rankSelector,
      (node) => parseInt(node.textContent.trim()) || 0,
    )

    const name: string = await $row.$eval(coinNameSelector, (node) => node.textContent.trim() || '')

    const symbol: string = await $row.$eval(
      coinSymbolSelector,
      (node) => node.textContent.trim() || '',
    )

    const share: number = await $row.$eval(
      holdingsShareSelector,
      (node) => parseInt(node.textContent.trim()) || 0,
    )

    archiePortfolio.push(PortfolioItem.create({ rank, name, symbol, share, avgPrice: 0 }))
  }

  await browser.close()

  return archiePortfolio
}
