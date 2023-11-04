import { SearchQuery } from '~/models/requests/Search.request'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Tweet from '~/models/schemas/Tweet.schemas'
import { MediaQueryType, MediaType, TweetType } from '~/constants/enums'

class SearchService {
  async search({
    page,
    limit,
    content,
    user_id,
    media_type
  }: {
    page: number
    limit: number
    content: string
    user_id: string
    media_type: MediaQueryType
  }) {
    const $match: any = {
      $text: {
        $search: content
      }
    }
    if (media_type) {
      if (media_type === MediaQueryType.Image) {
        $match['type'] = MediaType.Image
      } else if (media_type === MediaQueryType.Video) {
        $match['type'] = {
          $in: [MediaType.Video, MediaType.HLS]
        }
      }
    }
    console.log('1', $match)

    const [tweets, total] = await Promise.all([
      databaseService.tweets
        .aggregate([
          {
            $match
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $unwind: {
              path: '$author'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: 0
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'author.twitter_circle': {
                        $in: [new ObjectId(user_id)]
                      }
                    }
                  ]
                }
              ]
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
              tweets_children: 0,
              author: {
                password: 0,
                email_verify_token: 0,
                date_of_birth: 0,
                created_at: 0,
                updated_at: 0,
                forgot_password_token: 0,
                verify: 0
              }
            }
          },
          {
            $skip: (page - 1) * limit
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.tweets
        .aggregate([
          {
            $match
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $unwind: {
              path: '$author'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: 0
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'author.twitter_circle': {
                        $in: [new ObjectId(user_id)]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])
    //Update view cho tweet sau khi dc search
    const ids = tweets.map((tweet) => tweet._id)
    const date = new Date()
    await databaseService.tweets.updateMany(
      {
        _id: {
          $in: ids
        }
      },
      {
        $set: {
          updated_at: date
        },
        $inc: {
          user_views: 1
        }
      }
    )
    //Cap nhat data tra ve cho khach hang
    tweets.forEach((tweet) => {
      tweet.updated_at = date
      tweet.user_views += 1
    })
    return {
      tweets,
      total
    }
  }
}

export const searchService = new SearchService()
