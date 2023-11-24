import { ObjectId } from 'mongodb'

interface ConversationType {
  _id?: ObjectId
  receiver_id: ObjectId
  sender_id: ObjectId
  content: string
  created_at?: Date
  updated_at?: Date
}
export default class Conversation {
  _id?: ObjectId
  receiver_id: ObjectId
  sender_id: ObjectId
  content: string
  created_at?: Date
  updated_at?: Date
  constructor({ _id, receiver_id, sender_id, content, created_at, updated_at }: ConversationType) {
    const date = new Date()
    this._id = _id
    this.receiver_id = receiver_id
    this.sender_id = sender_id
    this.content = content
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
