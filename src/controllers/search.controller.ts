import { Request, Response } from 'express'
import { SearchQuery } from '~/models/requests/Search.request'
import { searchService } from '~/services/search.services'
import { ParamsDictionary } from 'express-serve-static-core'
export const SearchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const { content } = req.query
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const result = await searchService.search({ limit, page, content: req.query.content })
  console.log(result)

  return res.json({
    result
  })
}
