import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logout } from "@/features/auth/authSlice";
import { useAuth } from "@/features/auth/hooks";
import { Role } from "@/features/auth/types";
import { toggleChatbot } from "@/features/chatbot/chatbotSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Menu, MessageSquare, SparklesIcon, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function Navbar() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { isOpen: isChatbotOpen } = useAppSelector((state) => state.chatbot);
  const [logoutApi, { isLoading }] = useLogoutMutation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo/logo-icon.png"
                alt="HireLoom AI Logo"
                className="w-8 sm:w-10 aspect-square bg-blend-color-burn"
              />
              <p className="text-lg sm:text-xl font-bold">HireLoom AI</p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:space-x-4">
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

          {/* Right side - Desktop */}
          <div className="flex ml-auto items-center space-x-2 lg:space-x-4">
            {/* AI Assistant Toggle */}
            {(user?.role === Role.RECRUITER ||
              user?.role === Role.SUPER_ADMIN) && (
              <Button
                onClick={handleChatbotToggle}
                variant={isChatbotOpen ? "default" : "outline"}
                size="sm"
                className={`relative text-sm sm:text-base ${
                  isChatbotOpen
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                    : "border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <SparklesIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="inline">HiRa</span>
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
              className="text-xs sm:text-sm hidden lg:inline-block"
            >
              {isLoading ? (
                <Spinner size="sm" className="mr-1 sm:mr-2" />
              ) : null}
              {isLoading ? "Logging out..." : "Logout"}
            </Button>

            {user && (
              <div className="hidden lg:block">
                <span className="text-sm font-medium">
                  {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                    user.email}
                </span>
              </div>
            )}

            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
              <AvatarFallback>
                <span className="text-xs sm:text-sm font-medium">
                  {[user?.firstName, user?.lastName]
                    .filter(Boolean)
                    .join(" ")
                    .charAt(0)}
                </span>
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Mobile menu button and essential items */}
          <div className="flex sm:hidden items-center space-x-2">
            {/* AI Assistant Toggle - Mobile */}

            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 py-3">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
              {user?.role === Role.CANDIDATE && (
                <Link
                  to="/jobs"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Jobs
                </Link>
              )}
              {user?.role === Role.CANDIDATE && (
                <Link
                  to="/my-applications"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Applications
                </Link>
              )}
              {user?.role === Role.RECRUITER && (
                <Link
                  to="/dashboard/jobs"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manage Jobs
                </Link>
              )}

              {/* User info and logout in mobile menu */}
              {user && (
                <div className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3">
                  {[user.firstName, user.lastName].filter(Boolean).join(" ") ||
                    user.email}
                </div>
              )}

              <Button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                disabled={isLoading}
                variant="destructive"
                size="sm"
                className="mx-3 text-xs"
              >
                {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                {isLoading ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
