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

export enum EncodingStatus {
  Pending, // đang chờ xử lý
  Processing, // đang xử lý
  Success, // xử lý thành công
  Failed // xử lý thất bại
}
