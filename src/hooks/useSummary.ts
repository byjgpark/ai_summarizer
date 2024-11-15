import { useState } from 'react';
import { createSummary } from '@/services/api';

interface UseSummaryReturn {
  summary: string | null;
  error: string | null;
  loading: boolean;
  text: string;
  setSummary: (summary: string) => void;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setText: (text: string) => void;
  generateSummary: (text: string, type?: 'text' | 'url' | 'youtube', language?: string) => Promise<void>;
}

export const useSummary = (): UseSummaryReturn => {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('')

  const generateSummary = async (text: string, type: 'text' | 'url' | 'youtube' = 'text', language = 'en') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createSummary({ text, type, language });
      
      setSummary(response.summarization);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return { summary, error, loading, text, setSummary, setError, setLoading, setText, generateSummary };
};
