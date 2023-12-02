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
import converstationRouter from './routes/converstation.routes'
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
app.use('/converstations', converstationRouter)

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
  socket.on('send message', async (data) => {
    const { payload } = data
    const receiver_socket_id = users[payload.receiver_id]?.socket_id
    if (!receiver_socket_id) {
      return
    }
    const converstation = new Conversation({
      receiver_id: new ObjectId(payload.receiver_id),
      sender_id: new ObjectId(payload.sender_id),
      content: payload.content
    })
    const result = await databaseService.Conversation.insertOne(converstation)
    converstation._id = result.insertedId
    socket.to(receiver_socket_id).emit('receive message', {
      payload: converstation
    })
  })

  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`socket ${socket.id} disconnected`)
  })
})

httpServer.listen(PORT, () => {
  console.log('yarh im coming hehe')
})
