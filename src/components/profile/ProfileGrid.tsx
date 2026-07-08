'use client';

import { useState } from 'react';
import type { InstagramPost } from '@/lib/instagram';
import { AdBanner } from '@/components/ads/AdBanner';
import { DownloadModal } from '@/components/profile/DownloadModal';
import styles from './ProfileGrid.module.css';

interface Props {
  posts: InstagramPost[];
  username: string;
}

type Tab = 'posts' | 'reels';

export function ProfileGrid({ posts, username }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [visiblePostsCount, setVisiblePostsCount] = useState(9);

  const displayPosts = posts.filter((p) =>
    activeTab === 'reels' ? p.is_video : true
  );

  // Paginación: solo aplicamos el límite de 9 elementos en la pestaña de publicaciones
  const postsToShow = activeTab === 'posts'
    ? displayPosts.slice(0, visiblePostsCount)
    : displayPosts;

  return (
    <div className={styles.wrapper}>
      {/* Tabs */}
      <div className="tabs" role="tablist" aria-label="Contenido del perfil">
        {(['posts', 'reels'] as Tab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              // Opcional: reiniciar el contador al cambiar de pestaña
              setVisiblePostsCount(9);
            }}
            id={`tab-${tab}`}
          >
            {tab === 'posts' ? '📸 Publicaciones' : '🎬 Reels'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={`media-grid ${styles.grid}`} role="list" aria-label={`${activeTab} de @${username}`}>
        {postsToShow.map((post, idx) => {
          // Insert in-feed ad every 6 posts
          const items = [];
          if (idx > 0 && idx % 6 === 0) {
            items.push(
              <div key={`ad-${idx}`} className={styles.adInFeed} role="listitem">
                <AdBanner slot={`in-feed-${Math.floor(idx / 6)}`} format="rectangle" />
              </div>
            );
          }
          items.push(
            <article
              key={post.id}
              className="media-item"
              role="listitem"
              onClick={() => setSelectedPost(post)}
              aria-label={`Publicación de @${username}${post.caption ? ': ' + post.caption.slice(0, 50) : ''}`}
            >
              <img
                src={post.thumbnail_url}
                alt={`Publicación de @${username} en Instagram${post.caption ? ': ' + post.caption.slice(0, 80) : ''}`}
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                style={{ position: 'absolute', height: '100%', width: '100%', top: 0, left: 0, objectFit: 'cover' }}
                loading={idx < 6 ? 'eager' : 'lazy'}
              />
              <div className="media-item-overlay">
                {post.is_video && <span className={styles.videoIcon}>▶</span>}
                <span>❤️ {(post.like_count / 1000).toFixed(0)}K</span>
                <span>💬 {post.comment_count}</span>
              </div>
            </article>
          );
          return items;
        })}
      </div>

      {/* Botón Mostrar más (Solo para la pestaña de publicaciones y si hay más elementos) */}
      {activeTab === 'posts' && visiblePostsCount < displayPosts.length && (
        <div className={styles.loadMoreWrapper}>
          <button
            className="btn btn-secondary"
            onClick={() => setVisiblePostsCount((prev) => prev + 9)}
            id="load-more-posts-btn"
          >
            Mostrar más publicaciones
          </button>
        </div>
      )}

      {displayPosts.length === 0 && (
        <div className={styles.empty}>
          <p>No hay {activeTab === 'posts' ? 'publicaciones' : 'reels'} disponibles.</p>
        </div>
      )}

      {/* Download Modal */}
      {selectedPost && (
        <DownloadModal
          post={selectedPost}
          username={username}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
