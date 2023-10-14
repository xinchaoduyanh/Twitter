import { Router } from 'express'
import { serveImageController, serveVideoController } from '~/controllers/media.controller'

const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)
staticRouter.get('/video/:name', serveVideoController)
export default staticRouter
