import { MongoClient, Db, Collection } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schemas'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Follower from '~/models/schemas/Follower.schemas'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
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
  indexUsers() {
    this.users.createIndex({ email: 1, password: 1 }, { unique: true })
    this.users.createIndex({ username: 1 }, { unique: true })
  }
  indexRefreshToken() {
    this.refreshToken.createIndex({ token: 1 }, { unique: true })
    this.refreshToken.createIndex(
      { exp: 1 },
      {
        expireAfterSeconds: 0
      }
    )
  }
  indexFollowers() {
    this.followers.createIndex({ user_id: 1, followed_user_id: 1 }, { unique: true })
  }
  indexVideoStatus() {
    this.videoStatus.createIndex({ name: 1 }, { unique: true })
  }
}
const databaseService = new DatabaseService()
export default databaseService
