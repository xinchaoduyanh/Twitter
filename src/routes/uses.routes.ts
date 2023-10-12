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
  updateMeController,
  getProfileController,
  followController,
  unfollowController,
  changePasswordController,
  oauthController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middleware'
import {
  followValidator,
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator,
  unfollowValidator,
  changePasswordValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
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
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'avatar',
    'bio',
    'cover_photo',
    'date_of_birth',
    'location',
    'name',
    'username',
    'website'
  ]),
  wrapRequestHandler(updateMeController)
)
/**
 * Description:Get user profile
 * Path: /:username
 * Method: Get
 */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))
/**
 * Description:Follow user, Trong do nguoi dung phai duoc kiem tra AT va account phai verified
 * Path: /follow
 * Method: POST
 * Body : { followed_user_id:string}
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)
/**
 * Description:Unfollowed
 * Path: /follow/:usr_id
 * Method: DELETE
 */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)
/**
 * Description:Change Password
 * Path: /change_password
 * Method: PUT
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)
/**
 * Description: Oauth with google
 * Path: /oauth/google
 * Method: GET
 * Body: {email:string password: string}
 * Query: {code: string}
 */
usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))
export default usersRouter
