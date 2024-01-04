import { checkSchema } from 'express-validator'
import { type } from 'os'
import { MediaQueryType, MediaType } from '~/constants/enums'
import { SEARCH_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const searchValidator = validate(
  checkSchema({
    content: {
      isString: {
        errorMessage: SEARCH_MESSAGES.CONTENT_MUST_BE_A_STRING
      }
    },
    media_type: {
      optional: true,
      isIn: {
        options: [Object.values(MediaQueryType)],
        errorMessage: `media_type must be one of the following values: ${Object.values(MediaQueryType).join(', ')}`
      }
    },
    followed_user: {
      optional: true,
      isIn: {
        options: [['0', '1']],
        errorMessage: 'followed_user must be one of the following values: 0, 1'
      }
    }
  })
)
