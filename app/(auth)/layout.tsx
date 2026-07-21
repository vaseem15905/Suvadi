import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';

import { GoogleProvider } from '@/components/shared/google-provider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-secondary flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <Logo size="md" />
        <ThemeToggle />
      </header>

      {/* Auth card area */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <GoogleProvider>
            {children}
          </GoogleProvider>
        </div>
      </main>

      {/* Footer hint */}
      <footer className="py-6 text-center text-xs text-foreground-subtle">
        &copy; {new Date().getFullYear()} Suvadi — Where Conversations Become Knowledge
      </footer>
    </div>
  );
}
