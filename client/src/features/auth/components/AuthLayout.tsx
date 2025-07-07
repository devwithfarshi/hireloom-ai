import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex flex-col items-center">
            <img src="/logo/logo.png" alt="HireLoom AI Logo" className="h-16" />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
