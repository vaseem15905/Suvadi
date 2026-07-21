import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function JoinCodePage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = await params;
  const code = resolvedParams.code.toUpperCase();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/join/${code}`);
  }

  // Find the session
  const { data: session } = await supabase
    .from('sessions')
    .select('id, status')
    .eq('join_code', code)
    .maybeSingle();

  if (!session || session.status !== 'active') {
    // If invalid or ended, redirect them to the manual join page where they can try again
    redirect('/join');
  }

  // Redirect to the actual session workspace
  redirect(`/sessions/${session.id}`);
}
