import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
const app = express()
import { config } from 'dotenv'
config()
const PORT = process.env.PORT || 3000

import usersRouter from './routes/uses.routes'
import mediasRouter from './routes/medias.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middleware'
import { initFolerUpload } from './utils/files'
import argv from 'minimist'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import cors from 'cors'
import tweetsRouter from './routes/tweet.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
// import './utils/fake'

app.use(express.json())
app.use(cors())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use('/uploads/video', express.static(UPLOAD_VIDEO_DIR)) // tạo đường dẫn tĩnh đến thư mục upload
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/search', searchRouter)
import './utils/s3'
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshToken()
  databaseService.indexFollowers()
  databaseService.indexVideoStatus()
  databaseService.indexTweet()
})
initFolerUpload()
app.use(defaultErrorHandler)


app.listen(PORT, () => {
  console.log('yarh im coming hehe')
})

// import { MongoClient } from 'mongodb'
// import dotenv from 'dotenv'
// dotenv.config()
// const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.ksyhz00.mongodb.net/?retryWrites=true&w=majority`

// const client = new MongoClient(uri)

// async function createUsers() {
//   try {
//     await client.connect()
//     const database = client.db('earth')
//     const collection = database.collection('user')
//     for (let i = 1; i <= 1000; i++) {
//       const name = `user${i}`
//       const age = Math.floor(Math.random() * 100) + 1
//       const gender = i % 2 === 0 ? 'nam' : 'nữ'
//       const user = { name, age, gender }
//       await collection.insertOne(user)
//     }
//     console.log('Inserted 1000 users into the database')
//   } catch (err) {
//     console.error(err)
//   } finally {
//     await client.close()
//   }
// }

// createUsers()
