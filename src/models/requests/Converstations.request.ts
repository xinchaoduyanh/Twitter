import { ParamsDictionary } from 'express-serve-static-core'
export interface getconversationRequest extends ParamsDictionary {
  receiver_id: string
}
