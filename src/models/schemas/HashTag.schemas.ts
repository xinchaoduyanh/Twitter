import { ObjectId } from 'mongodb'

interface HashTagtype {
  _id?: ObjectId
  name: string
  createdAt?: Date
}
export class HashTag {
  _id?: ObjectId
  name: string
  createdAt: Date
  constructor({ _id, name, createdAt }: HashTagtype) {
    this._id = _id || new ObjectId()
    this.name = name
    this.createdAt = createdAt || new Date()
  }
}
