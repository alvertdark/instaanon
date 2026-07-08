import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchProfile, fetchPosts, formatCount } from '@/lib/instagram';
import { generateProfileMetadata, getBreadcrumbSchema, SITE_URL } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdSidebar } from '@/components/ads/AdSidebar';
import { ProfileGrid } from '@/components/profile/ProfileGrid';
import { AvatarViewer } from '@/components/profile/AvatarViewer';
import styles from './page.module.css';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return generateProfileMetadata(username);
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9._]/g, '');

  if (!cleanUsername || cleanUsername.length < 1) notFound();

  let profile;
  let posts;

  if (cleanUsername === 'alinnarosee') {
    // Modo estático para este perfil (bypass del bloqueo de Vercel)
    const staticData = require('@/data/alinnarosee2.json');
    profile = staticData.profile;
    posts = staticData.posts;
  } else {
    // Modo dinámico normal
    [profile, posts] = await Promise.all([
      fetchProfile(cleanUsername),
      fetchPosts(cleanUsername),
    ]);
  }

  if (!profile) notFound();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Inicio', url: SITE_URL },
    { name: 'Perfiles', url: `${SITE_URL}/profile` },
    { name: `@${cleanUsername}` },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumb} />

      <div className="container">
        {/* Breadcrumb nav — SEO */}
        <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
          <ol>
            <li><Link href="/">Inicio</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/">Perfiles</Link></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">@{cleanUsername}</li>
          </ol>
        </nav>

        {/* Top Banner Ad */}
        <AdBanner slot="top-banner" format="horizontal" style={{ marginBottom: '1.5rem' }} />

        <div className={styles.layout}>
          {/* Main Content */}
          <div className={styles.main}>
            {/* Profile Card */}
            <div className={styles.profileCard}>
              {/* Avatar */}
              <div className={styles.avatarWrapper}>
                <AvatarViewer
                  profilePicUrl={profile.profile_pic_url}
                  username={cleanUsername}
                />
              </div>

              {/* Profile Info */}
              <div className={styles.profileInfo}>
                <div className={styles.profileHeader}>
                  <h1 className={styles.profileName}>
                    {profile.full_name || cleanUsername}
                    {profile.is_verified && (
                      <span className={styles.verified} title="Cuenta verificada" aria-label="Verificado">✓</span>
                    )}
                  </h1>
                  <span className={styles.username}>@{cleanUsername}</span>
                  {profile.category && (
                    <span className={`badge badge-purple ${styles.category}`}>{profile.category}</span>
                  )}
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <strong>{formatCount(profile.media_count)}</strong>
                    <span>publicaciones</span>
                  </div>
                  <div className={styles.stat}>
                    <strong>{formatCount(profile.followers_count)}</strong>
                    <span>seguidores</span>
                  </div>
                  <div className={styles.stat}>
                    <strong>{formatCount(profile.following_count)}</strong>
                    <span>seguidos</span>
                  </div>
                </div>

                {/* Bio */}
                {profile.biography && (
                  <p className={styles.bio}>{profile.biography}</p>
                )}

                {/* External URL */}
                {profile.external_url && (
                  <a
                    href={profile.external_url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className={styles.externalUrl}
                  >
                    🔗 {profile.external_url.replace(/^https?:\/\//, '')}
                  </a>
                )}

                {/* Privacy status */}
                {profile.is_private && (
                  <div className={styles.privateNotice}>
                    🔒 Este perfil es privado. Solo se muestran datos públicos.
                  </div>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className={styles.quickLinks}>
              <Link href={`/stories/${cleanUsername}`} className={styles.quickLink} id={`stories-link-${cleanUsername}`}>
                📖 Ver historias
              </Link>
              <Link href={`/highlights/${cleanUsername}`} className={styles.quickLink} id={`highlights-link-${cleanUsername}`}>
                ⭐ Ver destacados
              </Link>
              <Link href={`/reels/${cleanUsername}`} className={styles.quickLink} id={`reels-link-${cleanUsername}`}>
                🎬 Ver reels
              </Link>
            </div>

            {/* Posts Grid */}
            <Suspense fallback={<div className={styles.loading}><div className="spinner" /></div>}>
              <ProfileGrid posts={posts} username={cleanUsername} />
            </Suspense>
          </div>

          {/* Sidebar Ad */}
          <AdSidebar slot="sidebar-1" />
        </div>

        {/* Bottom Banner */}
        <AdBanner slot="bottom-banner" format="horizontal" style={{ marginTop: '2rem' }} />

        {/* SEO content block */}
        <div className={styles.seoBlock}>
          <h2>Ver el perfil de @{cleanUsername} de forma anónima</h2>
          <p>
            Con InstaAnon puedes ver todas las publicaciones, historias y destacados de @{cleanUsername}{' '}
            en Instagram de forma completamente anónima y gratuita. No necesitas tener cuenta de Instagram
            para acceder al contenido. El usuario nunca sabrá que visitaste su perfil.
          </p>
        </div>
      </div>
    </>
  );
}
