export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  threadId: string;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StarterPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'job' | 'application' | 'general';
}

export interface ChatbotState {
  isOpen: boolean;
  currentThreadId: string | null;
  threads: ChatThread[];
  isLoading: boolean;
  error: string | null;
}