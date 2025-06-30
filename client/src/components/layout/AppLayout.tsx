import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}