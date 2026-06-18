export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar: string | null;
  role: "student" | "moderator" | "admin";
  is_suspended: boolean;
  is_verified: boolean;
  university: string | null;
  department: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  status: boolean;
}

export interface ListingImage {
  id: number;
  url: string; // Backend returns 'url' mapped from 'image_url'
  display_order: number;
}

export interface AiModerationLog {
  risk_level: "low" | "medium" | "high";
  risk_score: number;
  result: "approved" | "rejected" | "flagged";
  summary: string | null;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  negotiable: boolean;
  status: "pending" | "published" | "paused" | "sold" | "archived" | "rejected";
  rejection_reason?: string | null;
  expiry_days: number;
  expiry_date: string;
  sold_at: string | null;
  published_at: string | null;
  view_count: number;
  location: string | null;
  created_at: string;
  updated_at: string;

  // Relations (loaded dynamically)
  category?: Partial<Category>;
  user?: Partial<User>;
  images?: ListingImage[];
  ai_moderation?: AiModerationLog | null;
}

export interface Conversation {
  id: number;
  listing_id: number;
  buyer_id: number;
  seller_id: number;
  status: string;
  updated_at: string;

  // Relations
  listing?: Listing;
  buyer?: User;
  seller?: User;
  messages?: Message[];
  unread_count?: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  status: "sent" | "delivered" | "read";
  created_at: string;
}

export interface Report {
  id: number;
  reporter_id: number;
  report_type: string;
  target_id: number;
  reason: string;
  description: string | null;
  status: "open" | "investigating" | "resolved" | "dismissed";
  created_at: string;
  reporter?: User;
}

export interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: any;
  read_at: string | null;
  created_at: string;
}

export interface DashboardStats {
  users: number;
  active_users: number;
  suspended_users: number;
  listings: number;
  published_listings: number;
  pending_listings: number;
  conversations: number;
  reports: number;
  open_reports: number;
}

export interface ApiKey {
  id: number;
  provider: string;
  key_name: string;
  priority: number;
  status: boolean;
  requests_today: number;
  success_count: number;
  failure_count: number;
}
