'use client';

import { useState } from 'react';
import { Copy, Trash2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SessionCardActionsProps {
  sessionId: string;
  joinCode: string;
  isHost: boolean;
  className?: string;
  iconOnly?: boolean;
}

export function SessionCardActions({ sessionId, joinCode, isHost, className, iconOnly }: SessionCardActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(joinCode);
    setCopied(true);
    toast.success('Join code copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone and will permanently delete all associated files, questions, and notes.')) {
      return;
    }

    setIsDeleting(true);
    toast.loading('Deleting session and files...', { id: 'delete-session' });

    try {
      // 1. Fetch all resources in this session to physically delete their files from storage
      const { data: resources } = await supabase
        .from('resources')
        .select('url')
        .eq('session_id', sessionId);

      if (resources && resources.length > 0) {
        // Extract storage paths from public URLs
        const paths = resources
          .map(r => {
            const parts = r.url.split('/resources/');
            return parts.length > 1 ? parts[1] : null;
          })
          .filter((p): p is string => p !== null);
          
        if (paths.length > 0) {
          await supabase.storage.from('resources').remove(paths);
        }
      }

      // 2. Delete the session (which will CASCADE delete all DB rows: folders, resources, questions, etc.)
      const { error } = await supabase.from('sessions').delete().eq('id', sessionId);
      if (error) throw error;

      toast.success('Session deleted successfully', { id: 'delete-session' });
      router.refresh();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(`Failed to delete session: ${error.message || 'Unknown error'}`, { id: 'delete-session' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!iconOnly && (
        <code className="flex-1 text-xs bg-background-secondary rounded-lg px-2 py-1 font-mono text-foreground-muted truncate text-left">
          Join: {joinCode}
        </code>
      )}
      
      <button
        onClick={handleCopy}
        title="Copy join code"
        className={cn(
          "flex items-center justify-center rounded-lg border border-border hover:bg-background-secondary transition-colors",
          iconOnly ? "h-8 w-8 text-foreground-muted hover:text-foreground" : "h-7 w-7 text-foreground-muted"
        )}
      >
        {copied ? <Check className={cn(iconOnly ? "h-4 w-4 text-success" : "h-3 w-3 text-success")} /> : <Copy className={cn(iconOnly ? "h-4 w-4" : "h-3 w-3")} />}
      </button>

      {isHost && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete session"
          className={cn(
            "flex items-center justify-center rounded-lg border border-border transition-colors",
            iconOnly 
              ? "h-8 w-8 text-foreground-muted hover:bg-error/10 hover:text-error hover:border-error/20" 
              : "h-7 w-7 text-foreground-muted hover:bg-error/10 hover:text-error hover:border-error/20",
            isDeleting && "opacity-50 cursor-not-allowed"
          )}
        >
          <Trash2 className={cn(iconOnly ? "h-4 w-4" : "h-3 w-3")} />
        </button>
      )}
    </div>
  );
}
