import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.ksyhz00.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri)

async function createUsers() {
  try {
    await client.connect()
    const database = client.db('earth')
    const collection = database.collection('user')
    for (let i = 1; i <= 1000; i++) {
      const name = `user${i}`
      const age = Math.floor(Math.random() * 100) + 1
      const gender = i % 2 === 0 ? 'nam' : 'nữ'
      const user = { name, age, gender }
      await collection.insertOne(user)
    }
    console.log('Inserted 1000 users into the database')
  } catch (err) {
    console.error(err)
  } finally {
    await client.close()
  }
}

createUsers()
