'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setEmailSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-muted">
            <CheckCircle className="h-8 w-8 text-brand" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">Reset link sent</h2>
          <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
            Check your inbox for a password reset link. It will expire in 1 hour.
          </p>
          <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline">
            Back to login
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-md">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-muted">
            <Mail className="h-6 w-6 text-brand" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Forgot password?</h1>
          <p className="mt-1.5 text-sm text-foreground-muted">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
            <input
              id="email" type="email" placeholder="you@example.com"
              {...register('email')}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                errors.email ? 'border-error' : 'border-border'
              )}
            />
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
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
              <><ArrowRight className="h-4 w-4" />Send Reset Link</>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          Remembered it?{' '}
          <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}
