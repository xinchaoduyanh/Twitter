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
app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
databaseService.connect()
initFolerUpload()
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log('yarh im coming hehe')
})
