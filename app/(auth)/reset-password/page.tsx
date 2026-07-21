'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const schema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: data.password });
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to reset password.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-muted">
            <CheckCircle className="h-8 w-8 text-brand" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">Password updated!</h2>
          <p className="mt-2 text-sm text-foreground-muted">Your password has been changed successfully.</p>
          <Link href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white">
            Sign in with new password
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
          <p className="mt-1.5 text-sm text-foreground-muted">Choose a strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters"
                {...register('password')}
                className={cn(
                  'w-full rounded-xl border px-4 py-3 pr-11 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                  'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                  errors.password ? 'border-error' : 'border-border'
                )}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
            <input id="confirmPassword" type="password" placeholder="Repeat new password"
              {...register('confirmPassword')}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                errors.confirmPassword ? 'border-error' : 'border-border'
              )}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-error">{errors.confirmPassword.message}</p>}
          </div>

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
              <><ArrowRight className="h-4 w-4" />Update Password</>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
