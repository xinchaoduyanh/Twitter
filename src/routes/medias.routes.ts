import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/media.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()
/*
 * * Description: Upload new images
 * Path: /upload-image
 * Method: POST
 * Body: {file: File}
 */
mediasRouter.post(
  '/upload-image',
  // accessTokenValidator,
  // verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
)
/*
 * * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: {name:string, email:string password: string,confirm_password,date_of_birth: ISO8081}
 */
mediasRouter.post('/upload-video', wrapRequestHandler(uploadVideoController))
export default mediasRouter
