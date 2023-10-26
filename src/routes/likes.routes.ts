import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { Router } from 'express'
import { BookmarkTweetController, unBookmarkTweetController } from '~/controllers/bookmarks.controller'
import { tweetIdValidator } from '~/middlewares/tweet.middleware'
import { LikeTweetController, unLikeTweetController } from '~/controllers/likes.controllers'
const likesRouter = Router()
/**
 * Description: Like a tweet
 * Path: /like
 * Method: POST
 * Body: LikeRequestBody
 * Header: {Authorization: Beared <accessToken>}
 */
likesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(LikeTweetController)
)
/**
 * Description: unlike a tweet
 * Path: /:tweet_id
 * Method: DELETE
 * Body: LikeRequestBody
 * Header: {Authorization: Beared <accessToken>}
 */
likesRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unLikeTweetController)
)
export default likesRouter
