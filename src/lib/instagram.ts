// lib/instagram.ts
// Instagram data fetching via RapidAPI

export interface InstagramProfile {
  username: string;
  full_name: string;
  biography: string;
  profile_pic_url: string;
  followers_count: number;
  following_count: number;
  media_count: number;
  is_private: boolean;
  is_verified: boolean;
  external_url?: string;
  category?: string;
}

export interface InstagramPost {
  id: string;
  shortcode: string;
  thumbnail_url: string;
  display_url: string;
  is_video: boolean;
  video_url?: string;
  like_count: number;
  comment_count: number;
  caption?: string;
  timestamp: number;
}

export interface InstagramStory {
  id: string;
  display_url: string;
  is_video: boolean;
  video_url?: string;
  timestamp: number;
  expiry_timestamp: number;
}

export interface InstagramHighlight {
  id: string;
  title: string;
  cover_media_url: string;
  media_count: number;
}

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'instagram-scraper-api2.p.rapidapi.com';

async function instagramFetch(path: string) {
  if (!RAPIDAPI_KEY) {
    // Return mock data in development
    return null;
  }
  const res = await fetch(`https://${RAPIDAPI_HOST}${path}`, {
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST,
    },
    next: { revalidate: 300 }, // Cache 5 minutes
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchProfile(username: string): Promise<InstagramProfile | null> {
  const data = await instagramFetch(`/v1/info?username_or_id_or_url=${username}`);
  if (!data?.data) return getMockProfile(username);

  const d = data.data;
  return {
    username: d.username,
    full_name: d.full_name || d.username,
    biography: d.biography || '',
    profile_pic_url: d.profile_pic_url_hd || d.profile_pic_url || '',
    followers_count: d.follower_count || d.edge_followed_by?.count || 0,
    following_count: d.following_count || d.edge_follow?.count || 0,
    media_count: d.media_count || 0,
    is_private: d.is_private || false,
    is_verified: d.is_verified || false,
    external_url: d.external_url,
    category: d.category,
  };
}

export async function fetchPosts(username: string): Promise<InstagramPost[]> {
  const data = await instagramFetch(`/v1/posts?username_or_id_or_url=${username}`);
  if (!data?.data?.items) return getMockPosts();

  return data.data.items.map((item: any) => ({
    id: item.id,
    shortcode: item.code,
    thumbnail_url: item.image_versions?.items?.[0]?.url || item.thumbnail_url || '',
    display_url: item.image_versions?.items?.[0]?.url || '',
    is_video: item.media_type === 2,
    video_url: item.video_versions?.[0]?.url,
    like_count: item.like_count || 0,
    comment_count: item.comment_count || 0,
    caption: item.caption?.text,
    timestamp: item.taken_at || Date.now() / 1000,
  }));
}

export async function fetchStories(username: string): Promise<InstagramStory[]> {
  const data = await instagramFetch(`/v1/stories?username_or_id_or_url=${username}`);
  if (!data?.data?.items) return [];

  return data.data.items.map((item: any) => ({
    id: item.id,
    display_url: item.image_versions?.items?.[0]?.url || '',
    is_video: item.media_type === 2,
    video_url: item.video_versions?.[0]?.url,
    timestamp: item.taken_at || Date.now() / 1000,
    expiry_timestamp: item.expiring_at || Date.now() / 1000 + 86400,
  }));
}

export async function fetchHighlights(username: string): Promise<InstagramHighlight[]> {
  const data = await instagramFetch(`/v1/highlights?username_or_id_or_url=${username}`);
  if (!data?.data?.items) return [];

  return data.data.items.map((item: any) => ({
    id: item.id,
    title: item.title || 'Destacado',
    cover_media_url: item.cover_media?.cropped_image_version?.url || '',
    media_count: item.media_count || 0,
  }));
}

// Format numbers nicely: 1200000 → 1.2M
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// ── Mock data for development (no API key needed) ──────────
function getMockProfile(username: string): InstagramProfile {
  return {
    username,
    full_name: username.charAt(0).toUpperCase() + username.slice(1),
    biography: '📍 Este es un perfil de ejemplo para desarrollo.\n🌟 Aquí aparecerá la bio real del usuario.',
    profile_pic_url: `https://ui-avatars.com/api/?name=${username}&background=8B5CF6&color=fff&size=200`,
    followers_count: 125400,
    following_count: 892,
    media_count: 248,
    is_private: false,
    is_verified: false,
    external_url: '',
  };
}

function getMockPosts(): InstagramPost[] {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `mock-${i}`,
    shortcode: `abc${i}`,
    thumbnail_url: `https://picsum.photos/seed/${i + 10}/400/400`,
    display_url: `https://picsum.photos/seed/${i + 10}/800/800`,
    is_video: i % 4 === 3,
    like_count: Math.floor(Math.random() * 50000) + 1000,
    comment_count: Math.floor(Math.random() * 500) + 10,
    caption: i === 0 ? '¡Nueva publicación! 🎉 #instagram #photography' : undefined,
    timestamp: Date.now() / 1000 - i * 86400,
  }));
}
