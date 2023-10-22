import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Bookmark from '~/models/schemas/Bookmarks.schemas'

class BookmarksServie {
  async bookmarkTweet(user_id: string, tweet_id: string) {
    const result = await databaseService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
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
}
export const bookmarksService = new BookmarksServie()
