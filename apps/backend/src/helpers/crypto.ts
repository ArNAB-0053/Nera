import { hash, compare } from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashValue(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyHash(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}