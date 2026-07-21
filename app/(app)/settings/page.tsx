'use client';

import { useState } from 'react';
import { Moon, Sun, Monitor, Bell, Shield, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/providers/theme-provider';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setIsDeleting(true);
    try {
      toast.error('Account deletion is not available in beta. Contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-foreground-muted mt-1">Manage your account preferences.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Appearance */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-muted">
              <Sun className="h-4.5 w-4.5 text-brand" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
              <p className="text-xs text-foreground-muted">Choose your preferred color theme.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map(({ value, label, icon: Icon }) => (
              <button key={value} onClick={() => setTheme(value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200',
                  theme === value
                    ? 'border-brand bg-brand-muted'
                    : 'border-border hover:bg-background-secondary'
                )}
              >
                <Icon className={cn('h-5 w-5', theme === value ? 'text-brand' : 'text-foreground-muted')} />
                <span className={cn('text-xs font-medium', theme === value ? 'text-brand' : 'text-foreground-muted')}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-muted">
              <Bell className="h-4.5 w-4.5 text-brand" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
              <p className="text-xs text-foreground-muted">Configure when you hear from us.</p>
            </div>
          </div>
          <div className="space-y-3">
            {['New questions in sessions', 'Session announcements', 'Weekly digest email'].map((item) => (
              <label key={item} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-foreground">{item}</span>
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-5 rounded-full bg-border peer-checked:bg-brand transition-colors duration-200" />
                  <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-error/30 bg-surface p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-error/10">
              <Shield className="h-4.5 w-4.5 text-error" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Danger Zone</h2>
              <p className="text-xs text-foreground-muted">Irreversible actions for your account.</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-foreground-muted">
              Type <strong>DELETE</strong> below to confirm account deletion.
            </p>
            <input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full rounded-xl border border-error/30 px-4 py-3 text-sm bg-background text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-error/20 focus:border-error transition-colors"
            />
            <button onClick={handleDeleteAccount}
              disabled={deleteConfirm !== 'DELETE' || isDeleting}
              className="flex items-center gap-2 rounded-xl bg-error/10 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <Trash2 className="h-4 w-4" />Delete Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
