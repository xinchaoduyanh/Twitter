import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { Router } from 'express'
import { BookmarkTweetController, unBookmarkTweetController } from '~/controllers/bookmarks.controller'
import { tweetIdValidator } from '~/middlewares/tweet.middleware'
const bookmarksRouter = Router()
/**
 * Description: Bookmark a tweet
 * Path: /tweet
 * Method: POST
 * Body: TweetRequestBody
 * Header: {Authorization: Beared <accessToken>}
 */
bookmarksRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(BookmarkTweetController)
)
/**
 * Description: unBookmark a tweet
 * Path: /:tweet_id
 * Method: DELETE
 * Body: TweetRequestBody
 * Header: {Authorization: Beared <accessToken>}
 */
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unBookmarkTweetController)
)
export default bookmarksRouter
