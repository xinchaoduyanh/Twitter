export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_1_TO_100: 'Name length must be between 1 and 100 characters',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email is already in use',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be between 6 and 50 characters',
  PASSWORD_MUST_BE_STRONG:
    'Your password must include at least one symbol, one uppercase letter, one lowercase letter, and one number',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must match the password',
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_MUST_BE_ISO: 'Date of birth must be in ISO date format (YYYY-MM-DD)',
  // Thêm các thông báo về thành công và lỗi mới ở đây
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Success to register',
  REGISTER_FAILED: 'Register failed',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required'
} as const
