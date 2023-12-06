import { config } from 'dotenv'
import argv from 'minimist'
const options = argv(process.argv.slice(2))
const isProduction = options.production ? true : false
console.log(options.env);

config({
  path: options.env !== 'development' ? `.env.${options.env}` : '.env'
})

export const envConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  host: process.env.HOST,
  clientUrl: process.env.CLIENT_URL,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbUsersCollection: process.env.DB_USERS_COLLECTION as string,
  dbRefreshTokensCollection: process.env.DB_REFRESH_TOKENS_COLLECTION as string,
  dbFollowersCollection: process.env.DB_FOLLOWERS_COLLECTION as string,
  dbTweetsCollection: process.env.DB_TWEETS_COLLECTION as string,
  dbHashtagsCollection: process.env.DB_HASHTAGS_COLLECTION as string,
  dbBookmarksCollection: process.env.DB_BOOKMARKS_COLLECTION as string,
  dbVideoStatusCollection: process.env.DB_VIDEO_STATUS_COLLECTION as string,
  dbLikesCollection: process.env.DB_LIKES_COLLECTION as string,
  dbConversationCollection: process.env.DB_CONVERSATION_COLLECTION as string,
  passwordSecret: process.env.PASSWORD_SECRET,
  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN,
  jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN,
  jwtSecretForgotPasswordToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN,
  forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
  clientRedirectCallback: process.env.CLIENT_REDIRECT_CALLBACK,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  sesFromAddress: process.env.SES_FROM_ADDRESS,
  awsBucketName: process.env.AWS_BUCKET_NAME
}
