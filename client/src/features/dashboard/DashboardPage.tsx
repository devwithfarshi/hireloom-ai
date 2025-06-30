import { useAuth } from '@/features/auth/hooks';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold">Welcome!</h2>
        {user && (
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Account Status:</span>{' '}
              {user.isVerified ? 'Verified' : 'Not Verified'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}