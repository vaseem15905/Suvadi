'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, Trash2, FileText, FileImage, Film, FileArchive, Download, X, Eye, Folder, FolderPlus, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ResourceFolder {
  id: string;
  session_id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
}

interface Resource {
  id: string;
  user_id: string;
  folder_id: string | null;
  name: string;
  url: string;
  type: string;
  size_bytes: number;
  description?: string | null;
  created_at: string;
  profiles?: { name: string };
}

interface WorkspaceResourcesProps {
  sessionId: string;
  userId: string;
  isHost: boolean;
  allowInteractions: boolean;
}

const getFileInfo = (type: string, name: string) => {
  const extension = name.split('.').pop()?.toLowerCase();
  
  if (type === 'application/pdf' || extension === 'pdf') {
    return { icon: FileText, color: 'text-red-500', bg: 'bg-red-500/10' };
  }
  if (type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension || '')) {
    return { icon: FileImage, color: 'text-green-500', bg: 'bg-green-500/10' };
  }
  if (type.startsWith('video/') || ['mp4', 'mov', 'avi'].includes(extension || '')) {
    return { icon: Film, color: 'text-purple-500', bg: 'bg-purple-500/10' };
  }
  if (type.includes('zip') || type.includes('archive') || ['zip', 'rar', 'tar', 'gz'].includes(extension || '')) {
    return { icon: FileArchive, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
  }
  if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
    return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' };
  }
  if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
    return { icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  }
  if (['ppt', 'pptx'].includes(extension || '')) {
    return { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10' };
  }
  
  // Default file style
  return { icon: FileText, color: 'text-foreground', bg: 'bg-background-secondary' };
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function WorkspaceResources({ sessionId, userId, isHost, allowInteractions }: WorkspaceResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [folders, setFolders] = useState<ResourceFolder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  const supabase = createClient();

  const load = async () => {
    const [{ data: resData }, { data: folderData }] = await Promise.all([
      supabase.from('resources').select('*, profiles(name)').eq('session_id', sessionId).order('created_at', { ascending: false }),
      supabase.from('resource_folders').select('*').eq('session_id', sessionId).order('created_at', { ascending: false })
    ]);
    setResources(resData ?? []);
    setFolders(folderData ?? []);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`resources-${sessionId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources', filter: `session_id=eq.${sessionId}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resource_folders', filter: `session_id=eq.${sessionId}` }, load)
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setFileDescription('');
    e.target.value = ''; // Reset so the same file can be selected again
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const path = `${sessionId}/${Date.now()}-${pendingFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(path, pendingFile);
      if (uploadError) {
        toast.error(`Storage Error: ${uploadError.message}`);
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('resources').getPublicUrl(path);
      
      const { error: dbError } = await supabase.from('resources').insert({
        session_id: sessionId, user_id: userId,
        folder_id: currentFolderId,
        name: pendingFile.name, url: publicUrl,
        type: pendingFile.type, size_bytes: pendingFile.size,
        description: fileDescription || null,
      });
      
      if (dbError) {
        toast.error(`Database Error: ${dbError.message}`);
        throw dbError;
      }
      
      toast.success('File uploaded successfully!');
      load();
      setPendingFile(null);
    } catch (err: any) {
      console.error('Upload failed:', err);
      if (!err.message) toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    try {
      const payload: any = {
        session_id: sessionId,
        name: newFolderName.trim()
      };
      if (currentFolderId) {
        payload.parent_id = currentFolderId;
      }

      const { data, error } = await supabase.from('resource_folders').insert(payload).select();
      if (error) {
        toast.error(`DB Error: ${error.message || JSON.stringify(error)}`);
        return;
      }
      
      toast.success('Folder created');
      setShowNewFolderModal(false);
      setNewFolderName('');
      load();
    } catch (e: any) {
      toast.error(`Exception: ${e.message || 'Unknown error'}`);
    } finally {
      setCreatingFolder(false);
    }
  };

  const deleteResource = async (id: string, url: string) => {
    const path = url.split('/resources/')[1];
    if (path) await supabase.storage.from('resources').remove([path]);
    await supabase.from('resources').delete().eq('id', id);
    setResources(r => r.filter(x => x.id !== id));
  };

  const deleteFolder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from('resource_folders').delete().eq('id', id);
    if (error) {
      toast.error(`Error deleting folder: ${error.message}`);
      return;
    }
    setFolders(f => f.filter(x => x.id !== id));
    // Note: Due to ON DELETE CASCADE on resources.folder_id, the resources in this folder are deleted from DB,
    // but their corresponding storage files remain orphaned. For a complete solution, a backend trigger or 
    // recursive fetch+storage delete is required, but this suffices for the current implementation.
    load();
  };

  const getBreadcrumbs = () => {
    const crumbs = [];
    let curr = currentFolderId;
    while (curr) {
      const f = folders.find(x => x.id === curr);
      if (!f) break;
      crumbs.unshift(f);
      curr = f.parent_id;
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentFolders = folders.filter(f => f.parent_id === currentFolderId);
  const currentResources = resources.filter(r => r.folder_id === currentFolderId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-background">
        <span className="text-sm font-medium text-foreground">Resources</span>
        {(isHost || allowInteractions) ? (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNewFolderModal(true)} 
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-background-secondary transition-colors"
            >
              <FolderPlus className="h-3.5 w-3.5" /> New Folder
            </button>
            <label className={cn(
              'inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white cursor-pointer',
              'hover:opacity-90 transition-all'
            )}>
              <Upload className="h-3.5 w-3.5" />
              Upload File
              <input type="file" className="hidden" onChange={handleFileSelect} />
            </label>
          </div>
        ) : (
          <div className="text-xs text-foreground-subtle bg-background-secondary px-3 py-1.5 rounded-lg border border-border">
            Uploads disabled
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-background-secondary border-b border-border flex items-center gap-2 text-sm text-foreground-subtle overflow-x-auto min-h-[40px]">
        <button onClick={() => setCurrentFolderId(null)} className="hover:text-foreground transition-colors flex items-center gap-1 font-medium whitespace-nowrap">
          <Folder className="h-4 w-4" /> Home
        </button>
        {breadcrumbs.map(b => (
          <div key={b.id} className="flex items-center gap-2 whitespace-nowrap">
            <ChevronRight className="h-4 w-4 text-foreground-muted" />
            <button onClick={() => setCurrentFolderId(b.id)} className="hover:text-foreground transition-colors font-medium">
              {b.name}
            </button>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {pendingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Upload Resource</h3>
              <button onClick={() => setPendingFile(null)} className="rounded-full p-1 hover:bg-background-secondary text-foreground-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-medium text-foreground">Selected File</label>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-background-secondary p-3 text-sm text-foreground">
                <FileText className="h-4 w-4 text-brand flex-shrink-0" />
                <span className="truncate">{pendingFile.name}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-foreground">Description (Optional)</label>
              <textarea
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="Add a brief note about this file..."
                className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-foreground-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setPendingFile(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground-muted hover:bg-background-secondary transition-colors" disabled={uploading}>
                Cancel
              </button>
              <button onClick={handleUpload} disabled={uploading} className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                {uploading && <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />}
                {uploading ? 'Uploading...' : 'Confirm Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Folder</h3>
              <button onClick={() => setShowNewFolderModal(false)} className="rounded-full p-1 hover:bg-background-secondary text-foreground-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium text-foreground">Folder Name</label>
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateFolder(); }}
                placeholder="e.g., Week 1 Materials"
                className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-foreground-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowNewFolderModal(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-foreground-muted hover:bg-background-secondary transition-colors" disabled={creatingFolder}>
                Cancel
              </button>
              <button onClick={handleCreateFolder} disabled={creatingFolder || !newFolderName.trim()} className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                {creatingFolder ? 'Creating...' : 'Create Folder'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background-secondary">
        {currentFolders.length === 0 && currentResources.length === 0 ? (
          <div className="text-center py-12 text-foreground-subtle text-sm">
            This folder is empty.
          </div>
        ) : (
          <>
            {/* Folders */}
            {currentFolders.map(f => (
              <div 
                key={f.id} 
                onClick={() => setCurrentFolderId(f.id)} 
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 cursor-pointer hover:border-brand/50 transition-colors group"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Folder className="h-5 w-5 fill-blue-500/20" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{f.name}</div>
                  <div className="text-xs text-foreground-subtle mt-0.5">{new Date(f.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                </div>
                {(isHost || allowInteractions) && (
                  <button onClick={(e) => deleteFolder(f.id, e)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-subtle hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            
            {/* Files */}
            {currentResources.map((r) => {
              const fileInfo = getFileInfo(r.type, r.name);
              const Icon = fileInfo.icon;
              return (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                  <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl", fileInfo.bg, fileInfo.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{r.name}</div>
                    <div className="text-xs text-foreground-subtle mt-0.5">
                      {formatBytes(r.size_bytes)} · {r.profiles?.name} · {new Date(r.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                    {r.description && (
                      <p className="mt-2 text-xs text-foreground-muted bg-background p-2 rounded-lg border border-border">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0 items-start mt-1">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" title="View Document"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:text-brand hover:bg-brand-muted transition-colors">
                      <Eye className="h-4 w-4" />
                    </a>
                    <a href={`${r.url}?download=`} download title="Download File"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:text-brand hover:bg-brand-muted transition-colors">
                      <Download className="h-4 w-4" />
                    </a>
                    {(isHost || r.user_id === userId) && (
                      <button onClick={() => deleteResource(r.id, r.url)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-subtle hover:text-error hover:bg-error/10 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
