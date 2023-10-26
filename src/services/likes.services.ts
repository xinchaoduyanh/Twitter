import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Bookmark from '~/models/schemas/Bookmarks.schemas'
import Like from '~/models/schemas/Likes.schemas'

class LikesServie {
  async likeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Like({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      },
      {
        upsert: true,
        returnDocument: 'after' // return sau khi đã update
      }
    )
    return result
  }
  async unLikeTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
}
export const likesService = new LikesServie()
