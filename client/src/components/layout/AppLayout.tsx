import { ChatbotSidebar } from "@/features/chatbot";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isOpen } = useAppSelector((state) => state.chatbot);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isOpen ? "mr-[500px]" : "mr-0"
        }`}
      >
        <Navbar />
        <main
          className={cn("flex-1", {
            "px-4": isOpen,
          })}
        >
          {children}
        </main>
      </div>

      {/* Chatbot sidebar */}
      <ChatbotSidebar />
    </div>
  );
}
