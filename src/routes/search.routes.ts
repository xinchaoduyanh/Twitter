import { Router } from 'express'
import { SearchController } from '~/controllers/search.controller'

const searchRouter = Router()

searchRouter.post('/', SearchController)

export default searchRouter
