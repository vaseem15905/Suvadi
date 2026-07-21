'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { UserAvatar } from '@/components/shared/user-avatar';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<{ name: string; bio: string; avatar_url: string | null; email: string } | null>(null);
  const [userId, setUserId] = useState<string | undefined>();
  const supabase = createClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile({ ...data, email: user.email ?? '' });
        reset({ name: data.name ?? '', bio: data.bio ?? '', website: data.website ?? '' });
      }
    };
    load();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('profiles').update({
        name: data.name, bio: data.bio ?? '', website: data.website ?? '',
      }).eq('id', user.id);
      if (error) throw error;
      toast.success('Profile updated!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-foreground-muted mt-1">Manage your public profile information.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div className="relative">
              <UserAvatar 
                name={profile?.name ?? 'Loading'} 
                avatarUrl={profile?.avatar_url} 
                userId={userId} 
                className="h-20 w-20 text-2xl" 
              />
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface border border-border shadow-sm hover:bg-background-secondary transition-colors">
                <Camera className="h-3.5 w-3.5 text-foreground-muted" />
              </button>
            </div>
            <div>
              <div className="text-base font-semibold text-foreground">{profile?.name ?? 'Loading...'}</div>
              <div className="text-sm text-foreground-muted">{profile?.email}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input id="name" type="text" {...register('name')}
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                  errors.name ? 'border-error' : 'border-border'
                )}
              />
              {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1.5">
                Bio <span className="text-foreground-subtle text-xs">(optional)</span>
              </label>
              <textarea id="bio" rows={3} {...register('bio')}
                placeholder="Tell others about yourself..."
                className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors resize-none"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-foreground mb-1.5">
                Website <span className="text-foreground-subtle text-xs">(optional)</span>
              </label>
              <input id="website" type="url" {...register('website')} placeholder="https://yourwebsite.com"
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                  'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                  errors.website ? 'border-error' : 'border-border'
                )}
              />
              {errors.website && <p className="mt-1 text-xs text-error">{errors.website.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white',
                'hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : 'Save Changes'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
