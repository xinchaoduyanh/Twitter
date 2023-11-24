import { ParamsDictionary } from 'express-serve-static-core'
export interface getConverStationRequest extends ParamsDictionary {
  receiver_id: string
}
