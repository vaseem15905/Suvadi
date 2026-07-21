'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Globe, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { generateJoinCode, cn } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  visibility: z.enum(['public', 'private']),
});

type FormData = z.infer<typeof schema>;

export default function NewSessionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { visibility: 'public' },
  });

  const visibility = watch('visibility');

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: session, error } = await supabase.from('sessions').insert({
        title: data.title,
        description: data.description || null,
        visibility: data.visibility,
        host_id: user.id,
        join_code: generateJoinCode(),
        status: 'active',
      }).select().single();

      if (error) throw error;
      toast.success('Session created! Redirecting to workspace...');
      router.push(`/sessions/${session.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create session.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Create a Session</h1>
          <p className="text-sm text-foreground-muted mt-1">Set up your collaborative workspace in seconds.</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-xs">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1.5">
                Session Title <span className="text-error">*</span>
              </label>
              <input id="title" type="text"
                placeholder="e.g., Introduction to Machine Learning"
                {...register('title')}
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                  'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                  errors.title ? 'border-error' : 'border-border'
                )}
              />
              {errors.title && <p className="mt-1 text-xs text-error">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1.5">
                Description <span className="text-foreground-subtle text-xs font-normal">(optional)</span>
              </label>
              <textarea id="description" rows={3}
                placeholder="Briefly describe what this session is about..."
                {...register('description')}
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                  'border-border'
                )}
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Visibility</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['public', 'private'] as const).map((v) => (
                  <button key={v} type="button"
                    onClick={() => setValue('visibility', v)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200',
                      visibility === v
                        ? 'border-brand bg-brand-muted'
                        : 'border-border hover:border-border hover:bg-background-secondary'
                    )}
                  >
                    {v === 'public'
                      ? <Globe className={cn('h-5 w-5 flex-shrink-0', visibility === v ? 'text-brand' : 'text-foreground-muted')} />
                      : <Lock className={cn('h-5 w-5 flex-shrink-0', visibility === v ? 'text-brand' : 'text-foreground-muted')} />
                    }
                    <div>
                      <div className={cn('text-sm font-medium capitalize', visibility === v ? 'text-brand' : 'text-foreground')}>
                        {v}
                      </div>
                      <div className="text-xs text-foreground-muted mt-0.5">
                        {v === 'public' ? 'Anyone with link can join' : 'Invite only'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold',
                'bg-brand text-white shadow-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98]',
                'disabled:opacity-60 disabled:cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <><ArrowRight className="h-4 w-4" />Create Session</>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
