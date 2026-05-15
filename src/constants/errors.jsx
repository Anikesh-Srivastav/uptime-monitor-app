// Backend auth error codes — matched against API error responses
export const AUTH_ERRORS = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  REFRESH_EXPIRED: 'REFRESH_EXPIRED',
  REFRESH_INVALID: 'REFRESH_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_REVOKED: 'SESSION_REVOKED',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
  OTP_INVALID: 'OTP_INVALID',
  OTP_EXPIRED: 'OTP_EXPIRED',
  OTP_REQUIRED: 'OTP_REQUIRED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
};

// HTTP status codes that trigger token refresh
export const REFRESH_ON_STATUS = [401];

// Codes that mean we should hard-logout (refresh is pointless)
export const FORCE_LOGOUT_CODES = [
  AUTH_ERRORS.REFRESH_EXPIRED,
  AUTH_ERRORS.REFRESH_INVALID,
  AUTH_ERRORS.SESSION_REVOKED,
  AUTH_ERRORS.ACCOUNT_DISABLED,
];

// Generic user-facing messages keyed by error code
export const ERROR_MESSAGES = {
  [AUTH_ERRORS.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [AUTH_ERRORS.REFRESH_EXPIRED]: 'Your session has ended. Please log in again.',
  [AUTH_ERRORS.SESSION_REVOKED]: 'This session was revoked. Please log in again.',
  [AUTH_ERRORS.ACCOUNT_DISABLED]: 'Your account has been disabled. Contact support.',
  [AUTH_ERRORS.OTP_INVALID]: 'The code you entered is incorrect. Please try again.',
  [AUTH_ERRORS.OTP_EXPIRED]: 'Your verification code has expired. Request a new one.',
  NETWORK_ERROR: 'No internet connection. Please check your network.',
  TIMEOUT: 'The request took too long. Please try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again shortly.',
  UNKNOWN: 'An unexpected error occurred. Please try again.',
};
