'use client';

import styles from './AdSidebar.module.css';
import { AdsterraAd } from './AdsterraAd';

export function AdSidebar({ slot = 'sidebar-1' }: { slot?: string }) {
  return (
    <aside className={styles.wrapper}>
      <div className="ad-container ad-sidebar-sticky" style={{ display: 'flex', justifyContent: 'center' }}>
        <AdsterraAd id="08968988a24cd4ccbf8b0274ba572005" width={160} height={600} />
      </div>
    </aside>
  );
}

