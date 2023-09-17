import { Request, Response } from 'express'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/requests/User.requests'
export const userController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'okduyah' && password == 'hahaduyanh') {
    return res.status(400).json({
      message: 'Login success'
    })
  }
  return res.status(400).json({
    error: 'Login failed'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersService.register(req.body)
  // throw new Error('chao em trai')
  // await databaseService.users.find({})
  return res.json({
    message: 'Success to regiter',
    result
  })
  return res.json({
    error: ' register failed'
  })
}
