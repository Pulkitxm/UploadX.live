/* eslint-disable no-unused-vars */

import { MAX_FILE_SIZE } from "@/lib/config";

export enum ERROR {
  USER_NOT_FOUND = "User not found. Please try again.",
  INVALID_USER = "Invalid user, Please try again.",
  INVALID_AUTH_MODE = "Invalid authentication mode.",
  UNEXPECTED = "An unexpected error occurred. Please try again.",
  UNAUTHORIZED = "You are not authorized to access this page.",
  DEFAULT = "An error occurred. Please try again.",
  EMAIL_EXISTS = "User with this email already exists, Please try again.",
  INVALID_INPUT = "Invalid input data, Please try again.",
  DB_ERROR = "Database error occurred, Please try again.",
  INVALID_CREDENTIALS = "Invalid credentials, Please try again.",
  EMAIL_NOT_VERIFIED = "Email not verified, Please verify your email.",
  INVALID_LOGIN = "Invalid login, Please try again.",
  USER_EXISTS_BUT_WITH_GOOGLE_LOGIN = "User exists with google login, Please try again with google.",
  USER_EXISTS_BUT_WITH_EMAIL_LOGIN = "User exists with email login, Please try again with email.",
  ALL_FIELD_REQUIRED = "All fields are required, Please try again",
  PASSWORDS_DONT_MATCH = "Check you passwords, and try again",
  PASSWORD_MISMATCH = "Passwords do not match, Please try again.",
  REQUIRED = "All fields are required, Please try again.",
  UPLOAD_FAILED = "File upload failed, Please try again.",
  FILE_REQUIRED = "File is required, Please try again.",
  FILE_TOO_LARGE = `File is too large, Please try with a file less than ${
    MAX_FILE_SIZE / (1024 * 1024)
  }MB.`,
}
