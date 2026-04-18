ALTER TABLE "users"
ADD COLUMN "recoveryKeyHash" TEXT,
ADD COLUMN "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "twoFactorSecret" TEXT;

ALTER TABLE "files"
RENAME COLUMN "encryptionIv" TO "iv";

ALTER TABLE "files"
RENAME COLUMN "encryptionTag" TO "authTag";

ALTER TABLE "files"
ADD COLUMN "salt" TEXT;
