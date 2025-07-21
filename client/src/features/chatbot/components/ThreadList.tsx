import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { motion } from 'framer-motion';
import { MessageSquare, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteThread, setCurrentThread } from '../chatbotSlice';

export function ThreadList() {
  const dispatch = useAppDispatch();
  const { threads, currentThreadId } = useAppSelector(state => state.chatbot);
  const [hoveredThread, setHoveredThread] = useState<string | null>(null);

  const handleThreadSelect = (threadId: string) => {
    dispatch(setCurrentThread(threadId));
  };

  const handleDeleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteThread(threadId));
  };

  const formatThreadTitle = (title: string, messages: any[]) => {
    if (messages.length === 0) return title;
    
    // Use first user message as title if available
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      const truncated = firstUserMessage.content.slice(0, 30);
      return truncated.length < firstUserMessage.content.length ? `${truncated}...` : truncated;
    }
    
    return title;
  };

  const formatLastActivity = (updatedAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(updatedAt).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(updatedAt).toLocaleDateString();
  };

  if (threads.length === 0) {
    return null;
  }

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="p-2 space-y-1">
          {threads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                currentThreadId === thread.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
              }`}
              onClick={() => handleThreadSelect(thread.id)}
              onMouseEnter={() => setHoveredThread(thread.id)}
              onMouseLeave={() => setHoveredThread(null)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageSquare className={`h-3 w-3 flex-shrink-0 ${
                      currentThreadId === thread.id
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`} />
                    <h4 className={`text-sm font-medium truncate ${
                      currentThreadId === thread.id
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {formatThreadTitle(thread.title, thread.messages)}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate ${
                      currentThreadId === thread.id
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {thread.messages.length === 0
                        ? 'No messages yet'
                        : `${thread.messages.length} message${thread.messages.length !== 1 ? 's' : ''}`
                      }
                    </p>
                    <span className={`text-xs ${
                      currentThreadId === thread.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400'
                    }`}>
                      {formatLastActivity(thread.updatedAt)}
                    </span>
                  </div>
                </div>
                
                {(hoveredThread === thread.id || currentThreadId === thread.id) && (
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                      onClick={(e) => handleDeleteThread(thread.id, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}