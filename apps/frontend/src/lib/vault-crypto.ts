"use client";

const PBKDF2_ITERATIONS = 250_000;
const AES_GCM_IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const SALT_BYTES = 16;
const RECOVERY_KEY_BYTES = 32;

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary);
}

function base64ToBytes(value: string) {
  const normalized = atob(value);
  return Uint8Array.from(normalized, (char) => char.charCodeAt(0));
}

function randomBase64(byteLength: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return bytesToBase64(bytes);
}

async function importPasswordKey(password: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
}

async function deriveFileKey(password: string, salt: string) {
  const passwordKey = await importPasswordKey(password);

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: base64ToBytes(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

export function generateRecoveryKey() {
  return randomBase64(RECOVERY_KEY_BYTES);
}

export function generateVaultSalt() {
  return randomBase64(SALT_BYTES);
}

export async function encryptFileWithVaultPassword(file: File, vaultPassword: string) {
  const salt = generateVaultSalt();
  const ivBytes = crypto.getRandomValues(new Uint8Array(AES_GCM_IV_LENGTH));
  const key = await deriveFileKey(vaultPassword, salt);
  const rawBytes = new Uint8Array(await file.arrayBuffer());
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: ivBytes,
    },
    key,
    rawBytes
  );

  const encryptedBytes = new Uint8Array(encryptedBuffer);
  const cipherBytes = encryptedBytes.slice(0, encryptedBytes.length - AUTH_TAG_LENGTH);
  const authTagBytes = encryptedBytes.slice(encryptedBytes.length - AUTH_TAG_LENGTH);

  return {
    encryptedBlob: new Blob([cipherBytes], { type: "application/octet-stream" }),
    iv: bytesToBase64(ivBytes),
    authTag: bytesToBase64(authTagBytes),
    salt,
    mimeType: file.type || "application/octet-stream",
    originalName: file.name,
  };
}

export async function decryptFileWithVaultPassword(input: {
  password: string;
  encryptedFile: string;
  iv: string;
  authTag: string;
  salt: string;
  mimeType?: string | null;
}) {
  const key = await deriveFileKey(input.password, input.salt);
  const encryptedBytes = base64ToBytes(input.encryptedFile);
  const authTagBytes = base64ToBytes(input.authTag);
  const combined = new Uint8Array(encryptedBytes.length + authTagBytes.length);

  combined.set(encryptedBytes, 0);
  combined.set(authTagBytes, encryptedBytes.length);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToBytes(input.iv),
    },
    key,
    combined
  );

  return new Blob([decrypted], {
    type: input.mimeType || "application/octet-stream",
  });
}
