import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Other'
import { ParamsDictionary, Query } from 'express-serve-static-core'
export interface CreateTweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}
export interface RequestTweetParams extends ParamsDictionary {
  tweet_id: string
}
export interface TweetQuery extends Query {
  limit: string
  page: string
  tweet_type: string
}
