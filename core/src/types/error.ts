/* eslint-disable no-unused-vars */

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const PROFILE_MAX_FILE_SIZE = 5 * 1024 * 1024;

export enum ERROR {
  USER_NOT_FOUND = "The specified user could not be found in the system. Please ensure you have entered the correct information and try again",
  INVALID_USER = "The user information provided is invalid. Please verify the details and try again",
  INVALID_AUTH_MODE = "The selected authentication method is not supported. Please use a valid authentication method and try again",
  UNEXPECTED = "An unexpected error occurred. Please reload the page or try again later",
  UNAUTHORIZED = "You do not have the necessary permissions to access this page. Please contact support if you believe this is an error",
  DEFAULT = "An error occurred while processing your request. Please try again or contact support for assistance",
  EMAIL_EXISTS = "An account with this email address already exists. Please use a different email or log in with the existing account",
  INVALID_INPUT = "The input provided contains errors. Please check your data and try again",
  NO_CHANGES = "No changes were made to the user profile. Please update the profile details and try again",
  DB_ERROR = "A database error occurred while processing your request. Please try again later or contact support",
  INVALID_CREDENTIALS = "The credentials you provided are incorrect. Please verify your login details and try again",
  EMAIL_NOT_VERIFIED = "Your email address has not been verified. Please check your inbox for a verification email and complete the process",
  INVALID_LOGIN = "The login attempt was unsuccessful. Please check your details and try again",
  USER_EXISTS_BUT_WITH_GOOGLE_LOGIN = "This account is registered with Google. Please log in using the Google sign-in option",
  USER_EXISTS_BUT_WITH_EMAIL_LOGIN = "This account is registered with an email address. Please log in using the email login option",
  ALL_FIELD_REQUIRED = "All fields are mandatory. Please fill in the missing details and try again",
  PASSWORDS_DONT_MATCH = "The passwords entered do not match. Please check and try again",
  PASSWORD_MISMATCH = "The passwords provided do not match. Please enter the same password in both fields and try again",
  REQUIRED = "All required fields must be completed. Please fill in the missing information and try again",
  UPLOAD_FAILED = "The file upload was unsuccessful. Please try again or use a different file",
  FILE_REQUIRED = "A file must be uploaded to proceed. Please select a file and try again",
  FILE_TOO_LARGE = `The file size exceeds the allowed limit of ${
    MAX_FILE_SIZE / (1024 * 1024)
  }MB. Please upload a smaller file and try again.`,
  PROFILE_PIC_TOO_LARGE = `The profile picture size exceeds the allowed limit of ${
    PROFILE_MAX_FILE_SIZE / (1024 * 1024)
  }MB. Please upload a smaller image and try again.`,
  SERVER_ERROR = "A server-side error occurred while processing your request. Please try again later",
  EMAIL_SEND_ERROR = "An error occurred while sending the email. Please try again later or contact support",
  USER_ALREADY_VERIFIED = "The user's email has already been verified. No further action is required",
  INVALID_CODE = "The verification code provided is invalid. Please enter the correct code and try again",
  VERIFY_CODE_ATTEMPTS_EXCEEDED = "You have exceeded the maximum number of allowed verification attempts. Please contact support for assistance",
  VERIFY_CODE_CHANGE_ATTEMPTS_EXCEEDED = "You have exceeded the maximum number of allowed verification code change attempts. Please contact support for assistance",
  VERIFY_CODE_EXPIRED = "The verification code has expired. Please request a new code and try again",
  VERIFY_CODE_RESEND_GAP = "You must wait before requesting a new verification code. Please try again later",
  VERIFY_CODE_GAP = "You must wait before attempting verification again. Please try again in a few minutes",
  INVALID_SESSION = "The session is invalid or has expired. Please log in again to continue",
  UNKNOWN = "An unknown error occurred. Please try again later or contact support for assistance",
  INVALID_PASSWORD = "The password provided is invalid. Please enter a valid password and try again",
  SAME_PASSWORD = "The new password cannot be the same as the current password. Please enter a different password and try again"
}
