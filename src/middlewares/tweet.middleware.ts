import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import Tweet from '~/models/schemas/Tweet.schemas'
import databaseService from '~/services/database.services'
import { NumberEnumToArray } from '~/utils/common'
import { wrapRequestHandler } from '~/utils/handlers'
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
          if (!value.every((item: any) => typeof item === 'string')) {
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
export const tweetIdValidator = validate(
  checkSchema({
    tweet_id: {
      isMongoId: {
        errorMessage: TWEETS_MESSAGES.TWEET_ID_MUST_BE_A_VALID_TWEET_ID
      },
      custom: {
        options: async (value, { req }) => {
          const [tweet] = await databaseService.tweets
            .aggregate<Tweet>([
              {
                $match: {
                  _id: new ObjectId(value)
                }
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'mentions',
                  foreignField: '_id',
                  as: 'mentions'
                }
              },
              {
                $addFields: {
                  mentions: {
                    $map: {
                      input: '$mentions',
                      as: 'mention',
                      in: {
                        _id: '$$mention._id',
                        name: '$$mention.name',
                        username: '$$mention.username',
                        email: '$$mention.email'
                      }
                    }
                  }
                }
              },
              {
                $lookup: {
                  from: 'bookmarks',
                  localField: '_id',
                  foreignField: 'tweet_id',
                  as: 'bookmarks'
                }
              },
              {
                $lookup: {
                  from: 'likes',
                  localField: '_id',
                  foreignField: 'tweet_id',
                  as: 'likes'
                }
              },
              {
                $lookup: {
                  from: 'tweets',
                  localField: '_id',
                  foreignField: 'parent_id',
                  as: 'tweets_children'
                }
              },
              {
                $addFields: {
                  bookmarks_count: {
                    $size: '$bookmarks'
                  },
                  likes_count: {
                    $size: '$likes'
                  },
                  retweet_count: {
                    $size: {
                      $filter: {
                        input: '$tweets_children',
                        as: 'item',
                        cond: {
                          $eq: ['$$item.type', TweetType.Retweet]
                        }
                      }
                    }
                  },
                  comment_count: {
                    $size: {
                      $filter: {
                        input: '$tweets_children',
                        as: 'item',
                        cond: {
                          $eq: ['$$item.type', TweetType.Comment]
                        }
                      }
                    }
                  },
                  quote_count: {
                    $size: {
                      $filter: {
                        input: '$tweets_children',
                        as: 'item',
                        cond: {
                          $eq: ['$$item.type', TweetType.QuoteTweet]
                        }
                      }
                    }
                  }
                }
              },
              {
                $project: {
                  tweets_children: 0
                }
              }
            ])
            .toArray()
          if (!tweet) {
            throw new Error(TWEETS_MESSAGES.TWEET_NOT_FOUND)
          }
          ;(req as Request).tweet = tweet
          // console.log(tweet)

          return true
        }
      }
    }
  })
)
export const audienceValidator = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet
  // Kiểm tra tweet có public hay không
  if (tweet.audience === TweetAudience.TwitterCircle) {
    //Kiem tra xem nguoi dung da dang nhap chua
    if (!req.decoded_authorization) {
      throw new ErrorWithStatus({
        message: TWEETS_MESSAGES.USER_NOT_LOGGED_IN_TO_VIEW_THIS_TWEET,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    //Kiem tra xem nguoi dang tweet co bi ban khong
    const author = await databaseService.users.findOne({ _id: new ObjectId(tweet.user_id) })
    if (!author || author.verify === UserVerifyStatus.Banned) {
      return new ErrorWithStatus({
        message: TWEETS_MESSAGES.AUTHOR_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    // Kiem tra xem nguoi dung co trong TwitterCircle cua nguoi dang tweet hay khong hoac co phai la nguoi dang tweet khong

    if (
      !author.twitter_circle.some((item) =>
        item.equals(new ObjectId((req.decoded_authorization as TokenPayload).user_id))
      ) &&
      author._id.toString() !== req.decoded_authorization.user_id
    ) {
      throw new ErrorWithStatus({
        message: TWEETS_MESSAGES.USER_NOT_IN_TWITTER_CIRCLE_OF_AUTHOR,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
  }
  next()
})
export const getTweetChildrenValidator = validate(
  checkSchema({
    tweet_type: {
      isIn: {
        options: [TweetType],
        errorMessage: TWEETS_MESSAGES.INVALID_TYPE
      }
    },
    limit: {
      isNumeric: true,
      custom: {
        options: (value, { req }) => {
          const num = Number(value)
          if (num < 1 || num > 100) {
            throw new Error(TWEETS_MESSAGES.LIMIT_MUST_BE_A_NUMBER_BETWEEN_1_AND_100)
          }
          return true
        }
      }
    },
    page: {
      isNumeric: true,
      custom: {
        options: (value, { req }) => {
          const num = Number(value)
          if (num < 1) {
            throw new Error(TWEETS_MESSAGES.PAGE_MUST_BE_A_NUMBER_GREATER_THAN_0)
          }
          return true
        }
      }
    }
  })
)
