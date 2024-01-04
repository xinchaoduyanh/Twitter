import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
const app = express()
import { config } from 'dotenv'
import { envConfig, isProduction } from './constants/config'
import usersRouter from './routes/uses.routes'
import mediasRouter from './routes/medias.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middleware'
import { initFolerUpload } from './utils/files'
import argv from 'minimist'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import cors, { CorsOptions } from 'cors'
import tweetsRouter from './routes/tweet.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import conversationRouter from './routes/conversation.routes'
// import './utils/fake'
import YAML from 'yaml'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
import helmet from 'helmet'
import './utils/s3'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { da } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { rateLimit } from 'express-rate-limit'
import { verify } from 'crypto'
import { verifyAccessToken } from './utils/common'
import Conversation from './models/schemas/Converstation.schemas'

//---------------------------------------------------------SWAGGER && APP SETUP----------------------------------------------------- //
// import swaggerjsdoc from 'swagger-jsdoc'
const swaggerDocument = YAML.parse(fs.readFileSync('./swagger.yaml', 'utf8'))

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Twitter API',
//       version: '1.0.0',
//       description: 'A simple Express Library API'
//     }
//   },
//   apis: ['./openapi/*.yaml']
// }
// const onpenapiSpecification = swaggerJsdoc(options)
app.use(express.json())
const PORT = envConfig.port || 3000
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
  // store: ... , // Use an external store for consistency across multiple server instances.
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(helmet())
app.use(limiter)
// Tai sao CORS phai khai bao o day ma khong duoc khai bao duoi router nhi ???
const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}

app.use(cors(corsOptions))
//---------------------------------------------------------ROUTER----------------------------------------------------- //
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use('/uploads/video', express.static(UPLOAD_VIDEO_DIR)) // tạo đường dẫn tĩnh đến thư mục upload
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationRouter)
app.use(defaultErrorHandler)

//---------------------------------------------------------SEVER---------------------------------------------------- //

const httpServer = createServer(app)

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshToken()
  databaseService.indexFollowers()
  databaseService.indexVideoStatus()
  databaseService.indexTweet()
})
initFolerUpload()
//---------------------------------------------------------SOCKET---------------------------------------------------- //
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
io.use(async (socket, next) => {
  const Authorization = socket.handshake.auth.Authorization
  const access_token = Authorization?.split(' ')[1]
  if (!access_token) {
    return next(new Error('unauthorized'))
  }
  try {
    await verifyAccessToken(access_token)
  } catch (error) {
    next({
      data: error,
      message: 'unauthorized',
      name: 'unauthorizedError'
    })
  }
})
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
    const conversation = new Conversation({
      receiver_id: new ObjectId(payload.receiver_id),
      sender_id: new ObjectId(payload.sender_id),
      content: payload.content
    })
    const result = await databaseService.Conversation.insertOne(conversation)
    conversation._id = result.insertedId
    socket.to(receiver_socket_id).emit('receive message', {
      payload: conversation
    })
  })

  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`socket ${socket.id} disconnected`)
  })
})

httpServer.listen(PORT, () => {
  console.log('yarh im coming hehe at port', PORT)
})
