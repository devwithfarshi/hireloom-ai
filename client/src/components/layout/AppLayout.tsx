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
      {/* Main content area that adjusts based on screen size and chatbot state */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-in-out",
          {
            // Responsive margins when chatbot is open
            "sm:mr-[400px] md:mr-[450px] lg:mr-[500px]": isOpen,
            // No margin when chatbot is closed
            "mr-0": !isOpen,
          }
        )}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>

      {/* Chatbot sidebar */}
      <ChatbotSidebar />
    </div>
  );
}
