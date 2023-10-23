import { Router } from 'express'
import { createTweetController, getTweetController } from '~/controllers/tweets.controllers'
import { createTweetValidator } from '~/middlewares/tweet.middleware'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()
/**
 * Description: Create twweet
 * Path: /tweet
 * Method: POST
 * Body: TweetRequestBody
 * Header: {Authorization: Beared <accessToken>}
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)
/**
 * Description: get Tweet by id
 * Path: /tweet
 * Method: POST
 * Body: TweetRequestBody
 * Header: {Authorization: Beared <accessToken>}
 */
tweetsRouter.get('/:tweet_id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getTweetController))
export default tweetsRouter
