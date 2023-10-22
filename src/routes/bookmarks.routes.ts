import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { Router } from 'express'
import { BookmarkTweetController } from '~/controllers/bookmarks.controller'
const bookmarksRouter = Router()
/**
 * Description: Bookmark a tweet
 * Path: /tweet
 * Method: POST
 * Body: TweetRequestBody
 * Header: {Authorization: Beared <accessToken>}
 */
bookmarksRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(BookmarkTweetController))

export default bookmarksRouter
