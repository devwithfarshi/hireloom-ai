import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { History, MessageSquare, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { closeChatbot, createThread } from "../chatbotSlice";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { StarterPrompts } from "./StarterPrompts";
import { ThreadList } from "./ThreadList";

export function ChatbotSidebar() {
  const dispatch = useAppDispatch();
  const { isOpen, currentThreadId, threads } = useAppSelector(
    (state) => state.chatbot
  );
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);

  const currentThread = threads.find((t) => t.id === currentThreadId);
  const hasMessages = currentThread && currentThread.messages.length > 0;

  const handleNewChat = () => {
    dispatch(createThread({ title: "New Chat" }));
    setShowHistory(false); // Switch back to chat view when creating new chat
  };

  const handleClose = () => {
    dispatch(closeChatbot());
  };

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        dispatch(closeChatbot());
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, dispatch]);

  // Auto-switch to chat view when a thread is selected
  const [previousThreadId, setPreviousThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (
      currentThreadId &&
      showHistory &&
      currentThreadId !== previousThreadId
    ) {
      setShowHistory(false);
    }
    setPreviousThreadId(currentThreadId);
  }, [currentThreadId, showHistory, previousThreadId]);

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-0 h-full w-[500px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ask Loo
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleHistory}
                  className={`h-8 w-8 p-0 ${showHistory ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                  title="Toggle History"
                >
                  <History className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNewChat}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
              {showHistory ? (
                /* History View */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col"
                >
                  {/* History Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Chat History
                      </h3>
                      <Button
                        onClick={handleNewChat}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>New Chat</span>
                      </Button>
                    </div>
                  </div>

                  {/* Thread List */}
                  <div className="flex-1 overflow-hidden">
                    {threads.length > 0 ? (
                      <div className="h-full">
                        <ThreadList />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center p-4">
                        <div className="text-center">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No Chat History
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Start your first conversation to see it here.
                          </p>
                          <Button onClick={handleNewChat}>
                            <Plus className="h-4 w-4 mr-2" />
                            Start New Chat
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* Chat View */
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {currentThread ? (
                    <>
                      {/* Messages */}
                      <div className="flex-1 min-h-0">
                        <div className="p-4 h-full overflow-y-auto">
                          {hasMessages ? (
                            <ChatMessages messages={currentThread.messages} />
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <StarterPrompts />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Input */}
                      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                        <ChatInput threadId={currentThread.id} />
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-4">
                      <Card className="p-6 text-center max-w-sm">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Welcome to AI Assistant
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Start a new conversation to get help with your
                          recruitment tasks.
                        </p>
                        <Button onClick={handleNewChat} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Start New Chat
                        </Button>
                      </Card>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
