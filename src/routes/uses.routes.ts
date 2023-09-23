import { Router } from 'express'
import {
  registerController,
  loginController,
  logoutController,
  emailVerifyValidator
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()
/**
 * Description: Login a new user
 * Path: /register
 * Method: POST
 * Body: {email:string password: string}
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: {name:string, email:string password: string,confirm_password,date_of_birth: ISO8081}
 *
 *
 *
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Logout a  user
 * Path: /register
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {refresh_token: string}
 *
 *
 *
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
/**
 * Description: Verify email when user click
 * Path: /verify
 * Method: POST
 * Header: 
 * Body: {refresh_token: string}
 *
 *
 *
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyValidator))
export default usersRouter
