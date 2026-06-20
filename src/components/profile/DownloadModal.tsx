'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  const [downloading, setDownloading] = useState(false);
  const [adShown, setAdShown] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Determinar si hay carrusel
  const hasCarousel = post.carousel_media && post.carousel_media.length > 0;
  const slides = hasCarousel ? post.carousel_media! : [post];
  const currentSlide = slides[currentIdx];

  const handleNext = () => {
    if (currentIdx < slides.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  // Teclado para navegar carrusel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, slides.length]);

  const handleDownload = async () => {
    if (!adShown) {
      setAdShown(true);
      return;
    }
    setDownloading(true);
    try {
      const url = currentSlide.is_video
        ? (currentSlide.video_url || currentSlide.display_url)
        : currentSlide.display_url;

      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `instaanon_${username}_post_${post.id}_slide_${currentIdx + 1}.${currentSlide.is_video ? 'mp4' : 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      onClose();
    } catch {
      // Fallback: abrir en pestaña nueva
      const url = currentSlide.is_video
        ? (currentSlide.video_url || currentSlide.display_url)
        : currentSlide.display_url;
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Ver publicación completa">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>

        {/* Sección Izquierda: Media */}
        <div className={styles.mediaSection}>
          <div className={styles.mediaWrapper}>
            {currentSlide.is_video ? (
              <video
                src={currentSlide.video_url || currentSlide.display_url}
                className={styles.previewVideo}
                controls
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentSlide.display_url}
                alt={`Publicación de @${username}`}
                className={styles.previewImage}
              />
            )}
          </div>

          {/* Flechas de Navegación del Carrusel */}
          {hasCarousel && (
            <>
              {currentIdx > 0 && (
                <button
                  className={`${styles.navBtn} ${styles.prevBtn}`}
                  onClick={handlePrev}
                  aria-label="Diapositiva anterior"
                >
                  ⟨
                </button>
              )}
              {currentIdx < slides.length - 1 && (
                <button
                  className={`${styles.navBtn} ${styles.nextBtn}`}
                  onClick={handleNext}
                  aria-label="Siguiente diapositiva"
                >
                  ⟩
                </button>
              )}
              <span className={styles.slideCounter}>
                {currentIdx + 1} / {slides.length}
              </span>
            </>
          )}
        </div>

        {/* Sección Derecha: Detalles */}
        <div className={styles.detailsSection}>
          <div className={styles.header}>
            <Image
              src={`https://ui-avatars.com/api/?name=${username}&background=8B5CF6&color=fff&size=80`}
              alt={username}
              width={36}
              height={36}
              className={styles.avatar}
              unoptimized
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
            <button
              className={`btn btn-primary ${styles.downloadBtn}`}
              onClick={handleDownload}
              disabled={downloading}
              id="download-confirm-btn"
            >
              {downloading ? (
                '⏳ Descargando...'
              ) : adShown ? (
                `⬇️ Iniciar descarga (${currentSlide.is_video ? 'video' : 'imagen'})`
              ) : (
                '⬇️ Descargar esta diapositiva'
              )}
            </button>
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
