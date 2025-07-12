import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Logo Header */}
        {/* <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="inline-flex items-center justify-center h-20 aspect-video bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-200 overflow-hidden">
              <img
                src="/logo/logo.png"
                alt="ATS AI Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
        </div> */}
        {children}
      </div>
    </div>
  );
}
