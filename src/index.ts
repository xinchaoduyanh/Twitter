import express from 'express'
const app = express()
const PORT = 3000
import usersRouter from './routes/uses.routes'
import databaseService from './services/database.services'
app.use(express.json())
app.use('/users', usersRouter)
databaseService.connect()

app.listen(PORT, () => {
  console.log('yarh im coming hehe')
})
