export interface CreateUserData {
  email: string;
  passwordHash: string;
  username?: string | undefined;
};