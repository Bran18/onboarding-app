import { createOpenAI } from '@ai-sdk/openai';

export const openaiConfig = createOpenAI({
  compatibility: 'strict',
  // Optional: Custom base URL for API calls
  // baseURL: process.env.OPENAI_API_BASE_URL,
  headers: {
    'x-custom-header': 'web3-learning-platform',
  },
});