'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal, StopCircle, Paperclip, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onStop: () => void;
}

export default function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  onStop,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="relative w-full mt-2">
      {/* Optional disclaimer */}
      <div className="absolute -top-6 left-0 right-0 text-center">
        <span className="text-xs text-muted-foreground">
          AI responses are generated. Please verify important information.
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-end w-full",
          "rounded-lg border bg-background",
          "shadow-sm transition-shadow duration-200",
          "hover:shadow-md focus-within:shadow-md",
          "p-2 gap-2"
        )}
      >
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about Web3..."
          disabled={isLoading}
          className={cn(
            "min-h-[52px] w-full resize-none",
            "bg-transparent border-0 focus-visible:ring-0",
            "placeholder:text-muted-foreground",
            "scrollbar-thin scrollbar-thumb-rounded",
            "scrollbar-track-transparent scrollbar-thumb-muted"
          )}
          rows={1}
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Button
                type="button"
                onClick={onStop}
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full"
              >
                <StopCircle className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!input.trim()}
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full",
                  "bg-primary hover:bg-primary/90",
                  "transition-all duration-200",
                  !input.trim() && "opacity-50"
                )}
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </form>
    </div>
  );
}