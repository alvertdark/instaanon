'use client';

import { useState, useEffect, useRef } from 'react';
import type { InstagramHighlight, InstagramStory } from '@/lib/instagram';
import styles from './HighlightsGrid.module.css';

interface Props {
  highlights: InstagramHighlight[];
  username: string;
  profilePic: string;
}

export function HighlightsGrid({ highlights, username, profilePic }: Props) {
  const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState<InstagramStory[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeHighlight, setActiveHighlight] = useState<InstagramHighlight | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenHighlight = async (h: InstagramHighlight) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/instagram/highlight/${h.id}`);
      const json = await res.json();
      if (json.success && json.stories && json.stories.length > 0) {
        setStories(json.stories);
        setCurrentIdx(0);
        setActiveHighlight(h);
      } else {
        alert('No se pudieron cargar las historias de este destacado.');
      }
    } catch (e) {
      console.error(e);
      alert('Error de red al cargar el destacado.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveHighlight(null);
    setStories([]);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleNext = () => {
    if (currentIdx < stories.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  // Teclado
  useEffect(() => {
    if (!activeHighlight) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeHighlight, currentIdx, stories]);

  // Auto-avance para imágenes y control de temporizadores
  const currentStory = stories[currentIdx];

  useEffect(() => {
    if (!activeHighlight || !currentStory) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!currentStory.is_video) {
      // Avanzar imagen después de 5 segundos
      timerRef.current = setTimeout(() => {
        handleNext();
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeHighlight, currentIdx, currentStory]);

  const handleDownload = async () => {
    if (!currentStory) return;
    const url = currentStory.is_video ? (currentStory.video_url || currentStory.display_url) : currentStory.display_url;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `instaanon_${username}_destacado_${currentStory.id}.${currentStory.is_video ? 'mp4' : 'jpg'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Grid de Destacados */}
      <div className={styles.grid}>
        {highlights.map((h) => (
          <button
            key={h.id}
            className={styles.highlightCard}
            onClick={() => handleOpenHighlight(h)}
            id={`highlight-btn-${h.id}`}
            aria-label={`Ver destacado ${h.title}`}
          >
            <div className={styles.coverWrapper}>
              <div className={styles.coverInner}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={h.cover_media_url || `https://ui-avatars.com/api/?name=${h.title}&background=8B5CF6&color=fff`}
                  alt={`Cubierta de destacado ${h.title}`}
                  className={styles.coverImage}
                  loading="lazy"
                />
              </div>
            </div>
            <span className={styles.title}>{h.title}</span>
            <span className={styles.count}>{h.media_count} hist.</span>
          </button>
        ))}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
          <p>Cargando historias del destacado...</p>
        </div>
      )}

      {/* Visor de Historias */}
      {activeHighlight && currentStory && (
        <div className={styles.viewerOverlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
          {/* Botón Anterior (Desktop) */}
          {currentIdx > 0 && (
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrev}
              aria-label="Historia anterior"
            >
              ⟨
            </button>
          )}

          <div className={styles.viewerContainer}>
            {/* Barras de Progreso tipo Instagram */}
            <div className={styles.progressBars}>
              {stories.map((_, i) => (
                <div key={i} className={styles.progressBarBg}>
                  <div
                    className={`${styles.progressBarFill} ${
                      i < currentIdx ? styles.progressBarActive : ''
                    }`}
                    style={{
                      width: i === currentIdx ? '100%' : undefined,
                      transition: i === currentIdx && !currentStory.is_video ? 'width 5s linear' : 'none',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Cabecera */}
            <div className={styles.viewerHeader}>
              <div className={styles.userInfo}>
                <img
                  src={profilePic || `https://ui-avatars.com/api/?name=${username}&background=8B5CF6&color=fff`}
                  alt={username}
                  width={32}
                  height={32}
                  className={styles.userAvatar}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className={styles.username}>@{username}</span>
                  <span className={styles.timeago}>Destacado: {activeHighlight.title}</span>
                </div>
              </div>
              <button className={styles.closeButton} onClick={handleClose} aria-label="Cerrar visor">
                ✕
              </button>
            </div>

            {/* Media Display */}
            <div className={styles.mediaWrapper}>
              {/* Áreas de toque para navegación en móvil */}
              <div className={styles.touchAreas}>
                <div className={styles.touchLeft} onClick={handlePrev} />
                <div className={styles.touchRight} onClick={handleNext} />
              </div>

              {currentStory.is_video ? (
                <video
                  ref={videoRef}
                  src={currentStory.video_url || currentStory.display_url}
                  className={styles.storyVideo}
                  autoPlay
                  controls={false}
                  playsInline
                  onEnded={handleNext}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentStory.display_url}
                  alt={`Historia del destacado ${activeHighlight.title}`}
                  className={styles.storyImage}
                />
              )}
            </div>

            {/* Footer con Botón de Descarga */}
            <div className={styles.viewerFooter}>
              <button
                className={`btn btn-primary ${styles.downloadButton}`}
                onClick={handleDownload}
                id="download-story-viewer-btn"
              >
                ⬇️ Descargar esta historia
              </button>
            </div>
          </div>

          {/* Botón Siguiente (Desktop) */}
          {currentIdx < stories.length - 1 && (
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNext}
              aria-label="Historia siguiente"
            >
              ⟩
            </button>
          )}
        </div>
      )}
    </div>
  );
}
