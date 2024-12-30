/* eslint-disable no-unused-vars */

export enum ERROR {
  // User Errors
  USER_NOT_FOUND = "User not found. Please check the information and try again.",
  INVALID_USER = "Invalid user information. Please verify and try again.",
  USER_ALREADY_VERIFIED = "Email is already verified. No further action required.",
  USER_EXISTS_BUT_WITH_GOOGLE_LOGIN = "Account registered with Google. Use Google sign-in.",
  USER_EXISTS_BUT_WITH_EMAIL_LOGIN = "Account registered with email. Use email sign-in.",

  // Authentication Errors
  INVALID_AUTH_MODE = "Unsupported authentication method. Please use a valid method.",
  INVALID_CREDENTIALS = "Incorrect login details. Please try again.",
  EMAIL_NOT_VERIFIED = "Email not verified. Check your inbox to complete verification.",
  INVALID_LOGIN = "Login unsuccessful. Please check your details and try again.",
  UNAUTHORIZED = "You do not have permission to access this page.",
  INVALID_SESSION = "Session invalid or expired. Please log in again.",
  SAME_PASSWORD = "New password cannot be the same as the current password.",
  INVALID_PASSWORD = "Invalid password. Please provide a valid one.",

  // Input Errors
  INVALID_INPUT = "Invalid input. Please check the data and try again.",
  REQUIRED = "All required fields must be completed.",
  ALL_FIELD_REQUIRED = "All fields are mandatory. Please fill in the missing details.",
  PASSWORDS_DONT_MATCH = "Passwords do not match. Please check and try again.",
  PASSWORD_MISMATCH = "Passwords do not match. Ensure both fields are identical.",
  NO_CHANGE = "No changes detected. Please update the fields to continue.",

  // Verification Errors
  INVALID_CODE = "Invalid verification code. Please try again.",
  VERIFY_CODE_EXPIRED = "Verification code expired. Request a new one.",
  VERIFY_CODE_ATTEMPTS_EXCEEDED = "Maximum verification attempts reached. Contact support.",
  VERIFY_CODE_RESEND_GAP = "Please wait before requesting a new verification code.",
  VERIFY_CODE_GAP = "Please wait before attempting verification again.",
  VERIFY_CODE_CHANGE_ATTEMPTS_EXCEEDED = "Too many code change attempts. Contact support.",
  VERIFY_FAILED = "Failed to verify email.",

  // Email Errors
  EMAIL_EXISTS = "An account with this email already exists. Log in instead.",
  EMAIL_SEND_ERROR = "Failed to send email. Try again or contact support.",
  UPDATE_FAILED = "Failed to update profile.",

  // File Upload Errors
  UPLOAD_FAILED = "File upload failed. Please try again.",
  NO_FILE_SELECTED = "No file selected. Please choose a file.",
  FILE_REQUIRED = "File upload is required. Please select a file.",
  PROFILE_PIC_TOO_LARGE = "Profile picture is too large. Please upload a smaller image.",
  STORAGE_QUOTA_EXCEEDED = "Storage quota exceeded. Free up space or contact support.",
  STORAGE_ERROR = "Storage error. Try again later.",

  // Database Errors
  DB_ERROR = "Database error occurred. Try again later or contact support.",

  // General Errors
  UNEXPECTED = "Unexpected error occurred. Please reload or try again later.",
  UNKNOWN = "Unknown error occurred. Contact support if the issue persists.",
  SERVER_ERROR = "Server error occurred. Please try again later.",
  DEFAULT = "An error occurred. Please try again or contact support."
}
