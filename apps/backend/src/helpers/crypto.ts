import argon2 from "argon2";

export async function hashValue(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
}

export async function verifyHash(password: string, passwordHash: string): Promise<boolean> {
  return argon2.verify(passwordHash, password);
}
