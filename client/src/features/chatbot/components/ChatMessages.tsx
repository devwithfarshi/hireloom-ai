import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/features/auth/hooks';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-start space-x-3 ${
            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className={`text-xs ${
              message.role === 'user' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}>
              {message.role === 'user' ? (
                getUserInitials()
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </AvatarFallback>
          </Avatar>

          <div className={`flex-1 max-w-[80%] ${
            message.role === 'user' ? 'text-right' : 'text-left'
          }`}>
            <div className={`inline-block p-3 rounded-lg text-sm ${
              message.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-sm'
            }`}>
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
            <div className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}