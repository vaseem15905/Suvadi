import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, showTagline = false, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      {/* Logo Icon */}
      <img
        src="/logo.png"
        alt="Logo"
        className={cn(
          'relative flex items-center justify-center transition-transform duration-200 group-hover:scale-105 object-contain',
          size === 'sm' && 'h-10 w-10',
          size === 'md' && 'h-14 w-14',
          size === 'lg' && 'h-20 w-20'
        )}
      />
      {/* Logo Text */}
      <div className="flex flex-col">
        <span
          className={cn(
            'font-bold tracking-tight text-foreground',
            sizeClasses[size]
          )}
        >
          Suvadi
        </span>
        {showTagline && (
          <span className="text-[10px] text-foreground-muted -mt-0.5 tracking-wide">
            Where Conversations Become Knowledge
          </span>
        )}
      </div>
    </Link>
  );
}
