import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchProfile, fetchStories } from '@/lib/instagram';
import { generateStoriesMetadata, getBreadcrumbSchema, SITE_URL } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdBanner } from '@/components/ads/AdBanner';
import { AdSidebar } from '@/components/ads/AdSidebar';
import styles from './page.module.css';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return generateStoriesMetadata(username);
}

export default async function StoriesPage({ params }: Props) {
  const { username } = await params;
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9._]/g, '');
  if (!cleanUsername) notFound();

  const profile = await fetchProfile(cleanUsername);
  if (!profile) notFound();

  const stories = await fetchStories(profile.id);

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Inicio', url: SITE_URL },
    { name: `@${cleanUsername}`, url: `${SITE_URL}/profile/${cleanUsername}` },
    { name: 'Historias' },
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
            <li aria-current="page">Historias</li>
          </ol>
        </nav>

        <AdBanner slot="top-banner" format="horizontal" style={{ marginBottom: '1.5rem' }} />

        <div className="content-with-sidebar">
          <div>
            <h1 className={styles.title}>
              Historias de <span className="text-gradient">@{cleanUsername}</span>
            </h1>
            <p className={styles.subtitle}>
              Ve las historias de @{cleanUsername} de forma anónima. No aparecerás en la lista de vistos.
            </p>

            {stories.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>📭</span>
                <h2>No hay historias disponibles</h2>
                <p>@{cleanUsername} no tiene historias activas en este momento, o el perfil es privado.</p>
                <Link href={`/profile/${cleanUsername}`} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                  Ver perfil de @{cleanUsername}
                </Link>
              </div>
            ) : (
              <div className={styles.storiesGrid}>
                {stories.map((story) => (
                  <div key={story.id} className={styles.storyCard}>
                    <div className={styles.storyThumb}>
                      {story.is_video ? (
                        <video
                          src={story.video_url}
                          poster={story.display_url}
                          controls
                          aria-label={`Historia en video de @${cleanUsername}`}
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={story.display_url}
                          alt={`Historia de @${cleanUsername} en Instagram`}
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className={styles.storyActions}>
                      <a
                        href={story.is_video ? story.video_url : story.display_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        id={`download-story-${story.id}`}
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                      >
                        ⬇️ Descargar
                      </a>
                      <span className={styles.storyType}>
                        {story.is_video ? '🎬 Video' : '📸 Foto'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <AdBanner slot="bottom-banner" format="horizontal" style={{ marginTop: '2rem' }} />

            <div className={styles.seoBlock}>
              <h2>Ver historias de @{cleanUsername} sin que te vea</h2>
              <p>
                InstaAnon te permite ver todas las historias de @{cleanUsername} de Instagram de forma
                completamente anónima. No necesitas tener cuenta de Instagram y @{cleanUsername} no
                sabrá que viste sus historias.
              </p>
            </div>
          </div>

          <AdSidebar slot="sidebar-1" />
        </div>
      </div>
    </>
  );
}
