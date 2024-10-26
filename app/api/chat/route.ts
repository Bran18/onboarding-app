import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getSystemPrompt } from "@/lib/ai/prompts";

export const runtime = "edge";

const model = openai("gpt-4o-mini", {
  structuredOutputs: true, // Enable structured outputs for better JSON handling
  user: "web3-learning-assistant", // Unique identifier for monitoring
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model,
    messages: [
      {
        role: "system",
        content: getSystemPrompt(),
      },
      ...messages,
    ],
    temperature: 0.7,
    maxTokens: 2000,
    experimental_toolCallStreaming: true, // Enable streaming of tool call deltas
    onChunk: async (chunk) => {
      // Optional: Add custom chunk handling logic here
      console.log("Chunk received:", chunk);
    },
  });

  return result.toDataStreamResponse({
    // Optional custom headers
    headers: {
      "x-stream-type": "chat",
    },
  });
}
