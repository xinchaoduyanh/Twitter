import { Response, Request } from 'express'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.requests'
import { LoginRequestBody, TokenPayload } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { tweetService } from '~/services/tweet.servies'
import { BookmarkTweetRequestBody } from '~/models/requests/Bookmarks.request'
import { bookmarksService } from '~/services/bookmarks.services'
import { BOOKMARKS_MESSAGES, LIKES_MESSAGES } from '~/constants/messages'
import { log } from 'console'
import { likesService } from '~/services/likes.services'
export const LikeTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.body
  const result = await likesService.likeTweet(user_id, tweet_id)
  return res.json({
    message: LIKES_MESSAGES.LIKE_TWEET_SUCCESS,
    result
  })
}
export const unLikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likesService.unLikeTweet(user_id, req.params.tweet_id)
  return res.json({
    message: LIKES_MESSAGES.UNLIKE_TWEET_SUCCESS,
    result
  })
}
