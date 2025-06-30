import { Link } from 'react-router-dom';
import { useAppDispatch } from '@/lib/hooks';
import { useLogoutMutation } from '@/features/auth/authApi';
import { logout } from '@/features/auth/authSlice';
import { useAuth } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export function Navbar() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to logout');
    }
  };

  return (
    <nav className="border-b bg-white shadow-sm dark:bg-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">
            ATS-AI
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
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="hidden md:block">
              <span className="text-sm font-medium">{user.email}</span>
            </div>
          )}
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
          {isLoading ? 'Logging out...' : 'Logout'}
        </Button>
        </div>
      </div>
    </nav>
  );
}