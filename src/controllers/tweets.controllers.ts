import { Response, Request } from 'express'
import { CreateTweetRequestBody, RequestTweetParams, TweetQuery } from '~/models/requests/Tweet.requests'
import { LoginRequestBody, TokenPayload } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { tweetService } from '~/services/tweet.servies'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { TweetType } from '~/constants/enums'
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
export const getTweetController = async (req: Request<RequestTweetParams, any, any, TweetQuery>, res: Response) => {
  const result = await tweetService.increaseViews(req.params.tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...req.tweet,
    user_views: result.user_views,
    guest_views: result.guest_views,
    updated_at: result.updated_at
  } // Destructoring de cap nhat view
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESSFULLY,
    result: tweet
  })
}

export const getTweetChildrenController = async (
  req: Request<RequestTweetParams, any, any, TweetQuery>,
  res: Response
) => {
  const tweet_id = req.params.tweet_id
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const tweet_type = Number(req.query.tweet_type as string)
  const { data, total } = await tweetService.getTweetChildren({
    tweet_id,
    limit,
    page,
    tweet_type
  })
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_CHILDREN_SUCCESSFULLY,
    data,
    page,
    limit,
    tweet_type,
    totalPage: Math.ceil(total / limit)
  })
}
export const getNewFeedController = async (req: Request<any, any, any, any>, res: Response) => {
  const user_id = req.decoded_authorization?.user_id as string
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const result = await tweetService.getNewFeed({ user_id, page, limit })
  return res.json({
    message: TWEETS_MESSAGES.GET_NEW_FEED_SUCCESSFULLY,
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
