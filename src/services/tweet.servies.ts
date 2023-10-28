import { CreateTweetRequestBody } from '~/models/requests/Tweet.requests'
import databaseService from './database.services'
import Tweet from '~/models/schemas/Tweet.schemas'
import { ObjectId, WithId } from 'mongodb'
import { has } from 'lodash'
import { HashTag } from '~/models/schemas/HashTag.schemas'

class TweetService {
  async checkAndCreateHashTags(hashTags: string[]) {
    const result = await Promise.all(
      hashTags.map((hashTag) => {
        return databaseService.hashTags.findOneAndUpdate(
          {
            name: hashTag
          },
          {
            $setOnInsert: new HashTag({
              name: hashTag
            })
          },
          {
            upsert: true,
            returnDocument: 'after' // return sau khi đã update
          }
        )
      })
    )
    return result.map((item) => (item as WithId<HashTag>)._id)
  }
  async createTweet(user_id: string, body: CreateTweetRequestBody) {
    const hashtags = await this.checkAndCreateHashTags(body.hashtags)
    console.log(hashtags)

    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags,
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
  async increaseViews(tweet_id: string, user_id?: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
    const result = await databaseService.tweets.findOneAndUpdate(
      { _id: new ObjectId(tweet_id) },
      {
        $inc: inc,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          user_views: true,
          guest_views: true
        }
      }
    )
    return result as WithId<Tweet> as WithId<{
      user_views: number
      guest_views: number
    }>
  }
}

export const tweetService = new TweetService()
