export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}
export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgetPasswordToken,
  EmailVerifyToken
}

export enum MediaType {
  Image,
  Video,
  HLS
}
export enum MediaQueryType {
  Image = 'image',
  Video = 'video'
}

export enum EncodingStatus {
  Pending, // đang chờ xử lý
  Processing, // đang xử lý
  Success, // xử lý thành công
  Failed // xử lý thất bại
}
export enum TweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
}
export enum TweetAudience {
  Everyone, // 0
  TwitterCircle // 1
}
