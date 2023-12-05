import { Request, Response } from 'express'
import { getconversationRequest } from '~/models/requests/Converstations.request'
import conversationService from '~/services/conversation.services'

export const getconversationController = async (req: Request<getconversationRequest>, res: Response) => {
  const { receiverId } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const sender_id = req.decoded_authorization?.user_id as string
  const data = await conversationService.getconversation({
    receiver_id: receiverId,
    sender_id: sender_id,
    limit: Number(limit),
    page: Number(page)
  })
  // console.log(receiverId, sender_id, data)
  return res.status(200).json({
    message: 'Get conversation successfully',
    result: {
      conversations: data.conversation,
      total: data.total,
      total_page: Math.ceil(data.total / limit),
      limit: limit,
      page: page
    }
  })
}
