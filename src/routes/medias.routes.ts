import { Router } from 'express'
import { uploadImageController, uploadVideoController, uploadVideoHLSController } from '~/controllers/media.controller'
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
 * * Description: Up load new video
 * Path: /upload-video
 * Method: POST
 * Body: {file: File}
 */
mediasRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)
/*
 * * Description: Up load new video
 * Path: /upload-video
 * Method: POST
 * Body: {file: File}
 */
mediasRouter.post(
  '/upload-video-hls',
  // accessTokenValidator,
  // verifiedUserValidator,
  wrapRequestHandler(uploadVideoHLSController)
)
export default mediasRouter
