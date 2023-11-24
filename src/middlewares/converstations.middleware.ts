import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const getConverStationValidator = validate(
  checkSchema(
    {
      receiver_id: {
        errorMessage: 'receiver_id is required',
        isString: true
      }
    },
    ['params']
  )
)
