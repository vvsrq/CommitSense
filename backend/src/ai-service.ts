import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY must be set in .env file');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

/**
 * Генерирует описание для Pull Request на основе сообщений коммитов.
 * @param commitMessages - Массив строк с сообщениями коммитов.
 * @returns Строка с сгенерированным описанием в формате Markdown.
 */
export const generatePRSummary = async (commitMessages: string[]): Promise<string> => {
  const commitsText = commitMessages.map(msg => `- ${msg}`).join('\n');

  const prompt = `
    Ты — AI-ассистент для разработчиков GitHub по имени CommitSense.
    Твоя задача — проанализировать список сообщений коммитов из Pull Request и написать краткое, понятное summary (резюме) на английском языке.
    Резюме должно быть в формате Markdown.

    Вот список коммитов:
    ${commitsText}

    Сгенерируй summary для этого Pull Request. Начни с заголовка "## Summary".
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