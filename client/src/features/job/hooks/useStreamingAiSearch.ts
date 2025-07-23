import { useState, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Job } from '../jobApi';

export interface StreamingSearchState {
  isSearching: boolean;
  progress: number;
  status: string;
  jobs: Job[];
  error: string | null;
}

export interface StreamingSearchResult {
  state: StreamingSearchState;
  startSearch: (query: string, userId: string) => void;
  stopSearch: () => void;
  resetSearch: () => void;
}

const initialState: StreamingSearchState = {
  isSearching: false,
  progress: 0,
  status: '',
  jobs: [],
  error: null,
};

export function useStreamingAiSearch(): StreamingSearchResult {
  const [state, setState] = useState<StreamingSearchState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const stopSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState(prev => ({ ...prev, isSearching: false }));
  }, []);

  const resetSearch = useCallback(() => {
    stopSearch();
    setState(initialState);
  }, [stopSearch]);

  const startSearch = useCallback((query: string, userId: string) => {
    if (!query.trim() || !userId) {
      setState(prev => ({ 
        ...prev, 
        error: 'Query and user ID are required' 
      }));
      return;
    }

    // Reset state and start searching
    setState({
      ...initialState,
      isSearching: true,
      status: 'Connecting to AI search...',
    });

    const baseUrl = import.meta.env.VITE_API_URL;
    const url = new URL(`${baseUrl}/jobs/ai-search-stream`);
    url.searchParams.append('userId', userId);
    url.searchParams.append('query', query);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const headers: Record<string, string> = {
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(url.toString(), {
      method: 'GET',
      headers,
      signal: abortController.signal,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setState(prev => ({ 
          ...prev, 
          status: 'Connected to AI search service',
          progress: 5 
        }));

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const processStream = async () => {
          try {
            while (true) {
              const { done, value } = await reader!.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const eventData = line.slice(6);
                  if (eventData.trim() === '') continue;

                  try {
                    const data = JSON.parse(eventData);

                    setState(prev => {
                      switch (data.type) {
                        case 'status':
                          return {
                            ...prev,
                            status: data.message,
                            progress: data.progress || prev.progress,
                          };

                        case 'analysis':
                          return {
                            ...prev,
                            progress: data.progress || prev.progress,
                          };

                        case 'batch_results':
                          const newJobs = data.data || [];
                          const existingJobIds = new Set(prev.jobs.map(job => job.id));
                          const uniqueNewJobs = newJobs.filter((job: Job) => !existingJobIds.has(job.id));
                          
                          return {
                            ...prev,
                            jobs: [...prev.jobs, ...uniqueNewJobs],
                            progress: data.progress || prev.progress,
                            status: `Found ${uniqueNewJobs.length} new relevant jobs`,
                          };

                        case 'final_results':
                          return {
                            ...prev,
                            jobs: data.data.jobs || [],
                            progress: 100,
                            status: 'Search completed successfully!',
                            isSearching: false,
                          };

                        case 'error':
                          return {
                            ...prev,
                            error: data.message || 'An error occurred during search',
                            isSearching: false,
                            status: 'Search failed',
                          };

                        default:
                          return prev;
                      }
                    });
                  } catch (parseError) {
                    console.error('Failed to parse SSE message:', parseError);
                  }
                }
              }
            }
          } catch (streamError) {
            if ((streamError as Error).name !== 'AbortError') {
              console.error('Stream processing error:', streamError);
              setState(prev => ({
                ...prev,
                error: 'Stream processing failed',
                isSearching: false,
                status: 'Connection failed',
              }));
            }
          }
        };

        processStream();
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
          setState(prev => ({
            ...prev,
            error: 'Connection to search service failed',
            isSearching: false,
            status: 'Connection failed',
          }));
        }
      });

  }, [token]);

  return {
    state,
    startSearch,
    stopSearch,
    resetSearch,
  };
}