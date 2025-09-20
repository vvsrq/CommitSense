# CommitSense AI Assistant 🤖

An AI assistant for GitHub that automatically analyzes commits and Pull Requests using the Google Gemini API to generate summaries, changelogs, and perform basic code reviews.

## ✨ Features

- **Automatic Pull Request Descriptions**: Generates a clear summary based on commit messages.
- **AI-Powered Code Review (Planned)**: Provides basic feedback on code changes.
- **Changelog Generation (Planned)**: Creates changelogs for new releases automatically.

## 🛠️ Tech Stack

- **Backend**: Node.js (TypeScript) with Express.js
- **AI Model**: Google Gemini Pro
- **GitHub Integration**: GitHub Apps, Webhooks, and Octokit
- **Deployment (Planned)**: Google Cloud Run with Docker
- **CI/CD (Planned)**: GitHub Actions

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- A GitHub account
- A Google Account and a Gemini API Key

### 1. Clone the repository

git clone https://github.com/YOURNAME/commitsense.git
cd commitsense

### 2. Install all dependencies
npm install

### 3. Fill up .env
Now, open the .env file and fill in the required values:
GITHUB_WEBHOOK_SECRET: Your webhook secret created during the GitHub App setup.
GITHUB_APP_ID: Your GitHub App's ID.
GITHUB_APP_INSTALLATION_ID: The installation ID of your app on a repository.
GITHUB_APP_PRIVATE_KEY: The full private key from your app's .pem file, formatted as a single line with \n for newlines.
GEMINI_API_KEY: Your API key from Google AI Studio.

### 3. Run and check
npm run dev
npm run tunnel
