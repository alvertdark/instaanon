// lib/instagram.ts
// Instagram data fetching via Scrape Creators API
// Docs: https://docs.scrapecreators.com

export interface InstagramProfile {
  id: string;
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
  bio_links?: { title: string; url: string }[];
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
  carousel_media?: {
    id: string;
    is_video: boolean;
    display_url: string;
    video_url?: string;
  }[];
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

// ── Configuración Scrape Creators ──────────────────────────────
const API_KEY = process.env.SCRAPECREATORS_API_KEY || '';
const BASE_URL = 'https://api.scrapecreators.com';

async function scFetch(path: string) {
  if (!API_KEY) return null;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'x-api-key': API_KEY,
      },
      next: { revalidate: 300 }, // Cache 5 minutos
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success) return null;
    return json;
  } catch (error) {
    console.error('Error fetching from Scrape Creators API:', error);
    return null;
  }
}

// ── Perfil ─────────────────────────────────────────────────────
export async function fetchProfile(username: string): Promise<InstagramProfile | null> {
  const data = await scFetch(`/v1/instagram/profile?handle=${encodeURIComponent(username)}&trim=true`);

  if (!data?.data?.user) return getMockProfile(username);

  const u = data.data.user;
  return {
    id: u.id || u.pk || '',
    username: u.username,
    full_name: u.full_name || u.username,
    biography: u.biography || '',
    profile_pic_url: u.profile_pic_url_hd || u.profile_pic_url || '',
    followers_count: u.edge_followed_by?.count ?? u.follower_count ?? 0,
    following_count: u.edge_follow?.count ?? u.following_count ?? 0,
    media_count: u.edge_owner_to_timeline_media?.count ?? u.media_count ?? 0,
    is_private: u.is_private ?? false,
    is_verified: u.is_verified ?? false,
    external_url: u.external_url,
    category: u.category_name,
    bio_links: u.bio_links?.map((l: any) => ({ title: l.title || '', url: l.url || '' })),
  };
}

// ── Posts ──────────────────────────────────────────────────────
export async function fetchPosts(username: string): Promise<InstagramPost[]> {
  const data = await scFetch(`/v2/instagram/user/posts?handle=${encodeURIComponent(username)}`);

  const items: any[] = data?.items || data?.data?.items || data?.data?.edges?.map((e: any) => e.node) || [];

  if (!items.length) return getMockPosts();

  return items.map(mapPost);
}

function mapPost(item: any): InstagramPost {
  const node = item.node ?? item;

  // Extraer carrusel si está presente
  let carousel_media: any[] | undefined = undefined;
  if (node.carousel_media && node.carousel_media.length > 0) {
    carousel_media = node.carousel_media.map((sub: any) => {
      const isVideo = sub.media_type === 2 || !!sub.video_versions;
      return {
        id: sub.id || sub.pk || '',
        is_video: isVideo,
        display_url: sub.image_versions2?.candidates?.[0]?.url || sub.display_url || sub.display_uri || '',
        video_url: isVideo ? (sub.video_versions?.[0]?.url || sub.video_url) : undefined,
      };
    });
  } else if (node.edge_sidecar_to_children?.edges) {
    carousel_media = node.edge_sidecar_to_children.edges.map((edge: any) => {
      const sub = edge.node;
      const isVideo = sub.is_video ?? (sub.__typename === 'GraphVideo');
      return {
        id: sub.id || '',
        is_video: isVideo,
        display_url: sub.display_url || '',
        video_url: isVideo ? sub.video_url : undefined,
      };
    });
  }

  const isVideo = !!(node.is_video || node.media_type === 2 || node.__typename === 'GraphVideo');

  return {
    id: node.id || node.pk || '',
    shortcode: node.shortcode || node.code || '',
    thumbnail_url:
      node.image_versions2?.candidates?.[0]?.url ||
      node.thumbnail_src ||
      node.display_url ||
      node.image_versions?.items?.[0]?.url ||
      '',
    display_url:
      node.display_url ||
      node.image_versions2?.candidates?.[0]?.url ||
      node.thumbnail_src ||
      node.image_versions?.items?.[0]?.url ||
      '',
    is_video: isVideo,
    video_url: node.video_url || node.video_versions?.[0]?.url,
    like_count:
      node.like_count ??
      node.edge_liked_by?.count ??
      node.edge_media_preview_like?.count ??
      0,
    comment_count:
      node.comment_count ??
      node.edge_media_to_comment?.count ??
      0,
    caption:
      node.caption?.text ||
      node.edge_media_to_caption?.edges?.[0]?.node?.text ||
      node.caption ||
      undefined,
    timestamp:
      node.taken_at_timestamp ?? node.taken_at ?? Date.now() / 1000,
    carousel_media,
  };
}

// ── Stories ────────────────────────────────────────────────────
export async function fetchStories(userId: string): Promise<InstagramStory[]> {
  if (!userId) return [];
  const data = await scFetch(`/v1/instagram/user/stories?user_id=${encodeURIComponent(userId)}`);

  const items: any[] = data?.reel?.items || data?.items || data?.data?.items || [];
  if (!items.length) return [];

  return items.map((item: any) => {
    const isVideo = item.media_type === 2 || !!item.video_versions;
    return {
      id: item.id || item.pk || '',
      display_url: item.image_versions2?.candidates?.[0]?.url || item.display_url || '',
      is_video: isVideo,
      video_url: isVideo ? (item.video_versions?.[0]?.url || item.video_url) : undefined,
      timestamp: item.taken_at ?? (Date.now() / 1000),
      expiry_timestamp: item.expiring_at ?? (Date.now() / 1000 + 86400),
    };
  });
}

// ── Highlights ─────────────────────────────────────────────────
export async function fetchHighlights(username: string): Promise<InstagramHighlight[]> {
  const data = await scFetch(`/v1/instagram/user/highlights?handle=${encodeURIComponent(username)}`);

  const items: any[] = data?.highlights || data?.data?.items || data?.data?.tray || [];
  if (!items.length) return [];

  return items.map((item: any) => ({
    id: item.id || item.pk || '',
    title: item.title || 'Destacado',
    cover_media_url:
      item.cover_media?.cropped_image_version?.url ||
      item.cover_media_url ||
      item.cover?.url ||
      '',
    media_count: item.media_count ?? 0,
  }));
}

export async function fetchHighlightDetails(highlightId: string): Promise<InstagramStory[]> {
  if (!highlightId) return [];
  const data = await scFetch(`/v1/instagram/user/highlight/detail?id=${encodeURIComponent(highlightId)}`);

  const items: any[] = data?.items || data?.data?.items || [];
  if (!items.length) return [];

  return items.map((item: any) => {
    const isVideo = item.media_type === 2 || !!item.video_versions;
    return {
      id: item.id || item.pk || '',
      display_url: item.image_versions2?.candidates?.[0]?.url || item.display_url || '',
      is_video: isVideo,
      video_url: isVideo ? (item.video_versions?.[0]?.url || item.video_url) : undefined,
      timestamp: item.taken_at ?? (Date.now() / 1000),
      expiry_timestamp: item.expiring_at ?? (Date.now() / 1000 + 86400),
    };
  });
}

// ── Utilidades ─────────────────────────────────────────────────
export function formatCount(n: number): string {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// ── Mock data (sin API key o en desarrollo) ────────────────────
function getMockProfile(username: string): InstagramProfile {
  return {
    id: 'mock-user-id',
    username,
    full_name: username.charAt(0).toUpperCase() + username.slice(1),
    biography:
      '📍 Este es un perfil de ejemplo para desarrollo.\n🌟 Aquí aparecerá la bio real del usuario.',
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

