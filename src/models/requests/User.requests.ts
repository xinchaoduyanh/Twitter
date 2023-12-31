import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { ParamsDictionary } from 'express-serve-static-core'
export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: Date
  bio?: string // optional
  location?: string // optional
  website?: string // optional
  username?: string // optional
  avatar?: string // optional
  cover_photo?: string // optional
}
export interface RegisterRequestBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}
export interface LoginRequestBody {
  email: string
  password: string
}
export interface LogoutRequestBody {
  refresh_token: string
}
export interface RefreshTokenRequestBody {
  refresh_token: string
}
export interface VerifyEmailRequestBody {
  email_verify_token: string
}
export interface ForgotPasswordRequestBody {
  email: string
}
export interface VerifyForgotPasswordRequestBody {
  forgot_password_token: string
}
export interface ResetPasswordRequestBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}
export interface FollowedRequestBody {
  followed_user_id: string
}
export interface UnFollowedRequestBody extends ParamsDictionary {
  user_id: string
}
export interface changePasswordRequestBody extends ParamsDictionary {
  old_password: string
  password: string
  confirm_password: string
}
export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}
