'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, X, CheckCircle, MailCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { GoogleProvider } from '@/components/shared/google-provider';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

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

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export type AuthView = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: AuthView;
  redirectTo?: string;
}

export function AuthModal({ isOpen, onClose, defaultView = 'login', redirectTo = '/dashboard' }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(defaultView);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  if (!isOpen) return null;

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credentialResponse.credential,
      });
      if (error) throw error;
      
      router.push(redirectTo);
      router.refresh();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google login failed.';
      toast.error(message);
      setIsLoading(false);
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      
      router.push(redirectTo);
      router.refresh();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
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
        router.push(redirectTo);
        router.refresh();
        onClose();
      } else {
        setEmailSent(true);
        toast.success('Confirmation email has been sent', {
          description: 'Please check your inbox to activate your account.',
          icon: <MailCheck className="h-5 w-5 text-brand" />,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <GoogleProvider>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-foreground-muted hover:bg-background-secondary hover:text-foreground transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <AnimatePresence mode="wait">
          {emailSent && view === 'signup' ? (
            <motion.div 
              key="email-sent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-4"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-muted">
                <CheckCircle className="h-8 w-8 text-brand" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">Check your email</h2>
              <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
                We sent a confirmation link to your inbox. Click it to activate your account and get started.
              </p>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setView('login');
                }}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
              >
                Back to login
              </button>
            </motion.div>
          ) : view === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                <p className="mt-1.5 text-sm text-foreground-muted">
                  Sign in to your Suvadi account
                </p>
              </div>

              <div className="mt-6 flex justify-center w-full">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google login failed.')}
                    theme="outline"
                    shape="rectangular"
                    text="continue_with"
                    width="100%"
                  />
                </div>
              </div>

              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-foreground-subtle">or continue with email</span>
                <div className="flex-1 border-t border-border" />
              </div>

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    id="login-email" type="email" placeholder="you@example.com"
                    {...loginForm.register('email')}
                    className={cn(
                      'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                      'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
                      loginForm.formState.errors.email ? 'border-error' : 'border-border'
                    )}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-error">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className="block text-sm font-medium text-foreground">Password</label>
                    <Link href="/forgot-password" onClick={onClose} className="text-xs text-brand hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
                      {...loginForm.register('password')}
                      className={cn(
                        'w-full rounded-xl border px-4 py-3 pr-11 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                        'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand',
                        loginForm.formState.errors.password ? 'border-error' : 'border-border'
                      )}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-error">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button type="submit" disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold bg-brand text-white shadow-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>Sign In <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-foreground-muted">
                Don&apos;t have an account?{' '}
                <button onClick={() => setView('signup')} className="font-medium text-brand hover:underline">
                  Create one free
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                <p className="mt-1.5 text-sm text-foreground-muted">
                  Start collaborating for free — no credit card required
                </p>
              </div>

              <div className="mt-6 flex justify-center w-full">
                <div className="w-full flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google login failed.')}
                    theme="outline"
                    shape="rectangular"
                    text="continue_with"
                    width="100%"
                  />
                </div>
              </div>

              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-foreground-subtle">or sign up with email</span>
                <div className="flex-1 border-t border-border" />
              </div>

              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <input
                    id="name" type="text" placeholder="Jane Smith"
                    {...signupForm.register('name')}
                    className={cn(
                      'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                      'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                      signupForm.formState.errors.name ? 'border-error' : 'border-border'
                    )}
                  />
                  {signupForm.formState.errors.name && <p className="mt-1 text-xs text-error">{signupForm.formState.errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    id="signup-email" type="email" placeholder="you@example.com"
                    {...signupForm.register('email')}
                    className={cn(
                      'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                      'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                      signupForm.formState.errors.email ? 'border-error' : 'border-border'
                    )}
                  />
                  {signupForm.formState.errors.email && <p className="mt-1 text-xs text-error">{signupForm.formState.errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters"
                      {...signupForm.register('password')}
                      className={cn(
                        'w-full rounded-xl border px-4 py-3 pr-11 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                        'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                        signupForm.formState.errors.password ? 'border-error' : 'border-border'
                      )}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && <p className="mt-1 text-xs text-error">{signupForm.formState.errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
                  <input
                    id="confirmPassword" type="password" placeholder="Repeat your password"
                    {...signupForm.register('confirmPassword')}
                    className={cn(
                      'w-full rounded-xl border px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle',
                      'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors',
                      signupForm.formState.errors.confirmPassword ? 'border-error' : 'border-border'
                    )}
                  />
                  {signupForm.formState.errors.confirmPassword && <p className="mt-1 text-xs text-error">{signupForm.formState.errors.confirmPassword.message}</p>}
                </div>

                <button type="submit" disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold bg-brand text-white shadow-sm hover:opacity-90 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <><ArrowRight className="h-4 w-4" />Create Account</>
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-foreground-subtle">
                By signing up you agree to our <Link href="#" className="text-brand hover:underline">Terms</Link> and <Link href="#" className="text-brand hover:underline">Privacy Policy</Link>.
              </p>

              <p className="mt-4 text-center text-sm text-foreground-muted">
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="font-medium text-brand hover:underline">Sign in</button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        </GoogleProvider>
      </div>
    </div>
  );
}
