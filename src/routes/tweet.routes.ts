import { Router } from 'express'
import { createTweetController, getTweetChildrenController, getTweetController } from '~/controllers/tweets.controllers'
import { audienceValidator, createTweetValidator, getTweetChildrenValidator, tweetIdValidator } from '~/middlewares/tweet.middleware'
import { accessTokenValidator, isUserLoggedInValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
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
tweetsRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)
/**
 * Description: get Tweet children by id
 * Path: /tweet
 * Method: POST
 * Body: TweetRequestBody
 * Header: {Authorization: Beared <accessToken>}
 * Query: {limit: number, page: number, tweet_type: TweetType}
 */
tweetsRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)
export default tweetsRouter
