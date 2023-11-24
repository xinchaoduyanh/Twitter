import { Router } from 'express'
import { getConverStationController } from '~/controllers/converstations.controller'
import { paginationValidator } from '~/middlewares/tweet.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const converstationRouter = Router()

converstationRouter.get(
  '/receiver/:receiverId',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  wrapRequestHandler(getConverStationController)
)
export default converstationRouter
