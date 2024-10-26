import ChatInterface from "@/components/sections/ai-assistant/chat-interface";

export const metadata = {
  title: "AI Assistant - Web3 Learning Platform",
  description: "Get help understanding Web3 concepts with our AI assistant",
};

export default function AIAssistantPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
          Your Web3 AI Assistant
        </h1>{" "}
        <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto my-1">
          Ask questions about Web3, blockchain, and cryptocurrency. I&apos;ll
          explain complex concepts using familiar Web2 analogies.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
