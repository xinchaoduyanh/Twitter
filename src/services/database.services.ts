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
import { envConfig } from '~/constants/config'

dotenv.config()
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@twitter.ksyhz00.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
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
    return this.db.collection(envConfig.dbUsersCollection)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.dbFollowersCollection)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(envConfig.dbVideoStatusCollection)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.dbTweetsCollection)
  }

  get hashTags(): Collection<HashTag> {
    return this.db.collection(envConfig.dbHashtagsCollection)
  }

  get bookmarks(): Collection<Like> {
    return this.db.collection(envConfig.dbBookmarksCollection)
  }

  get likes(): Collection<Bookmark> {
    return this.db.collection(envConfig.dbLikesCollection)
  }

  get Conversation(): Collection<Conversation> {
    return this.db.collection(envConfig.dbConversationCollection)
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
