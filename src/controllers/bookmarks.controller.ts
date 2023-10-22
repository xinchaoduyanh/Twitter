import { Response, Request } from 'express'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.requests'
import { LoginRequestBody, TokenPayload } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { tweetService } from '~/services/tweet.servies'
import { BookmarkTweetRequestBody } from '~/models/requests/Bookmarks.request'
import { bookmarksService } from '~/services/bookmarks.services'
export const BookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.body
  const result = await bookmarksService.bookmarkTweet(user_id, tweet_id)
  return res.json({
    message: 'Bookmark tweet successfully',
    result
  })
}