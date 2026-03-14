export const MESSAGES = {
  success: {
    USER_REGISTERED: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    PROFILE_FETCHED: "Profile fetched successfully",
    FILE_UPLOADED: "File uploaded successfully",
    FOLDER_CREATED: "Folder created successfully"
  },

  error: {
    EMAIL_EXISTS: "Email already exists",
    EMAIL_NOT_EXISTS: "Email doesn't exists",
    USERNAME_EXISTS: "Username already exists",
    INVALID_CREDENTIALS: "Invalid credentials",
    PASSWORD_NOT_MATCH: "Password didn't match",
    USER_NOT_FOUND: "User not found",
    PROFILE_FETCH_FAILED: "Unable to fetch your profile"
  }

} as const;