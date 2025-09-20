import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY must be set in .env file');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });


export const generatePRSummary = async (commitMessages: string[]): Promise<string> => {
    const commitsText = commitMessages.map(msg => `- ${msg}`).join('\n');

    const prompt = `
    You are CommitSense, an AI assistant for GitHub developers.
    Your task is to analyze the list of commit messages from a Pull Request and write a short, understandable summary in English.
    The summary must be in Markdown format.

    Here is the list of commits:
    ${commitsText}

    Generate a summary for this Pull Request. Start with the heading "## Summary".
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error('Error generating content with Gemini:', error);
        return 'Sorry, I was unable to generate a summary for this Pull Request.';
    }
};