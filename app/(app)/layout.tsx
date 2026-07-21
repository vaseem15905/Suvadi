import { Suspense } from 'react';
import { AppSidebar, AppTopbar } from '@/components/layout/app-sidebar';

// Opt out of static prerendering — all app pages are dynamic (require auth)
export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Suspense fallback={<div className="w-[64px] border-r border-border bg-surface" />}>
        <AppSidebar />
      </Suspense>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-y-auto bg-background-secondary p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
