import { Request, Response } from 'express'
import { SearchQuery } from '~/models/requests/Search.request'
import { searchService } from '~/services/search.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.requests'
export const SearchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const { content } = req.query
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const user_id = req.decoded_authorization?.user_id as string
  const result = await searchService.search({ limit, page, content: req.query.content, user_id })
  console.log(result)

  return res.json({
    result
  })
}
