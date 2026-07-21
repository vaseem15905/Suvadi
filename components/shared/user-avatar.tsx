import { cn, getInitials } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string | null;
  userId?: string;
  className?: string;
}

const COLORS = [
  '#f87171', // red-400
  '#fb923c', // orange-400
  '#fbbf24', // amber-400
  '#a3e635', // lime-400
  '#4ade80', // green-400
  '#34d399', // emerald-400
  '#2dd4bf', // teal-400
  '#38bdf8', // sky-400
  '#60a5fa', // blue-400
  '#818cf8', // indigo-400
  '#a78bfa', // violet-400
  '#e879f9', // fuchsia-400
  '#f472b6', // pink-400
  '#fb7185', // rose-400
];

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}

export function UserAvatar({ name, avatarUrl, userId, className }: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn('rounded-full object-cover shrink-0', className)}
        referrerPolicy="no-referrer"
      />
    );
  }

  const color = stringToColor(userId || name);

  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-full text-white font-bold', className)}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </div>
  );
}
