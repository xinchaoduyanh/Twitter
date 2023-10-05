import { Router } from 'express'
import {
  registerController,
  loginController,
  logoutController,
  verifyEmailController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyforgotPasswordController,
  resetPasswordController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
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
 * Body: {email-verify-token: string}
 *
 *
 *
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))
/**
 * Description:Submit email when user click to reset the password
 * Path: /forgot-password
 * Method: POST
 * Header:
 * Body: {email:string}
 *
 *
 *
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))
/**
 * Description:Reset the password and change fotgot email token
 * Path: /reset password
 * Method: POST
 * Header:
 * Body: {forgot_password_token: string}
 *
 *
 *
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyforgotPasswordController)
)
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))
export default usersRouter
