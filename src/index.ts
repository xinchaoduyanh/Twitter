import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
const app = express()
const PORT = 4000
import usersRouter from './routes/uses.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middleware'
app.use(express.json())
app.use('/users', usersRouter)
databaseService.connect()
app.use(defaultErrorHandler)
app.listen(PORT, () => {
  console.log('yarh im coming hehe')
})
