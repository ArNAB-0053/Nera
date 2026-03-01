import { createTestRepo, getTestRepos } from "./test.repository.js";

export const getTestsService = async () => getTestRepos()
export const createTestService = async (name: string) => createTestRepo(name)