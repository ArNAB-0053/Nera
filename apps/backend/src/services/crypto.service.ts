import { env } from "@/config/env.js";
import crypto from "crypto";

const ALGO = "aes-256-gcm";

const key = crypto.createHash('sha256').update(env.ENCRYPTION_SECRET).digest();

export function encryptFile(buffer: Buffer) {
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(ALGO, key, iv)

    const encrypted = Buffer.concat([
        cipher.update(buffer),
        cipher.final()
    ])

    const tag = cipher.getAuthTag()

    return {encrypted, iv, tag}
}

export function decryptFile(encrypted: Buffer, iv: Buffer, tag: Buffer) {
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag)

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ])

    return decrypted
}