import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
const app = express()
const PORT = 3000
import usersRouter from './routes/uses.routes'
import databaseService from './services/database.services'
app.use(express.json())
app.use('/users', usersRouter)
databaseService.connect()
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Lỗi là: ', err.message)
  res.status(400).json({
    error: err.message
  })
})
app.listen(PORT, () => {
  console.log('yarh im coming hehe')
})
