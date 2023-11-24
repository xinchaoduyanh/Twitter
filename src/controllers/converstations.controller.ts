import { Request, Response } from 'express'
import converstationService from '~/services/converstation.services'

export const getConverStationController = async (req: Request, res: Response) => {
  const { receiverId } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const sender_id = req.decoded_authorization?.user_id as string
  const data = await converstationService.getConverStation({
    receiver_id: receiverId,
    sender_id: sender_id,
    limit: Number(limit),
    page: Number(page)
  })
  console.log(receiverId, sender_id, data)
  return res.status(200).json({
    message: 'Get converstation successfully',
    result: {
      converstations: data.converstation,
      total: data.total,
      totalpage: Math.ceil(data.total / limit),
      limit: limit
    }
  })
}
