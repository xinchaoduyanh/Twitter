import { Response, Request } from 'express'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.requests'
import { LoginRequestBody } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
export const createTweetController = async (
  req: Request<ParamsDictionary, any, CreateTweetRequestBody>,
  res: Response
) => {
  return res.json({
    message: 'Login success'
  })
}
