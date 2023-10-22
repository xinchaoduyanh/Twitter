import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Other'

export interface BookmarkTweetRequestBody {
  tweet_id: string
  user_id: string
}
