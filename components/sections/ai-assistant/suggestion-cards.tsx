import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ChevronRight, BookOpen, Code, Coins, Key } from 'lucide-react';

interface SuggestionCardsProps {
  onSelectSuggestion: (question: string) => void;
}

const suggestions = [
    {
      icon: BookOpen,
      title: 'What is blockchain',
      questions: [
        "What is a blockchain in simple terms?",
        "How is Web3 different from Web2?",
        "What are smart contracts?",
      ],
    },
    {
      icon: Code,
      title: 'Web3 Development',
      questions: [
        "How do I start Web3 development?",
        "What is Solidity?",
        "How do I connect to a blockchain?",
      ],
    },
    {
      icon: Coins,
      title: 'DeFi & NFTs',
      questions: [
        "What is decentralized finance (DeFi)?",
        "How do NFTs work?",
        "What is staking?",
      ],
    },
    {
      icon: Key,
      title: 'Is Web3 Secure?',
      questions: [
        "What are private keys?",
        "How to secure my wallet?",
        "How is Web3 Secure?",
      ],
    },
] as const;

export default function SuggestionCards({ onSelectSuggestion }: SuggestionCardsProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex space-x-4 pb-4">
        {suggestions.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.title}
              className="flex-shrink-0 w-[280px] p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{category.title}</h3>
              </div>
              <div className="space-y-2">
                {category.questions.map((question) => (
                  // biome-ignore lint/a11y/useButtonType: <explanation>
                    <button
                    key={question}
                    onClick={() => onSelectSuggestion(question)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-full text-left transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{question}</span>
                  </button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}