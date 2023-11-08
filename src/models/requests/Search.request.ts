import { MediaQueryType } from '~/constants/enums'
import { Pagination } from './Tweet.requests'

export interface SearchQuery extends Pagination {
  content: string
  media_type: MediaQueryType
  followed_user: string
}
