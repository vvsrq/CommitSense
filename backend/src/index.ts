import { generatePRSummary } from './ai-service.ts'; 
import * as dotenv from 'dotenv';
dotenv.config();

import express, { type Request, type Response, type NextFunction } from 'express';
import * as crypto from 'crypto';

import { getAuthenticatedOctokit } from './github-client.ts';

const app = express();
const PORT = process.env.PORT || 3000;

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

if (!GITHUB_WEBHOOK_SECRET) {
  console.error("Необходимо установить GITHUB_WEBHOOK_SECRET в .env файле");
  process.exit(1);
}

// Middleware для верификации подписи GitHub
const verifyGitHubSignature = (req: Request, res: Response, next: NextFunction) => {
  const signature = req.get('x-hub-signature-256');
  if (!signature) {
    console.warn('Signature required, but not provided.');
    return res.status(401).send('Signature required');
  }

  const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET!);
  hmac.update(req.rawBody);
  const expectedSignature = `sha256=${hmac.digest('hex')}`;

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    console.warn('Invalid signature.');
    return res.status(401).send('Invalid signature');
  }

  next();
};

app.use(express.raw({ type: 'application/json' }));

app.use((req: Request, res: Response, next: NextFunction) => {
  req.rawBody = req.body;
  try {
    req.body = JSON.parse(req.body.toString());
  } catch (e) {
    console.error('Could not parse request body as JSON', e);
  }
  next();
});

declare global {
  namespace Express {
    interface Request {
      rawBody: Buffer;
    }
  }
}

app.get('/', (req: Request, res: Response) => {
  res.send('CommitSense AI Assistant is running!');
});

app.post('/api/webhook', verifyGitHubSignature, async (req: Request, res: Response) => {
  const githubEvent = req.get('x-github-event');

  if (githubEvent === 'pull_request' && req.body.action === 'opened') {
    const pullRequest = req.body.pull_request;
    const repo = req.body.repository;
    const installationId = req.body.installation.id;

    console.log(`New PR opened: #${pullRequest.number} in ${repo.full_name}`);

    try {
      const octokit = await getAuthenticatedOctokit(installationId);

      const commitsResponse = await octokit.pulls.listCommits({
        owner: repo.owner.login,
        repo: repo.name,
        pull_number: pullRequest.number,
      });

      const commitMessages = commitsResponse.data.map(commit => commit.commit.message);
      console.log('Commit messages:', commitMessages);
      
      if (commitMessages.length === 0) {
        res.status(200).send('No commits found, skipping summary generation.');
        return;
      }
      
      console.log('Generating PR summary with Gemini...');
      const summary = await generatePRSummary(commitMessages);
      console.log('Generated summary:', summary);

      await octokit.issues.createComment({
        owner: repo.owner.login,
        repo: repo.name,
        issue_number: pullRequest.number,
        body: summary,
      });

      console.log('AI-generated summary posted successfully!');

    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  res.status(200).send('Webhook processed');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});