"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search, Book, Clock, Star } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useSupabase } from '@/context/use-supabase';
import { useDebounce } from '@/hooks/use-debounce';
import type { SearchResult } from '@/types/types';
import { searchLessons } from '@/lib/lessons/lessons';

export function LessonSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const { user } = useSupabase();

  useEffect(() => {
    async function performSearch() {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchLessons(debouncedQuery, user?.id);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery, user?.id]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search lessons..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 space-y-4">
          {results.map((result) => (
            <Card
              key={result.id}
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => router.push(`/journey/chapters/${result.chapterId}/${result.slug}`)}
            >
              <div className="flex items-start">
                <Book className="w-5 h-5 mt-1 mr-3 text-blue-500" />
                <div className="flex-1">
                  <h3 className="font-medium">{result.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{result.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {result.estimatedTime} min
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {result.xpReward} XP
                    </span>
                    <span className="text-blue-500">{result.chapterTitle}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}