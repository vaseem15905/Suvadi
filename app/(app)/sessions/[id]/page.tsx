import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { Suspense } from 'react';
import { WorkspaceClient } from '@/components/workspace/workspace-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('sessions').select('title').eq('id', id).single();
  return { title: data?.title ?? 'Session' };
}

export default async function SessionWorkspacePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (!session) notFound();

  // Auto-join participant if not already in
  const { data: participant } = await supabase
    .from('session_participants')
    .select('id')
    .eq('session_id', id)
    .eq('user_id', user.id)
    .single();

  if (!participant) {
    const { error: joinError } = await supabase.from('session_participants').insert({
      session_id: id,
      user_id: user.id,
      role: session.host_id === user.id ? 'host' : 'participant',
    });
    if (joinError) {
      console.error("Failed to join session participants:", joinError);
      // We don't throw here to avoid completely blocking the page load,
      // but if this fails, they aren't a member.
    }
  }

  const isHost = session.host_id === user.id;

  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center">Loading workspace...</div>}>
      <WorkspaceClient
        session={session}
        userId={user.id}
        isHost={isHost}
      />
    </Suspense>
  );
}
