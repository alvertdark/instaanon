import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchProfile, fetchHighlights } from '@/lib/instagram';
import { HighlightsGrid } from '@/components/profile/HighlightsGrid';
import { generateHighlightsMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdSidebar } from '@/components/ads/AdSidebar';
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo';
import styles from './page.module.css';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return generateHighlightsMetadata(username);
}

export default async function HighlightsPage({ params }: Props) {
  const { username } = await params;
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9._]/g, '');
  if (!cleanUsername) notFound();

  const profile = await fetchProfile(cleanUsername);
  if (!profile) notFound();

  const highlights = await fetchHighlights(profile.username);

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Inicio', url: SITE_URL },
    { name: `@${cleanUsername}`, url: `${SITE_URL}/profile/${cleanUsername}` },
    { name: 'Destacados' },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumb} />
      <div className="container">
        <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
          <ol>
            <li><Link href="/">Inicio</Link></li>
            <li>›</li>
            <li><Link href={`/profile/${cleanUsername}`}>@{cleanUsername}</Link></li>
            <li>›</li>
            <li aria-current="page">Destacados</li>
          </ol>
        </nav>

        <AdBanner slot="top-banner" format="horizontal" style={{ marginBottom: '1.5rem' }} />

        <div className="content-with-sidebar">
          <div>
            <h1 className={styles.title}>
              Destacados de <span className="text-gradient">@{cleanUsername}</span>
            </h1>
            <p className={styles.subtitle}>
              Todos los destacados (highlights) de @{cleanUsername} sin necesidad de cuenta.
            </p>

            {highlights.length === 0 ? (
              <div className={styles.empty}>
                <span>⭐</span>
                <h2>Sin destacados disponibles</h2>
                <p>@{cleanUsername} no tiene destacados públicos o el perfil es privado.</p>
                <Link href={`/profile/${cleanUsername}`} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                  Ver perfil de @{cleanUsername}
                </Link>
              </div>
            ) : (
              <HighlightsGrid
                highlights={highlights}
                username={cleanUsername}
                profilePic={profile.profile_pic_url}
              />
            )}

            <AdBanner slot="bottom-banner" format="horizontal" style={{ marginTop: '2rem' }} />

            <div className={styles.seoBlock}>
              <h2>Ver destacados de @{cleanUsername} sin cuenta de Instagram</h2>
              <p>
                Con InstaAnon puedes ver todos los álbumes de destacados de @{cleanUsername} de Instagram
                de forma anónima. Accede a sus historias guardadas sin necesidad de registrarte.
              </p>
            </div>
          </div>

          <AdSidebar slot="sidebar-1" />
        </div>
      </div>
    </>
  );
}
