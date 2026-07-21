'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ThumbsUp, ThumbsDown, CheckCircle, Trash2, Send, Star, CornerDownRight, MessageCircle, ChevronDown, ChevronUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { UserAvatar } from '@/components/shared/user-avatar';

interface QuestionAnswer {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  is_host_appreciated: boolean;
  created_at: string;
  profiles?: { name: string; avatar_url?: string | null };
  likeCount?: number;
  dislikeCount?: number;
  myVoteType?: number | null;
}

interface Question {
  id: string;
  content: string;
  answered: boolean;
  user_id: string;
  created_at: string;
  profiles?: { name: string; avatar_url?: string | null };
  answers?: QuestionAnswer[];
  upvoteCount?: number;
  hasVoted?: boolean;
}

interface WorkspaceQuestionsProps {
  sessionId: string;
  userId: string;
  isHost: boolean;
  allowInteractions: boolean;
}

export function WorkspaceQuestions({ sessionId, userId, isHost, allowInteractions }: WorkspaceQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQ, setNewQ] = useState('');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [expandedQs, setExpandedQs] = useState<{ [key: string]: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const toggleExpand = (id: string) => {
    setExpandedQs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const load = async () => {
    const [qRes, aRes, qvRes, avRes] = await Promise.all([
      supabase.from('questions').select('*, profiles!questions_user_id_fkey(name, avatar_url)').eq('session_id', sessionId).order('created_at', { ascending: false }),
      supabase.from('question_answers').select('*, profiles!question_answers_user_id_fkey(name, avatar_url)').eq('session_id', sessionId).order('created_at', { ascending: true }),
      supabase.from('question_votes').select('*').eq('session_id', sessionId),
      supabase.from('answer_votes').select('*').eq('session_id', sessionId)
    ]);
    
    if (qRes.error) console.error("Questions load error:", qRes.error);
    if (aRes.error) console.error("Answers load error:", aRes.error);
    if (qvRes.error) console.error("Q Votes load error:", qvRes.error);
    if (avRes.error) console.error("A Votes load error:", avRes.error);
    
    const qs = qRes.data ?? [];
    const ans = aRes.data ?? [];
    const qvs = qvRes.data ?? [];
    const avs = avRes.data ?? [];
    
    const mapped = qs.map(q => {
      const qVotes = qvs.filter(v => v.question_id === q.id);
      const upvoteCount = qVotes.length;
      const hasVoted = qVotes.some(v => v.user_id === userId);
      
      const qAnswers = ans.filter(a => a.question_id === q.id).map(a => {
        const aVotes = avs.filter(v => v.answer_id === a.id);
        const likeCount = aVotes.filter(v => v.vote_type === 1).length;
        const dislikeCount = aVotes.filter(v => v.vote_type === -1).length;
        const myVote = aVotes.find(v => v.user_id === userId);
        return {
          ...a,
          likeCount,
          dislikeCount,
          myVoteType: myVote ? myVote.vote_type : null
        };
      });
      
      return {
        ...q,
        upvoteCount,
        hasVoted,
        answers: qAnswers
      };
    });
    
    mapped.sort((a, b) => (b.upvoteCount ?? 0) - (a.upvoteCount ?? 0));
    setQuestions(mapped);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`qa-${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questions', filter: `session_id=eq.${sessionId}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'question_answers', filter: `session_id=eq.${sessionId}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'question_votes', filter: `session_id=eq.${sessionId}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'answer_votes', filter: `session_id=eq.${sessionId}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  const submitQuestion = async () => {
    if (!newQ.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('questions').insert({ session_id: sessionId, user_id: userId, content: newQ.trim(), upvotes: 0, answered: false });
    if (error) {
      toast.error(`Failed to ask: ${error.message}`);
    } else {
      setNewQ('');
      load();
    }
    setSubmitting(false);
  };

  const submitAnswer = async (questionId: string) => {
    const txt = replyText[questionId];
    if (!txt?.trim()) return;
    
    const { error } = await supabase.from('question_answers').insert({
      session_id: sessionId,
      question_id: questionId,
      user_id: userId,
      content: txt.trim(),
      likes: 0,
      dislikes: 0,
      is_host_appreciated: false
    });
    
    if (error) {
      toast.error(`Failed to reply: ${error.message}`);
    } else {
      setReplyText(prev => ({ ...prev, [questionId]: '' }));
      load();
    }
  };

  // Question Actions
  const upvoteQ = async (id: string, hasVoted: boolean) => {
    if (hasVoted) {
      const { error } = await supabase.from('question_votes').delete().eq('question_id', id).eq('user_id', userId);
      if (error) toast.error(`Failed to remove vote: ${error.message}`);
      else load();
    } else {
      const { error } = await supabase.from('question_votes').insert({ question_id: id, session_id: sessionId, user_id: userId });
      if (error) toast.error(`Failed to upvote: ${error.message}`);
      else load();
    }
  };

  const markAnswered = async (id: string) => {
    const { error } = await supabase.from('questions').update({ answered: true }).eq('id', id);
    if (error) toast.error(`Failed to update: ${error.message}`);
    else load();
  };

  const deleteQ = async (id: string) => {
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (error) toast.error(`Failed to delete: ${error.message}`);
    else load();
  };

  // Answer Actions
  const toggleAnswerVote = async (id: string, currentVoteType: number | null, targetVoteType: number) => {
    if (currentVoteType === targetVoteType) {
      const { error } = await supabase.from('answer_votes').delete().eq('answer_id', id).eq('user_id', userId);
      if (error) toast.error(`Failed to remove vote: ${error.message}`);
      else load();
    } else if (currentVoteType) {
      const { error } = await supabase.from('answer_votes').update({ vote_type: targetVoteType }).eq('answer_id', id).eq('user_id', userId);
      if (error) toast.error(`Failed to change vote: ${error.message}`);
      else load();
    } else {
      const { error } = await supabase.from('answer_votes').insert({ answer_id: id, session_id: sessionId, user_id: userId, vote_type: targetVoteType });
      if (error) toast.error(`Failed to vote: ${error.message}`);
      else load();
    }
  };

  const toggleAppreciation = async (id: string, current: boolean) => {
    const { error } = await supabase.from('question_answers').update({ is_host_appreciated: !current }).eq('id', id);
    if (error) toast.error(`Failed to update appreciation: ${error.message}`);
    else load();
  };

  const deleteAnswer = async (id: string) => {
    const { error } = await supabase.from('question_answers').delete().eq('id', id);
    if (error) toast.error(`Failed to delete answer: ${error.message}`);
    else load();
  };

  return (
    <div className="flex h-full flex-col relative">
      <div className="border-b border-border px-4 py-3 bg-background flex items-center justify-between z-10">
        <span className="text-sm font-medium text-foreground">Questions & Discussions</span>
        <span className="text-xs text-foreground-subtle">{questions.filter(q => !q.answered).length} open questions</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 bg-background-secondary">
        {questions.length === 0 ? (
          <div className="text-center py-12 text-foreground-subtle text-sm">No questions yet. Be the first to ask!</div>
        ) : questions.map((q) => (
          <div key={q.id} className={cn(
            'rounded-2xl border bg-surface p-4 transition-all',
            q.answered ? 'opacity-70 border-success/30' : 'border-border'
          )}>
            {/* Question Header */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{q.content}</p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-foreground-subtle">
                  <div className="flex items-center gap-2">
                    <UserAvatar 
                      name={q.profiles?.name ?? 'Anonymous'} 
                      avatarUrl={q.profiles?.avatar_url} 
                      userId={q.user_id} 
                      className="h-5 w-5 text-[10px]" 
                    />
                    <span>{q.profiles?.name ?? 'Anonymous'}</span>
                  </div>
                  <span className="text-foreground-muted">•</span>
                  <span>{new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {q.answered && <span className="text-success flex items-center gap-1 ml-2"><CheckCircle className="h-3 w-3" />Answered</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleExpand(q.id)}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-brand hover:bg-brand-muted transition-colors mr-2">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {q.answers?.length ?? 0} {q.answers?.length === 1 ? 'Reply' : 'Replies'}
                  {expandedQs[q.id] ? <ChevronUp className="h-3 w-3 ml-0.5" /> : <ChevronDown className="h-3 w-3 ml-0.5" />}
                </button>
                <button onClick={() => upvoteQ(q.id, q.hasVoted ?? false)}
                  className={cn("flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-colors", 
                    q.hasVoted ? "text-brand bg-brand-muted font-medium" : "text-foreground-muted hover:text-brand hover:bg-brand-muted")}>
                  <ThumbsUp className={cn("h-3.5 w-3.5", q.hasVoted && "fill-brand/20")} />{q.upvoteCount}
                </button>
                {isHost && !q.answered && (
                  <button onClick={() => markAnswered(q.id)} title="Mark Answered"
                    className="flex items-center gap-1 rounded-lg p-1.5 text-success hover:bg-success/10 transition-colors">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
                {(isHost || q.user_id === userId) && (
                  <button onClick={() => deleteQ(q.id)} title="Delete Question"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-foreground-subtle hover:text-error hover:bg-error/10 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Answers Thread */}
            {expandedQs[q.id] && (
              <div className="mt-4 ml-2 pl-4 border-l-2 border-border space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                {q.answers?.map(a => (
                  <div key={a.id} className={cn(
                    "p-3 rounded-xl border relative", 
                    a.is_host_appreciated ? "border-amber-500/40 bg-amber-500/5 shadow-sm" : "border-border bg-background-secondary"
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{a.content}</p>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-foreground-subtle">
                          <div className="flex items-center gap-2">
                            <UserAvatar 
                              name={a.profiles?.name ?? 'Anonymous'} 
                              avatarUrl={a.profiles?.avatar_url} 
                              userId={a.user_id} 
                              className="h-4 w-4 text-[9px]" 
                            />
                            <span className="font-medium text-foreground-muted">{a.profiles?.name ?? 'Anonymous'}</span>
                          </div>
                          {a.is_host_appreciated && (
                            <span className="text-amber-500 font-medium flex items-center gap-1 ml-1 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                              <Star className="h-3 w-3 fill-amber-500" /> Host Appreciated
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => toggleAnswerVote(a.id, a.myVoteType ?? null, 1)} title="Like" 
                          className={cn("flex items-center gap-1 p-1 text-xs transition-colors rounded", 
                            a.myVoteType === 1 ? "text-brand bg-brand-muted font-medium" : "text-foreground-muted hover:text-brand hover:bg-brand-muted")}>
                          <ThumbsUp className={cn("h-3.5 w-3.5", a.myVoteType === 1 && "fill-brand/20")} />{a.likeCount || ''}
                        </button>
                        <button onClick={() => toggleAnswerVote(a.id, a.myVoteType ?? null, -1)} title="Dislike" 
                          className={cn("flex items-center gap-1 p-1 text-xs transition-colors rounded", 
                            a.myVoteType === -1 ? "text-error bg-error/10 font-medium" : "text-foreground-muted hover:text-error hover:bg-error/10")}>
                          <ThumbsDown className={cn("h-3.5 w-3.5", a.myVoteType === -1 && "fill-error/20")} />{a.dislikeCount || ''}
                        </button>
                        
                        {isHost && (
                          <button onClick={() => toggleAppreciation(a.id, a.is_host_appreciated)} title={a.is_host_appreciated ? "Remove Appreciation" : "Appreciate Answer"}
                            className={cn("p-1.5 ml-1 rounded-lg transition-colors", a.is_host_appreciated ? "text-amber-500 hover:bg-amber-500/10" : "text-foreground-muted hover:text-amber-500 hover:bg-amber-500/10")}>
                            <Star className={cn("h-4 w-4", a.is_host_appreciated && "fill-amber-500")} />
                          </button>
                        )}
                        
                        {(isHost || a.user_id === userId) && (
                          <button onClick={() => deleteAnswer(a.id)} title="Delete Answer" className="p-1.5 rounded-lg text-foreground-subtle hover:text-error hover:bg-error/10 transition-colors ml-1"><Trash2 className="h-3.5 w-3.5"/></button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Reply Input */}
                {(isHost || allowInteractions) && !q.answered && (
                  <div className="flex gap-2 items-center mt-2">
                    <CornerDownRight className="h-4 w-4 text-foreground-muted shrink-0" />
                    <input 
                      value={replyText[q.id] || ''} 
                      onChange={(e) => setReplyText({...replyText, [q.id]: e.target.value})}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && submitAnswer(q.id)}
                      placeholder="Type an answer or reply..." 
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand"
                    />
                    <button onClick={() => submitAnswer(q.id)} disabled={!replyText[q.id]?.trim()}
                      className="px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                      Reply
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex gap-2 p-2 rounded-2xl bg-surface border border-border shadow-lg">
          <input value={newQ} onChange={(e) => setNewQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && submitQuestion()}
            placeholder={(!isHost && !allowInteractions) ? "The host has disabled asking questions." : "Ask a new question..."}
            disabled={!isHost && !allowInteractions}
            className="flex-1 rounded-xl border border-transparent bg-background-secondary px-4 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button onClick={submitQuestion} disabled={submitting || !newQ.trim() || (!isHost && !allowInteractions)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
