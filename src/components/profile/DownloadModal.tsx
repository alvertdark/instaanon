'use client';

import { useState, useEffect } from 'react';
import type { InstagramPost } from '@/lib/instagram';
import { AdBanner } from '@/components/ads/AdBanner';
import { formatCount } from '@/lib/instagram';
import styles from './DownloadModal.module.css';

interface Props {
  post: InstagramPost;
  username: string;
  onClose: () => void;
}

export function DownloadModal({ post, username, onClose }: Props) {
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);
  const [adShown, setAdShown] = useState(false);

  // Determinar si hay carrusel
  const hasCarousel = post.carousel_media && post.carousel_media.length > 0;
  const slides = hasCarousel ? post.carousel_media! : [post];

  // Teclado para cerrar modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDownloadSlide = async (slide: any, idx: number) => {
    if (!adShown) {
      setAdShown(true);
      return;
    }
    setDownloadingIdx(idx);
    try {
      const url = slide.is_video
        ? (slide.video_url || slide.display_url)
        : slide.display_url;

      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `instaanon_${username}_post_${post.id}_slide_${idx + 1}.${slide.is_video ? 'mp4' : 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch {
      // Fallback: abrir en pestaña nueva
      const url = slide.is_video
        ? (slide.video_url || slide.display_url)
        : slide.display_url;
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingIdx(null);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Ver publicación completa">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>

        {/* Sección Izquierda: Lista de Media */}
        <div className={styles.mediaSection}>
          <div className={styles.mediaList}>
            {slides.map((slide, idx) => (
              <div key={slide.id || idx} className={styles.slideCard}>
                <div className={styles.mediaWrapper}>
                  {slide.is_video ? (
                    <video
                      key={slide.id || idx}
                      src={slide.video_url || slide.display_url}
                      className={styles.previewVideo}
                      controls
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      key={slide.id || idx}
                      src={slide.display_url}
                      alt={`Diapositiva ${idx + 1} de la publicación`}
                      className={styles.previewImage}
                    />
                  )}
                </div>
                <button
                  className={`btn btn-primary ${styles.slideDownloadBtn}`}
                  onClick={() => handleDownloadSlide(slide, idx)}
                  disabled={downloadingIdx !== null}
                >
                  {downloadingIdx === idx ? (
                    '⏳ Descargando...'
                  ) : adShown ? (
                    `⬇️ Descargar ${slide.is_video ? 'video' : 'imagen'} ${slides.length > 1 ? `#${idx + 1}` : ''}`
                  ) : (
                    `⬇️ Descargar ${slide.is_video ? 'video' : 'imagen'} ${slides.length > 1 ? `#${idx + 1}` : ''}`
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Derecha: Detalles */}
        <div className={styles.detailsSection}>
          <div className={styles.header}>
            <img
              src={`https://ui-avatars.com/api/?name=${username}&background=8B5CF6&color=fff&size=80`}
              alt={username}
              width={36}
              height={36}
              className={styles.avatar}
            />
            <span className={styles.username}>@{username}</span>
          </div>

          {/* Caption / Descripción */}
          <div className={styles.captionScroll}>
            {post.caption ? (
              <p className={styles.captionText}>{post.caption}</p>
            ) : (
              <p className={styles.captionText} style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>
                Sin descripción.
              </p>
            )}
          </div>

          {/* Likes y Comentarios */}
          <div className={styles.statsRow}>
            <span className={styles.statItem} title="Me gusta">
              ❤️ {formatCount(post.like_count)}
            </span>
            <span className={styles.statItem} title="Comentarios">
              💬 {formatCount(post.comment_count)}
            </span>
          </div>

          {/* Anuncio en la descarga */}
          {adShown && (
            <div className={styles.adBlock}>
              <AdBanner slot="ad-download" format="rectangle" />
            </div>
          )}

          {/* Acciones */}
          <div className={styles.actions}>
            {!adShown && (
              <p className={styles.unlockHint}>
                Presiona el botón de descarga en cualquier imagen/video para desbloquearla.
              </p>
            )}
            <button className="btn btn-ghost" onClick={onClose}>
              Cerrar
            </button>
          </div>

          {!adShown && (
            <p className={styles.hint}>
              Los anuncios nos permiten mantener InstaAnon gratuito 💜
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
