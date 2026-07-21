'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-lg',
        'text-foreground-muted hover:text-foreground',
        'bg-transparent hover:bg-background-secondary',
        'transition-all duration-200',
        className
      )}
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      {theme === 'light' && <Sun className="h-[18px] w-[18px]" />}
      {theme === 'dark' && <Moon className="h-[18px] w-[18px]" />}
      {theme === 'system' && <Monitor className="h-[18px] w-[18px]" />}
    </button>
  );
}
