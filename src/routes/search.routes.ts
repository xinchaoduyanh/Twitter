import { Router } from 'express'
import { SearchController } from '~/controllers/search.controller'
import { searchValidator } from '~/middlewares/search.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const searchRouter = Router()

searchRouter.post('/', accessTokenValidator, verifiedUserValidator, searchValidator, SearchController)

export default searchRouter
