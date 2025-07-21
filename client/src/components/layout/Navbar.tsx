import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logout } from "@/features/auth/authSlice";
import { useAuth } from "@/features/auth/hooks";
import { Role } from "@/features/auth/types";
import { toggleChatbot } from "@/features/chatbot/chatbotSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { MessageSquare, SparklesIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function Navbar() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { isOpen: isChatbotOpen } = useAppSelector((state) => state.chatbot);
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to logout");
    }
  };

  const handleChatbotToggle = () => {
    dispatch(toggleChatbot());
  };

  return (
    <nav className="border-b bg-white shadow-sm dark:bg-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img
              src="/logo/logo-icon.png"
              alt="HireLoom AI Logo"
              className="w-10 aspect-square bg-blend-color-burn"
            />
            <p className="text-xl font-bold">HireLoom AI</p>
          </Link>
          <div className="hidden md:flex md:space-x-4">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Profile
            </Link>
            {user?.role === Role.CANDIDATE && (
              <Link
                to="/jobs"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Browse Jobs
              </Link>
            )}
            {user?.role === Role.CANDIDATE && (
              <Link
                to="/my-applications"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                My Applications
              </Link>
            )}
            {user?.role === Role.RECRUITER && (
              <Link
                to="/dashboard/jobs"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Manage Jobs
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* AI Assistant Toggle */}
          {(user?.role === Role.RECRUITER ||
            user?.role === Role.SUPER_ADMIN) && (
            <Button
              onClick={handleChatbotToggle}
              variant={isChatbotOpen ? "default" : "outline"}
              size="sm"
              className={`relative ${
                isChatbotOpen
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                  : "border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <SparklesIcon className="h-4 w-4" />
              Ask Loo
              {isChatbotOpen && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-400 rounded-full animate-pulse" />
              )}
            </Button>
          )}

          <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant="destructive"
            size="sm"
          >
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
          {user && (
            <div className="hidden md:block">
              <span className="text-sm font-medium">
                {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                  user.email}
              </span>
            </div>
          )}
          <Avatar>
            <AvatarFallback>
              <span className="text-sm font-medium">
                {[user?.firstName, user?.lastName]
                  .filter(Boolean)
                  .join(" ")
                  .charAt(0)}
              </span>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
}
