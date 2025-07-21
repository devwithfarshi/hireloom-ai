import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatbotState, ChatMessage, ChatThread } from './types';

const initialState: ChatbotState = {
  isOpen: false,
  currentThreadId: null,
  threads: [],
  isLoading: false,
  error: null,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChatbot: (state) => {
      state.isOpen = true;
    },
    closeChatbot: (state) => {
      state.isOpen = false;
    },
    createThread: (state, action: PayloadAction<{ title: string }>) => {
      const newThread: ChatThread = {
        id: `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: action.payload.title,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      state.threads.unshift(newThread);
      state.currentThreadId = newThread.id;
    },
    setCurrentThread: (state, action: PayloadAction<string>) => {
      state.currentThreadId = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const thread = state.threads.find(t => t.id === action.payload.threadId);
      if (thread) {
        thread.messages.push(action.payload);
        thread.updatedAt = new Date();
        // Move thread to top
        const threadIndex = state.threads.findIndex(t => t.id === action.payload.threadId);
        if (threadIndex > 0) {
          const [movedThread] = state.threads.splice(threadIndex, 1);
          state.threads.unshift(movedThread);
        }
      }
    },
    updateThreadTitle: (state, action: PayloadAction<{ threadId: string; title: string }>) => {
      const thread = state.threads.find(t => t.id === action.payload.threadId);
      if (thread) {
        thread.title = action.payload.title;
        thread.updatedAt = new Date();
      }
    },
    deleteThread: (state, action: PayloadAction<string>) => {
      state.threads = state.threads.filter(t => t.id !== action.payload);
      if (state.currentThreadId === action.payload) {
        state.currentThreadId = state.threads.length > 0 ? state.threads[0].id : null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  toggleChatbot,
  openChatbot,
  closeChatbot,
  createThread,
  setCurrentThread,
  addMessage,
  updateThreadTitle,
  deleteThread,
  setLoading,
  setError,
  clearError,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;