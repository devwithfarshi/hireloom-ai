import { ReactNode } from 'react';
import { useAuth } from '../hooks';
import { Spinner } from '@/components/ui/spinner';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // This component will initialize the auth state and fetch the user data if authenticated
  const { isLoading } = useAuth();

  // Show a loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}