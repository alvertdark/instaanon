'use client';

import { useState, useEffect } from 'react';
import { AdsterraAd } from './AdsterraAd';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

export function AdBanner({ slot, format = 'auto', style, className }: AdBannerProps) {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isRectangle = format === 'rectangle' || slot.includes('in-feed') || slot.includes('download');

  if (isRectangle) {
    return (
      <div className={`ad-container ${className || ''}`} style={{ display: 'flex', justifyContent: 'center', minHeight: '250px', background: 'transparent', ...style }}>
        <AdsterraAd id="c7b1b81e77014de232be709061a83a21" width={300} height={250} />
      </div>
    );
  }

  if (width === null) {
    return (
      <div className={`ad-container ${className || ''}`} style={{ ...style, minHeight: '50px' }} />
    );
  }

  if (width >= 768) {
    return (
      <div className={`ad-container ${className || ''}`} style={{ display: 'flex', justifyContent: 'center', minHeight: '90px', background: 'transparent', ...style }}>
        <AdsterraAd id="2ec7f0b2cfde1bb7fab22507ac425bd7" width={728} height={90} />
      </div>
    );
  }

  if (width >= 480) {
    return (
      <div className={`ad-container ${className || ''}`} style={{ display: 'flex', justifyContent: 'center', minHeight: '60px', background: 'transparent', ...style }}>
        <AdsterraAd id="ab216fc99ed9199ac74c816c8343a975" width={468} height={60} />
      </div>
    );
  }

  return (
    <div className={`ad-container ${className || ''}`} style={{ display: 'flex', justifyContent: 'center', minHeight: '50px', background: 'transparent', ...style }}>
      <AdsterraAd id="a6741757a0e96d2d362003725e7eccd3" width={320} height={50} />
    </div>
  );
}


