import { MongoClient, Db, Collection } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schemas'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Follower from '~/models/schemas/Follower.schemas'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
import Tweet from '~/models/schemas/Tweet.schemas'
import { HashTag } from '~/models/schemas/HashTag.schemas'
import Bookmark from '~/models/schemas/Bookmarks.schemas'
import Like from '~/models/schemas/Likes.schemas'
import Conversation from '~/models/schemas/Converstation.schemas'

dotenv.config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.ksyhz00.mongodb.net/?retryWrites=true&w=majority`
// const uri = `mongodb+srv://vuduyanh1912:vuduyanh1912@twitter.ksyhz00.mongodb.net/?retryWrites=true&w=majority`
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }
  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
  }
  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(process.env.DB_VIDEO_STATUS_COLLECTION as string)
  }
  get tweets(): Collection<Tweet> {
    return this.db.collection(process.env.DB_TWEETS_COLLECTION as string)
  }
  get hashTags(): Collection<HashTag> {
    return this.db.collection(process.env.DB_HASHTAGS_COLLECTION as string)
  }
  get bookmarks(): Collection<Like> {
    return this.db.collection(process.env.DB_BOOKMARKS_COLLECTION as string)
  }
  get likes(): Collection<Bookmark> {
    return this.db.collection(process.env.DB_LIKES_COLLECTION as string)
  }
  get Conversation(): Collection<Conversation> {
    return this.db.collection(process.env.DB_CONVERSATION_COLLECTION as string)
  }

  async indexUsers() {
    const exist = await this.users.indexExists(['email_1_password_1', 'username_1'])
    if (!exist) {
      this.users.createIndex({ email: 1, password: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }
  async indexRefreshToken() {
    const exist = await this.refreshToken.indexExists(['token_1'])
    if (exist) return
    this.refreshToken.createIndex({ token: 1 }, { unique: true })

    this.refreshToken.createIndex(
      { exp: 1 },
      {
        expireAfterSeconds: 0
      }
    )
  }
  async indexFollowers() {
    const exist = await this.followers.indexExists(['user_id_1_followed_user_id_1'])
    if (exist) return
    this.followers.createIndex({ user_id: 1, followed_user_id: 1 }, { unique: true })
  }
  async indexVideoStatus() {
    const exist = await this.videoStatus.indexExists(['name_1'])
    if (exist) return
    this.videoStatus.createIndex({ name: 1 }, { unique: true })
  }
  async indexTweet() {
    const exist = await this.tweets.indexExists(['content_text'])
    if (!exist) {
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }
}
const databaseService = new DatabaseService()
export default databaseService
