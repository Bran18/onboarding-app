import { z } from "zod";

//* Update role enum to include all possible values from AI SDK
export const MessageRole = z.enum([
  "assistant",
  "system",
  "user",
  "function",
  "data",
  "tool",
]);

export type MessageRole = z.infer<typeof MessageRole>;

export const MessageSchema = z.object({
  id: z.string(),
  role: MessageRole,
  content: z.string(),
  timestamp: z.date().optional(),
  metadata: z
    .object({
      tokenCount: z.number().optional(),
      processingTime: z.number().optional(),
      experimental_providerMetadata: z.record(z.unknown()).optional(),
    })
    .optional(),
  //* Add optional fields that might come from AI SDK
  createdAt: z.date().optional(),
  tool_call_id: z.string().optional(),
  experimental_attachments: z.array(z.any()).optional(),
  ui: z.any().optional(),
  toolInvocations: z.array(z.any()).optional(),
});


//* Type for messages that will be displayed in the UI
export interface DisplayMessage {
  id: string;
  role: "assistant" | "system" | "user";
  content: string;
  timestamp?: Date;
  metadata?: {
    tokenCount?: number;
    processingTime?: number;
    experimental_providerMetadata?: Record<string, unknown>;
  };
}
