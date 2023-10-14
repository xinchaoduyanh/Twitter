import { Router } from 'express'
import { serveImageController } from '~/controllers/media.controller'


const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)

export default staticRouter
