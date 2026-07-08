'use client';

import { useState } from 'react';

interface AdsterraAdProps {
  id: string;
  width: number;
  height: number;
}

export function AdsterraAd({ id, width, height }: AdsterraAdProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // HTML directo usando srcDoc, con Preconnects para acelerar latencia de red
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="preconnect" href="https://www.highperformanceformat.com" crossorigin>
        <link rel="dns-prefetch" href="https://www.highperformanceformat.com">
        <style>
          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${id}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/${id}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: isLoaded ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        overflow: 'hidden',
        margin: '0 auto',
      }}
    >
      <style>{`
        @keyframes shimmer-ad {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Skeleton / Efecto Shimmer de carga */}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
            animation: 'shimmer-ad 1.5s infinite linear',
            pointerEvents: 'none',
          }}
        />
      )}

      <iframe
        srcDoc={adHtml}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        style={{
          border: 'none',
          overflow: 'hidden',
          background: 'transparent',
          display: 'block',
          position: 'relative',
          zIndex: 1,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
        }}
        scrolling="no"
        title={`ad-${id}`}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        loading="eager"
      />
    </div>
  );
}
