import { parseArchiePortfolio } from './archie'
import { ARCHIE_PORTFOLIO_NAME } from './constants'
import { saveParsedPortfolio } from '../repository/portfolio'
import { logger } from '../config/logger'

export function setExternalPortfolioParsesInterval() {
  setInterval(async () => {
    try {
      const archieItems = await parseArchiePortfolio()
      await saveParsedPortfolio(ARCHIE_PORTFOLIO_NAME, archieItems)
    } catch (err) {
      logger.error(`Error parsing and saving "${ARCHIE_PORTFOLIO_NAME}" portfolio: ${err}`)
    }
  }, 1000 * 60 * 60 * 24)
}
