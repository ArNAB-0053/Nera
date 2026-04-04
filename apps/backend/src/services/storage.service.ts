import { env } from '@/config/env.js'
import { Client } from 'minio'

const BUCKET = 'nera'

export const minioClient = new Client({
    endPoint: env.MINIO_ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY
})

// ensure bucket exists else create one
export async function ensureBucket() {
    const exists = await minioClient.bucketExists(BUCKET)
    if (!exists) await minioClient.makeBucket(BUCKET, 'us-east-1')
}

// upload file
/**
 * @param path - storage path
 * @param buffer
 * @param mimeType - file type
 */
export async function uploadObject(path: string, buffer: Buffer, mimeType?: string) {
    // putObject(bucket, object, stream, size?, metaData?)
    await minioClient.putObject(BUCKET, path, buffer, buffer.length, {
        "Content-Type": mimeType || "application/octet-stream",
    });
}

// download file
/**
 * 
 * @param path - storahe path -> userId/folderId/uuid
 * @returns 
 */
export async function getObject(path: string) {
    return await minioClient.getObject(BUCKET, path)
}

// delete file
/**
 * 
 * @param path - storahe path -> userId/folderId/uuid
 * @returns 
 */
export async function deleteObject(path: string) {
    return await minioClient.removeObject(BUCKET, path)
}