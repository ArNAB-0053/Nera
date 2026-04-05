export const MESSAGES = {
  success: {
    USER_REGISTERED: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    PROFILE_FETCHED: "Profile fetched successfully",
    FILE_UPLOADED: "File uploaded successfully",
    FOLDER_CREATED: "Folder created successfully",
    FOLDER_VIEW_FETCHED: "Folder view fetched successfully",
    FILE_LIST_FETCHED: "Files fetched successfully"
  },

  error: {
    EMAIL_EXISTS: "Email already exists",
    EMAIL_NOT_EXISTS: "Email doesn't exists",
    USERNAME_EXISTS: "Username already exists",
    INVALID_CREDENTIALS: "Invalid credentials",
    PASSWORD_NOT_MATCH: "Password didn't match",
    USER_NOT_FOUND: "User not found",
    PROFILE_FETCH_FAILED: "Unable to fetch your profile",
    FOLDER_NOT_FOUND: "Folder not found",
    FOLDER_EXISTS: "Folder already exists in this location",
    FILE_NOT_FOUND: "File not found",

    // File
    FILE_NEEDED: 'File is required',
    FILE_LARGE: 'File too large',
    INVALID_FILE_TYPE: 'Invalid file type'
  },

} as const;
