import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Send } from 'lucide-react';
import { KeyboardEvent, useState } from 'react';
import { addMessage, setLoading } from '../chatbotSlice';
import { ChatMessage } from '../types';

interface ChatInputProps {
  threadId: string;
}

export function ChatInput({ threadId }: ChatInputProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.chatbot);
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: message.trim(),
      role: 'user',
      timestamp: new Date(),
      threadId,
    };

    dispatch(addMessage(userMessage));
    setMessage('');
    dispatch(setLoading(true));

    // Simulate AI response (in a real app, this would call an API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: generateAIResponse(userMessage.content),
        role: 'assistant',
        timestamp: new Date(),
        threadId,
      };
      
      dispatch(addMessage(aiMessage));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('job') && lowerMessage.includes('create')) {
      return "I'll help you create a new job posting! Here's what we need to cover:\n\n1. **Job Title** - What position are you hiring for?\n2. **Job Description** - Key responsibilities and requirements\n3. **Qualifications** - Required skills and experience\n4. **Company Information** - About your organization\n5. **Benefits & Compensation** - What you're offering\n\nLet's start with the job title. What position would you like to post?";
    }
    
    if (lowerMessage.includes('applicant') || lowerMessage.includes('candidate')) {
      return "I can help you manage and evaluate applicants! Here are some ways I can assist:\n\n• **View Applications** - Access candidate profiles and resumes\n• **Screen Candidates** - Filter based on qualifications\n• **Schedule Interviews** - Coordinate with candidates\n• **Evaluation Tips** - Best practices for candidate assessment\n\nWhat specific aspect of applicant management would you like help with?";
    }
    
    if (lowerMessage.includes('update') || lowerMessage.includes('edit')) {
      return "I'll help you update your job posting! Here's what we can improve:\n\n• **Job Description** - Make it more compelling\n• **Requirements** - Adjust qualifications\n• **Benefits** - Highlight what makes your offer attractive\n• **Keywords** - Optimize for better visibility\n\nWhich job would you like to update? You can provide the job ID or title.";
    }
    
    if (lowerMessage.includes('interview')) {
      return "Great! I can help you with interview preparation. Here are some areas I can assist with:\n\n• **Question Bank** - Role-specific interview questions\n• **Evaluation Criteria** - What to look for in candidates\n• **Interview Structure** - Best practices for conducting interviews\n• **Follow-up Process** - Next steps after interviews\n\nWhat type of role are you interviewing for? This will help me suggest more targeted questions.";
    }
    
    // Default response
    return "I'm here to help with your recruitment needs! I can assist with:\n\n• Creating and updating job postings\n• Managing applicants and candidates\n• Interview preparation and questions\n• Recruitment best practices\n• Analytics and insights\n\nWhat would you like to work on today? Feel free to be specific about your needs!";
  };

  return (
    <div className="flex space-x-2">
      <div className="flex-1">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          className="min-h-[44px] max-h-32 resize-none"
          disabled={isLoading}
        />
      </div>
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        size="sm"
        className="h-11 px-3"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}