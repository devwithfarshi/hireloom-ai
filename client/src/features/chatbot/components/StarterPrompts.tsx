import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { motion } from "framer-motion";
import { Briefcase, FileText, Users } from "lucide-react";
import { addMessage } from "../chatbotSlice";
import { starterPrompts } from "../starterPrompts";
import { ChatMessage } from "../types";

export function StarterPrompts() {
  const { currentThreadId } = useAppSelector((state) => state.chatbot);
  const dispatch = useAppDispatch();

  const handlePromptClick = (prompt: string) => {
    if (!currentThreadId) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: prompt,
      role: "user",
      timestamp: new Date(),
      threadId: currentThreadId,
    };

    dispatch(addMessage(userMessage));

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content:
          "I'd be happy to help you with that! Let me guide you through the process step by step. What specific aspect would you like to focus on first?",
        role: "assistant",
        timestamp: new Date(),
        threadId: currentThreadId,
      };
      dispatch(addMessage(aiMessage));
    }, 1000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "job":
        return <Briefcase className="h-4 w-4" />;
      case "application":
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "job":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      case "application":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-purple-600 bg-purple-50 dark:bg-purple-900/20";
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          How can I help you today?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose a prompt below or type your own question
        </p>
      </div>

      <div className="grid gap-3">
        {starterPrompts.map((prompt, index) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="w-full"
          >
            <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center space-x-2">
                    <span
                      className={`p-1 rounded ${getCategoryColor(prompt.category)}`}
                    >
                      {getCategoryIcon(prompt.category)}
                    </span>
                    <span>{prompt.title}</span>
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  {prompt.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span
                  onClick={() => handlePromptClick(prompt.prompt)}
                  className="text-muted-foreground text-sm hover:text-purple-500 hover:underline"
                >
                  {prompt.prompt}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          💡 <strong>Tip:</strong> I can help you with job management, candidate
          screening, interview preparation, and general recruitment advice.
        </p>
      </div>
    </div>
  );
}
