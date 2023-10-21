import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { NumberEnumToArray } from '~/utils/common'
import { validate } from '~/utils/validation'

export const createTweetValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [NumberEnumToArray(TweetType)],
        errorMessage: TWEETS_MESSAGES.INVALID_TYPE
      }
    },
    audience: {
      isIn: {
        options: [NumberEnumToArray(TweetAudience)],
        errorMessage: TWEETS_MESSAGES.INVALID_AUDIENCE
      }
    },
    parent_id: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          if ([TweetType.Comment, TweetType.QuoteTweet, TweetType.Retweet].includes(type) && !ObjectId.isValid(value)) {
            throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
          }
          if (TweetType.Tweet === type && value !== null) {
            throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_NULL)
          }
          return true
        }
      }
    },
    content: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          const hashtags = req.body.hashtags as string[]
          const mentions = req.body.mentions as string[]
          if (
            [TweetType.Comment, TweetType.QuoteTweet, TweetType.Retweet].includes(type) &&
            value === '' &&
            isEmpty(hashtags) &&
            isEmpty(mentions)
          ) {
            throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_NOT_EMPTY)
          }
          if ([TweetType.Tweet].includes(type) && value === '') {
            throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_NOT_EMPTY)
          }
          return true
        }
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          //Yeu cau moi phan tu trong mang hashtags la string
          if (!value.every((item: any) => typeof item !== 'string')) {
            throw new Error(TWEETS_MESSAGES.HASHTAGS_MUST_BE_ARRAY_OF_STRING)
          }
          return true
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          //Yeu cau moi phan tu trong mang hashtags la string
          if (!value.every((item: any) => ObjectId.isValid(item))) {
            throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_ARRAY_OF_USER_ID)
          }
          return true
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          //Yeu cau moi phan tu trong mang hashtags la Media
          if (
            !value.every((item: any) => {
              return typeof item.url !== 'string' || NumberEnumToArray(MediaType).includes(item.type)
            })
          ) {
            throw new Error(TWEETS_MESSAGES.MEDIAS_MUST_BE_ARRAY_OF_MEDIA)
          }
          return true
        }
      }
    }
  })
)
