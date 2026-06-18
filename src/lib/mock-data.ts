export type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: "New" | "Like New" | "Good" | "Fair";
  image: string;
  images?: string[];
  description: string;
  seller: { id: string; name: string; rating: number; avatar: string };
  createdAt: string;
};

export type Category = { id: string; name: string; icon: string; count: number };

export const categories: Category[] = [
  { id: "books", name: "Books", icon: "📚", count: 124 },
  { id: "electronics", name: "Electronics", icon: "💻", count: 89 },
  { id: "furniture", name: "Furniture", icon: "🛋️", count: 46 },
  { id: "clothing", name: "Clothing", icon: "👕", count: 73 },
  { id: "tickets", name: "Tickets", icon: "🎫", count: 31 },
  { id: "services", name: "Services", icon: "🛠️", count: 58 },
  { id: "housing", name: "Housing", icon: "🏠", count: 22 },
  { id: "other", name: "Other", icon: "✨", count: 41 },
];

const pics = [
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
  "https://images.unsplash.com/photo-1503602642458-232111445657?w=600",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600",
];

const titles = [
  "MacBook Pro 13\" 2021",
  "Calculus Textbook 8th Ed.",
  "IKEA Desk Lamp",
  "Wireless Headphones",
  "Mini Fridge",
  "Vintage Denim Jacket",
  "Football Match Tickets",
  "Bike — Hybrid 26\"",
  "Standing Desk",
  "iPad Air 4th Gen",
  "Organic Chemistry Notes",
  "Coffee Maker",
];

const sellers = [
  { id: "u1", name: "Alex Morgan", rating: 4.9, avatar: "https://i.pravatar.cc/100?img=1" },
  { id: "u2", name: "Priya Shah", rating: 4.7, avatar: "https://i.pravatar.cc/100?img=5" },
  { id: "u3", name: "Marco Diaz", rating: 4.8, avatar: "https://i.pravatar.cc/100?img=12" },
  { id: "u4", name: "Yuki Tanaka", rating: 4.6, avatar: "https://i.pravatar.cc/100?img=20" },
];

export const listings: Listing[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `l${i + 1}`,
  title: titles[i % titles.length],
  price: [25, 45, 80, 120, 199, 350, 599, 12][i % 8],
  category: categories[i % categories.length].id,
  condition: (["New", "Like New", "Good", "Fair"] as const)[i % 4],
  image: pics[i % pics.length],
  images: [pics[i % pics.length], pics[(i + 1) % pics.length], pics[(i + 2) % pics.length]],
  description:
    "Selling because I'm graduating. Lightly used, well taken care of. Pickup on campus or local delivery.",
  seller: sellers[i % sellers.length],
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

export const conversations = [
  { id: "c1", name: "Alex Morgan", avatar: sellers[0].avatar, last: "Is it still available?", time: "2m", unread: 2 },
  { id: "c2", name: "Priya Shah", avatar: sellers[1].avatar, last: "Great, see you at 5!", time: "1h", unread: 0 },
  { id: "c3", name: "Marco Diaz", avatar: sellers[2].avatar, last: "Sent the photos", time: "3h", unread: 1 },
  { id: "c4", name: "Yuki Tanaka", avatar: sellers[3].avatar, last: "Thank you 🙏", time: "1d", unread: 0 },
];

export const messages = [
  { id: "m1", from: "them", text: "Hey! Is the MacBook still available?", time: "10:24" },
  { id: "m2", from: "me", text: "Yes it is! Want to meet today?", time: "10:25" },
  { id: "m3", from: "them", text: "Sure, library at 5?", time: "10:26" },
  { id: "m4", from: "me", text: "Perfect 👍", time: "10:27" },
];

export const notifications = [
  { id: "n1", group: "Today", title: "New message from Alex", desc: "Is it still available?", unread: true, time: "2m" },
  { id: "n2", group: "Today", title: "Your listing was approved", desc: "MacBook Pro 13\" 2021", unread: true, time: "1h" },
  { id: "n3", group: "Yesterday", title: "Price drop on saved item", desc: "Standing Desk now $120", unread: false, time: "1d" },
  { id: "n4", group: "Earlier", title: "New review received", desc: "Priya left you 5 stars", unread: false, time: "3d" },
];

export const adminUsers = [
  { id: "u1", name: "Alex Morgan", email: "alex@uni.edu", role: "user", status: "active", joined: "2024-09-12" },
  { id: "u2", name: "Priya Shah", email: "priya@uni.edu", role: "user", status: "active", joined: "2024-08-04" },
  { id: "u3", name: "Marco Diaz", email: "marco@uni.edu", role: "moderator", status: "active", joined: "2024-07-21" },
  { id: "u4", name: "Yuki Tanaka", email: "yuki@uni.edu", role: "user", status: "suspended", joined: "2024-06-10" },
];

export const apiKeys = [
  { id: "k1", provider: "OpenAI", name: "Primary", priority: 1, status: "active", usage: 12480, failures: 2, lastUsed: "2m ago" },
  { id: "k2", provider: "Anthropic", name: "Fallback", priority: 2, status: "active", usage: 4210, failures: 0, lastUsed: "1h ago" },
  { id: "k3", provider: "Google", name: "Vision API", priority: 3, status: "disabled", usage: 0, failures: 12, lastUsed: "3d ago" },
];

export const reports = [
  { id: "r1", target: "MacBook Pro 13\"", reason: "Suspicious price", reporter: "u2", status: "open", time: "2h" },
  { id: "r2", target: "Bike — Hybrid 26\"", reason: "Wrong category", reporter: "u4", status: "open", time: "5h" },
  { id: "r3", target: "Coffee Maker", reason: "Spam content", reporter: "u1", status: "resolved", time: "1d" },
];

export const analyticsData = Array.from({ length: 12 }).map((_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  users: 200 + i * 80 + Math.round(Math.random() * 50),
  listings: 120 + i * 60 + Math.round(Math.random() * 40),
  messages: 500 + i * 220 + Math.round(Math.random() * 100),
}));
