'use client';

import { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  id: string;
  width: number;
  height: number;
}

export function AdsterraAd({ id, width, height }: AdsterraAdProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Escribir el HTML con el script aislado dentro del iframe para evitar colisiones en variables globales
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
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
    `);
    doc.close();
  }, [id, width, height]);

  return (
    <iframe
      ref={iframeRef}
      width={width}
      height={height}
      style={{
        border: 'none',
        overflow: 'hidden',
        background: 'transparent',
        display: 'block',
      }}
      scrolling="no"
      title={`ad-${id}`}
    />
  );
}
