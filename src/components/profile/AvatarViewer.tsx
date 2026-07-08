'use client';

import { useState } from 'react';
import styles from './AvatarViewer.module.css';

interface Props {
  profilePicUrl: string;
  username: string;
}

export function AvatarViewer({ profilePicUrl, username }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(profilePicUrl);
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `instaanon_${username}_profile_pic.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(profilePicUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div className={styles.avatarContainer}>
        <div className={styles.avatarRing} onClick={() => setIsOpen(true)} title="Ver foto de perfil en grande">
          <img
            src={profilePicUrl}
            alt={`Foto de perfil de @${username} en Instagram`}
            width={120}
            height={120}
            className={styles.avatar}
          />
          <div className={styles.hoverOverlay}>
            <span>🔍 Ver HD</span>
          </div>
        </div>
        <button className={styles.viewHdBtn} onClick={() => setIsOpen(true)}>
          🔍 Foto HD
        </button>
      </div>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
            <div className={styles.imageWrapper}>
              <img src={profilePicUrl} alt={`Foto de perfil HD de @${username}`} className={styles.hdImage} />
            </div>
            <div className={styles.modalActions}>
              <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
                {downloading ? '⏳ Descargando...' : '⬇️ Descargar Foto de Perfil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
