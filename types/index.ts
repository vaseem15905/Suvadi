// ============================================================
// User & Profile Types
// ============================================================

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  organization: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// ============================================================
// Session Types
// ============================================================

export type SessionVisibility = 'public' | 'private';
export type SessionStatus = 'active' | 'ended' | 'archived';
export type MemberRole = 'host' | 'participant' | 'guest';

export interface Session {
  id: string;
  title: string;
  description: string | null;
  banner_url: string | null;
  cover_url: string | null;
  join_code: string;
  visibility: SessionVisibility;
  status: SessionStatus;
  host_id: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  host?: Profile;
  member_count?: number;
}

export interface SessionMember {
  id: string;
  session_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  // Joined fields
  profile?: Profile;
}

// ============================================================
// Content Block Types
// ============================================================

export type BlockType =
  | 'rich-text'
  | 'markdown'
  | 'code'
  | 'image'
  | 'pdf'
  | 'video'
  | 'link'
  | 'checklist'
  | 'divider'
  | 'file';

export interface Block {
  id: string;
  session_id: string;
  type: BlockType;
  content: Record<string, unknown>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  order: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Resource Types
// ============================================================

export type ResourceType = 'pdf' | 'ppt' | 'zip' | 'image' | 'code' | 'other';

export interface Resource {
  id: string;
  session_id: string;
  name: string;
  url: string;
  type: ResourceType;
  size: number;
  uploaded_by: string;
  created_at: string;
  // Joined fields
  uploader?: Profile;
}

// ============================================================
// Question Types
// ============================================================

export interface Question {
  id: string;
  session_id: string;
  content: string;
  asked_by: string;
  is_pinned: boolean;
  is_resolved: boolean;
  answer: string | null;
  upvotes: number;
  created_at: string;
  // Joined fields
  asker?: Profile;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  question_id: string;
  content: string;
  created_by: string;
  created_at: string;
  // Joined fields
  author?: Profile;
}

// ============================================================
// Announcement Types
// ============================================================

export interface Announcement {
  id: string;
  session_id: string;
  content: string;
  created_by: string;
  created_at: string;
  // Joined fields
  author?: Profile;
}

// ============================================================
// Notification Types
// ============================================================

export type NotificationType =
  | 'session_invite'
  | 'question_asked'
  | 'announcement'
  | 'resource_uploaded'
  | 'mention';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  session_id: string | null;
  created_at: string;
}

// ============================================================
// Contact Form Types
// ============================================================

export interface ContactFormData {
  name: string;
  email: string;
  organization: string;
  subject: string;
  message: string;
}
