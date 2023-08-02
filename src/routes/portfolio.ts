import { Router } from 'express'
import { handleGetPortfolio } from '../handlers/portfolio'

const router = Router()

router.get('/:name', handleGetPortfolio)

export { router }
