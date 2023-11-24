import { Router } from 'express'
import { getConverStationController } from '~/controllers/converstations.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const converstationRouter = Router()

converstationRouter.get(
  '/receiver/:receiverId',
  accessTokenValidator,
  verifiedUserValidator,
  getConverStationController
)
export default converstationRouter
