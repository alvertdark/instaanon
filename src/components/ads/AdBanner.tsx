'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

export function AdBanner({ slot, format = 'auto', style, className }: AdBannerProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div className={`ad-container ${className || ''}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
