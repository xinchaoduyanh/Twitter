import { Response, Request } from 'express'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.requests'
import { LoginRequestBody, TokenPayload } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { tweetService } from '~/services/tweet.servies'
import { TWEETS_MESSAGES } from '~/constants/messages'
export const createTweetController = async (
  req: Request<ParamsDictionary, any, CreateTweetRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetService.createTweet(user_id, req.body)
  return res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESSFULLY,
    result
  })
}
export const getTweetController = async (
  req: Request<ParamsDictionary, any, CreateTweetRequestBody>,
  res: Response
) => {
  const result = await tweetService.increaseViews(req.params.tweet_id, req.decoded_authorization?.user_id)
  const tweet = { ...req.tweet, user_views: result.user_views, guest_views: result.guest_views } // Destructoring de cap nhat view
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFULLY,
    result: tweet
  })
}
