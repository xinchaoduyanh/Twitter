import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ForgotPasswordRequestBody,
  LoginRequestBody,
  LogoutRequestBody,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  TokenPayload,
  VerifyEmailRequestBody,
  VerifyForgotPasswordRequestBody
} from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  console.log(user)

  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
  return res.json({
    error: USERS_MESSAGES.REGISTER_FAILED
  })
}
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body
  // console.log(refresh_token)

  const result = await usersService.logout(refresh_token)
  return res.json(result)
}
export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.ACCEPTED).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  //Neu da verify roi thi se lhong bao loi
  //Ma se tra ve status OK voi message la da verify roi
  if (user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_IS_ALREADY_VERIFY_BEFORE
    })
  }
  const result = await usersService.verifyEmail(user_id)

  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}
export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  if (!user) {
    return res.status(HTTP_STATUS.ACCEPTED).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_IS_ALREADY_VERIFY_BEFORE
    })
  }
  const result = await usersService.resendVerifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.user as User
  const result = await usersService.forgotPassword((_id as ObjectId).toString())
  return res.json(result)
}
export const verifyforgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}
export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_fotgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(user_id, password)
  return res.json(result)
}
