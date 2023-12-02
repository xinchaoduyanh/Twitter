import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import e from 'express'

class Conversation {
  async getConverStation({
    receiver_id,
    sender_id,
    limit,
    page
  }: {
    receiver_id: string
    sender_id: string
    limit: number
    page: number
  }) {
    const match = {
      $or: [
        { sender_id: new ObjectId(sender_id), receiver_id: new ObjectId(receiver_id) },
        {
          sender_id: new ObjectId(receiver_id),
          receiver_id: new ObjectId(sender_id)
        }
      ]
    }
    const converstation = await databaseService.Conversation.find(match)
      .sort({ created_at: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
    const total = await databaseService.Conversation.countDocuments(match)
    return {
      converstation,
      total,
      page
    }
  }
}

const converstationService = new Conversation()
export default converstationService
