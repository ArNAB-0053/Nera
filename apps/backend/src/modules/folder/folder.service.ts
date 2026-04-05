import type { CreateFolderData } from "@nera/db";
import { Prisma } from "@nera/db";
import { BadRequestError, MESSAGES, NotFoundError } from "@nera/http";
import { folderRepository } from "./folder.repository.js";
import type { CreateFolderBody, FolderBreadcrumb } from "./folder.schema.js";

export const folderService = {
    serializeFolder(folder: Awaited<ReturnType<typeof folderRepository.findByIdForUser>>) {
        if (!folder) {
            return null;
        }

        return {
            ...folder,
            size: Number(folder.size),
        };
    },

    async getFolderView(userId: string, folderId?: string | null) {
        const currentFolder = folderId
            ? await folderRepository.findByIdForUser(folderId, userId)
            : null;

        if (folderId && !currentFolder) {
            throw new NotFoundError(MESSAGES.error.FOLDER_NOT_FOUND);
        }

        const breadcrumbs = await this.buildBreadcrumbs(userId, currentFolder);
        const folders = await folderRepository.findChildrenByParent(userId, folderId ?? null);

        return {
            currentFolder: this.serializeFolder(currentFolder),
            breadcrumbs,
            folders: folders.map((folder) => this.serializeFolder(folder)),
        };
    },

    async buildBreadcrumbs(
        userId: string,
        currentFolder: Awaited<ReturnType<typeof folderRepository.findByIdForUser>>
    ) {
        const breadcrumbs: FolderBreadcrumb[] = [{ id: null, name: "My Files" }];

        if (!currentFolder) {
            return breadcrumbs;
        }

        const lineage: FolderBreadcrumb[] = [];
        let pointer: Awaited<ReturnType<typeof folderRepository.findByIdForUser>> = currentFolder;

        while (pointer) {
            lineage.unshift({
                id: pointer.id,
                name: pointer.name,
            });

            if (!pointer.parentId) {
                break;
            }

            pointer = await folderRepository.findByIdForUser(pointer.parentId, userId);
        }

        return breadcrumbs.concat(lineage);
    },

    async createFolder(userId: string, input: CreateFolderBody) {
        if (input.parentId) {
            const parent = await folderRepository.findByIdForUser(input.parentId, userId);

            if (!parent) {
                throw new NotFoundError(MESSAGES.error.FOLDER_NOT_FOUND);
            }
        }

        const payload: CreateFolderData = {
            user: {
                connect: { id: userId },
            },
            name: input.name,
            ...(input.parentId
                ? {
                    parent: {
                        connect: { id: input.parentId },
                    },
                }
                : {}),
        };

        try {
            const folder = await folderRepository.createFolder(payload);
            return this.serializeFolder(folder);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw new BadRequestError(MESSAGES.error.FOLDER_EXISTS);
            }

            throw error;
        }
    },
};
