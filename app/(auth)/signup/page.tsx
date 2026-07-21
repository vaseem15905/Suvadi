'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, Globe, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) throw error;
      
      if (authData.session) {
        // If email confirmation is disabled, Supabase automatically logs them in
        window.location.href = '/workspace';
      } else {
        // If email confirmation is enabled, they need to check their email
        setEmailSent(true);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credentialResponse.credential,
      });
      if (error) throw error;
      // Wait for redirect to happen or push manually, but middleware usually handles it
      window.location.href = '/workspace';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google login failed.';
      toast.error(message);
      setIsGoogleLoading(false);
    }
  };

  if (emailSent) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-muted">
            <CheckCircle className="h-8 w-8 text-brand" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">Check your email</h2>
          <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
            We sent a confirmation link to your inbox. Click it to activate your account and get started.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
          >
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
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-1.5 text-sm text-foreground-muted">
            Start collaborating for free — no credit card required
          </p>
        </div>

        <div className="mt-6 flex justify-center w-full">
          <div className="w-full max-w-[320px] flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google login failed.')}
              theme="outline"
              shape="rectangular"
              text="continue_with"
            />
          </div>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-foreground-subtle">or sign up with email</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <input
              id="name" type="text" placeholder="Jane Smith"
              {...register('name')}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                errors.name ? 'border-error' : 'border-border'
              )}
            />
            {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <input
                id="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters"
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
            <input
              id="confirmPassword" type="password" placeholder="Repeat your password"
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
              <><ArrowRight className="h-4 w-4" />Create Account</>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-foreground-subtle">
          By signing up you agree to our{' '}
          <Link href="#" className="text-brand hover:underline">Terms</Link> and{' '}
          <Link href="#" className="text-brand hover:underline">Privacy Policy</Link>.
        </p>

        <p className="mt-4 text-center text-sm text-foreground-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}
