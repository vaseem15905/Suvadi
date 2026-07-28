'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3, ListTodo, List, Minus, Download } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface WorkspaceNotesProps {
  sessionId: string;
  userId: string;
  isHost: boolean;
}

export function WorkspaceNotes({ sessionId, userId, isHost }: WorkspaceNotesProps) {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();
  const [initialContentLoaded, setInitialContentLoaded] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!notesRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(notesRef.current, {
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `notes-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download notes', err);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[500px] w-full',
      },
    },
    onUpdate: ({ editor }) => {
      const val = editor.getHTML();
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(async () => {
        setSaving(true);
        await supabase.from('notes').upsert({
          session_id: sessionId,
          user_id: userId,
          content: val,
          updated_at: new Date().toISOString(),
        });
        setSaving(false);
        setLastSaved(new Date());
      }, 800);
    },
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('notes')
        .select('content')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .single();
      
      if (data?.content && editor) {
        editor.commands.setContent(data.content);
      }
      setInitialContentLoaded(true);
    };
    
    if (!initialContentLoaded && editor) {
      load();
    }
  }, [sessionId, userId, editor, initialContentLoaded]);

  // Make sure the editor occupies the full area and clicking the container focuses it
  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      editor?.commands.focus('end');
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Toolbar */}
      <div className="relative flex items-center justify-between border-b border-border px-4 py-3 bg-surface">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">My Notes</span>
          {isHost && (
            <span className="rounded-full bg-brand-muted px-2 py-0.5 text-xs text-brand font-medium">Host</span>
          )}
        </div>

        {/* Formatting Tools - Centered */}
        {editor && (
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 rounded-md bg-background-secondary/50 p-1 border border-border/50">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors', editor.isActive('bold') && 'bg-surface text-brand shadow-sm')}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors', editor.isActive('italic') && 'bg-surface text-brand shadow-sm')}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors', editor.isActive('heading', { level: 1 }) && 'bg-surface text-brand shadow-sm')}
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors', editor.isActive('heading', { level: 2 }) && 'bg-surface text-brand shadow-sm')}
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors', editor.isActive('heading', { level: 3 }) && 'bg-surface text-brand shadow-sm')}
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors', editor.isActive('bulletList') && 'bg-surface text-brand shadow-sm')}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors', editor.isActive('taskList') && 'bg-surface text-brand shadow-sm')}
              title="Task List"
            >
              <ListTodo className="h-4 w-4" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors', editor.isActive({ textAlign: 'left' }) && 'bg-surface text-brand shadow-sm')}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors', editor.isActive({ textAlign: 'center' }) && 'bg-surface text-brand shadow-sm')}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors', editor.isActive({ textAlign: 'right' }) && 'bg-surface text-brand shadow-sm')}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className={cn('rounded p-1.5 hover:bg-background-secondary text-foreground transition-colors')}
              title="Horizontal Line"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs font-medium text-foreground-subtle hover:text-foreground transition-colors bg-surface border border-border px-2 py-1 rounded-md"
            title="Download Notes as PNG"
          >
            <Download className="h-3 w-3" />
            <span className="hidden md:inline">Export PNG</span>
          </button>
          <span className="text-xs text-foreground-subtle font-medium">
          {saving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
        </span>
      </div>
      </div>

      {/* Editor */}
      <div 
        className="flex-1 overflow-y-auto cursor-text bg-background" 
        onClick={handleContainerClick}
      >
        <div ref={notesRef} className="p-6 md:p-8 min-h-full bg-background">
          <EditorContent editor={editor} className="outline-none" />
        </div>
      </div>
    </div>
  );
}
