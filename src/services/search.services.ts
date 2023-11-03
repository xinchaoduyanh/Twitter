import { SearchQuery } from '~/models/requests/Search.request'
import databaseService from './database.services'

class SearchService {
  async search(query: { page: number; limit: number; content: string }) {
    const result = await databaseService.tweets
      .find({ $text: { $search: query.content } })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .toArray()

    return result
  }
}

export const searchService = new SearchService()
