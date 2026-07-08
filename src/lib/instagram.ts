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

// ── Configuración Scraping Directo de Instagram ────────────────
let SESSION_ID = '';
try {
  SESSION_ID = decodeURIComponent(process.env.INSTAGRAM_SESSION_ID || '');
} catch (e) {
  SESSION_ID = process.env.INSTAGRAM_SESSION_ID || '';
}
const USER_ID = process.env.INSTAGRAM_USER_ID || '';
const BASE_URL = 'https://www.instagram.com';
const AUTH_BASE_URL = 'https://i.instagram.com';

// Convierte una URL del CDN de Instagram en una URL de nuestro proxy local para saltarse el bloqueo
export function getProxyUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  // Dejar URLs del mock intactas
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('https://ui-avatars.com') ||
    trimmed.startsWith('https://picsum.photos') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }
  return `/api/proxy?url=${encodeURIComponent(trimmed)}`;
}

export async function igFetchPublic(path: string) {
  let cookieString = '';
  if (SESSION_ID) {
    cookieString = `sessionid=${SESSION_ID};`;
    if (USER_ID) {
      cookieString += ` ds_user_id=${USER_ID};`;
    }
  }

  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'X-IG-App-ID': '936619743392459', // ID oficial de Instagram Web
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://www.instagram.com/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
  };

  if (cookieString) {
    headers['Cookie'] = cookieString;
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers,
      next: { revalidate: 300 }, // Cache de 5 minutos
    });

    if (!res.ok) {
      console.warn(`Instagram public fetch error (${res.status}):`, res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn('Error fetching from Instagram publicly:', error);
    return null;
  }
}

async function igFetchAuth(path: string) {
  if (!SESSION_ID) {
    console.warn('Instagram Custom Scraper: No se ha configurado INSTAGRAM_SESSION_ID para llamadas autenticadas.');
    return null;
  }

  // Preparamos la cabecera Cookie
  let cookieString = `sessionid=${SESSION_ID};`;
  if (USER_ID) {
    cookieString += ` ds_user_id=${USER_ID};`;
  }

  try {
    const res = await fetch(`${AUTH_BASE_URL}${path}`, {
      headers: {
        'Cookie': cookieString,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'X-IG-App-ID': '936619743392459',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`Instagram auth fetch error (${res.status}):`, res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn('Error fetching from Instagram with auth:', error);
    return null;
  }
}

// ── Perfil ─────────────────────────────────────────────────────
export async function fetchProfile(username: string): Promise<InstagramProfile | null> {
  // Usar igFetchAuth (API móvil i.instagram.com) en lugar de igFetchPublic (www.instagram.com)
  // porque Vercel está baneado en www.instagram.com, pero i.instagram.com permite consultas
  // si enviamos el User-Agent móvil y los headers correctos.
  const data = await igFetchAuth(`/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`);

  if (!data?.data?.user) return null;

  const u = data.data.user;
  return {
    id: u.id || u.pk || '',
    username: u.username,
    full_name: u.full_name || u.username,
    biography: u.biography || '',
    profile_pic_url: getProxyUrl(u.profile_pic_url_hd || u.profile_pic_url || ''),
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

export async function fetchPosts(username: string): Promise<InstagramPost[]> {
  // Primero obtenemos el profile.id para usar la API móvil que no bloquea el feed
  const profile = await fetchProfile(username);
  if (!profile?.id) return [];

  const data = await igFetchAuth(`/api/v1/feed/user/${profile.id}/`);
  const items: any[] = data?.items || [];

  if (!items.length) {
    return [];
  }

  try {
    return items.map(mapPost);
  } catch (error) {
    console.error('[DEBUG] Error mapping posts:', error);
    return [];
  }
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
        display_url: getProxyUrl(
          sub.image_versions2?.candidates?.[0]?.url ||
          sub.image_versions?.items?.[0]?.url ||
          sub.display_url ||
          sub.display_uri ||
          ''
        ),
        video_url: isVideo ? getProxyUrl(sub.video_versions?.[0]?.url || sub.video_url) : undefined,
      };
    });
  } else if (node.edge_sidecar_to_children?.edges) {
    carousel_media = node.edge_sidecar_to_children.edges.map((edge: any) => {
      const sub = edge.node;
      const isVideo = sub.is_video ?? (sub.__typename === 'GraphVideo');
      return {
        id: sub.id || '',
        is_video: isVideo,
        display_url: getProxyUrl(
          sub.display_url ||
          sub.image_versions2?.candidates?.[0]?.url ||
          sub.image_versions?.items?.[0]?.url ||
          ''
        ),
        video_url: isVideo ? getProxyUrl(sub.video_url || sub.video_versions?.[0]?.url) : undefined,
      };
    });
  }

  const isVideo = !!(node.is_video || node.media_type === 2 || node.__typename === 'GraphVideo');

  return {
    id: node.id || node.pk || '',
    shortcode: node.shortcode || node.code || '',
    thumbnail_url: getProxyUrl(
      node.image_versions2?.candidates?.[0]?.url ||
      node.thumbnail_src ||
      node.display_url ||
      node.image_versions?.items?.[0]?.url ||
      ''
    ),
    display_url: getProxyUrl(
      node.display_url ||
      node.image_versions2?.candidates?.[0]?.url ||
      node.thumbnail_src ||
      node.image_versions?.items?.[0]?.url ||
      ''
    ),
    is_video: isVideo,
    video_url: (node.video_url || node.video_versions?.[0]?.url) ? getProxyUrl(node.video_url || node.video_versions?.[0]?.url) : undefined,
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
  const data = await igFetchAuth(`/api/v1/feed/reels_media/?reel_ids=${encodeURIComponent(userId)}`);

  const reel = data?.reels?.[userId];
  const items: any[] = reel?.items || [];
  if (!items.length) return [];

  return items.map((item: any) => {
    const isVideo = item.media_type === 2 || !!item.video_versions;
    return {
      id: item.id || item.pk || '',
      display_url: getProxyUrl(item.image_versions2?.candidates?.[0]?.url || item.display_url || ''),
      is_video: isVideo,
      video_url: isVideo ? getProxyUrl(item.video_versions?.[0]?.url || item.video_url) : undefined,
      timestamp: item.taken_at ?? (Date.now() / 1000),
      expiry_timestamp: item.expiring_at ?? (Date.now() / 1000 + 86400),
    };
  });
}

// ── Highlights ─────────────────────────────────────────────────
export async function fetchHighlights(username: string): Promise<InstagramHighlight[]> {
  const profile = await fetchProfile(username);
  if (!profile?.id) return [];

  const data = await igFetchAuth(`/api/v1/highlights/${encodeURIComponent(profile.id)}/highlights_tray/`);

  const items: any[] = data?.tray || [];
  if (!items.length) return [];

  return items.map((item: any) => ({
    id: item.id || item.pk || '',
    title: item.title || 'Destacado',
    cover_media_url: getProxyUrl(
      item.cover_media?.cropped_image_version?.url ||
      item.cover_media?.square_cropped_page_indicator_image_version?.url ||
      item.cover_media_url ||
      ''
    ),
    media_count: item.media_count ?? 0,
  }));
}

export async function fetchHighlightDetails(highlightId: string): Promise<InstagramStory[]> {
  if (!highlightId) return [];
  const reelId = highlightId.startsWith('highlight:') ? highlightId : `highlight:${highlightId}`;
  const data = await igFetchAuth(`/api/v1/feed/reels_media/?reel_ids=${encodeURIComponent(reelId)}`);

  const reel = data?.reels?.[reelId];
  const items: any[] = reel?.items || [];
  if (!items.length) return [];

  return items.map((item: any) => {
    const isVideo = item.media_type === 2 || !!item.video_versions;
    return {
      id: item.id || item.pk || '',
      display_url: getProxyUrl(item.image_versions2?.candidates?.[0]?.url || item.display_url || ''),
      is_video: isVideo,
      video_url: isVideo ? getProxyUrl(item.video_versions?.[0]?.url || item.video_url) : undefined,
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



