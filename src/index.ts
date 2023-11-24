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
import { createServer } from 'http'
import { Server } from 'socket.io'
import { da } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import Conversation from './models/schemas/Converstation.schemas'

const httpServer = createServer(app)

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshToken()
  databaseService.indexFollowers()
  databaseService.indexVideoStatus()
  databaseService.indexTweet()
})
initFolerUpload()
app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})
const users: {
  [key: string]: {
    socket_id: string
  }
} = {}
io.on('connection', (socket) => {
  // ...
  console.log(`socket ${socket.id} connected`)
  const user_id = socket.handshake.auth._id as string
  users[user_id] = {
    socket_id: socket.id
  }
  socket.on('private message', async (data) => {
    const receiver_socket_id = users[data.to]?.socket_id
    if (!receiver_socket_id) return
    socket.to(receiver_socket_id).emit('receive private message', {
      content: data.content,
      from: user_id
    })
    await databaseService.Conversation.insertOne(
      new Conversation({
        receiver_id: data.to,
        sender_id: new ObjectId(user_id),
        content: data.content
      })
    )
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`socket ${socket.id} disconnected`)
  })
})

httpServer.listen(PORT, () => {
  console.log('yarh im coming hehe')
})
