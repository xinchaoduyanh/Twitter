import User from '~/models/schemas/User.schemas'
import databaseService from './database.services'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import { hassPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { Collection, ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import { config } from 'dotenv'
import { USERS_MESSAGES } from '~/constants/messages'
config()
class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private signAccessRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async register(payload: RegisterRequestBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hassPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessRefreshToken(user_id)
    await databaseService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return {
      access_token,
      refresh_token
    }
  }
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    console.log(user)
    return Boolean(user)
  }
  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessRefreshToken(user_id)
    await databaseService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return {
      access_token,
      refresh_token
    }
  }
  async logout(refresh_token: string) {
    await databaseService.refreshToken.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }
}

const usersService = new UsersService()
export default usersService
