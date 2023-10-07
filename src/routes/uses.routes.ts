import { Router } from 'express'
import {
  registerController,
  loginController,
  logoutController,
  verifyEmailController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyforgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifiedUserValidator,
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
 * Description:Validate the verify forgot Token from  user
 * Path: /verify-forgot-token-password
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
/**
 * Description:Reset the password and change fotgot email token
 * Path: /reset password
 * Method: POST
 * Header:
 * Body: {forgot_password_token: string,password: string,confirm_password:string}
 *
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))
/**
 * Description:Get profile
 * Path: /me
 * Method: Get
 * Header:
 * Header: {Authorization: Bearer <access_token>}
 *
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))
/**
 * Description:Update Profile (The account need to be verified already)
 * Path: /me
 * Method: Patch (Co the dung Put)
 * Body: User Schema
 * Header: {Authorization: Bearer <access_token>}
 *
 */
usersRouter.patch('/me', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(updateMeController))

export default usersRouter
