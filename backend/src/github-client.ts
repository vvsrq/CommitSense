import { App } from '@octokit/app';
import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';

dotenv.config();

const APP_ID = process.env.GITHUB_APP_ID!;
const PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY!;

if (!APP_ID || !PRIVATE_KEY) {
  throw new Error('GitHub App ID and Private Key must be set in .env file');
}

const app = new App({
  appId: APP_ID,
  privateKey: PRIVATE_KEY,
  Octokit: Octokit,
});


export const getAuthenticatedOctokit = async (installationId: number): Promise<Octokit> => {
  return await app.getInstallationOctokit(installationId);
};