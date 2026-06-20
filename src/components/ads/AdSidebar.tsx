'use client';

import { useEffect } from 'react';
import styles from './AdSidebar.module.css';

export function AdSidebar({ slot = 'sidebar-1' }: { slot?: string }) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <aside className={styles.wrapper}>
      <div className="ad-container ad-sidebar-sticky">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format="rectangle"
          data-full-width-responsive="false"
        />
      </div>
    </aside>
  );
}
