import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogoutMutation } from "@/features/auth/authApi";
import { logout } from "@/features/auth/authSlice";
import { useAuth } from "@/features/auth/hooks";
import { Role } from "@/features/auth/types";
import { useAppDispatch } from "@/lib/hooks";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function Navbar() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
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
