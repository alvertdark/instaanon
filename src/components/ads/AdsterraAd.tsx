'use client';

import { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  id: string;
  width: number;
  height: number;
}

export function AdsterraAd({ id, width, height }: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Limpiar contenido anterior
    container.innerHTML = '';

    // Crear elemento para las atOptions
    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '${id}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    container.appendChild(optionsScript);

    // Crear elemento para invocar el script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `https://www.highperformanceformat.com/${id}/invoke.js`;
    container.appendChild(invokeScript);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [id, width, height]);

  return (
    <div
      ref={containerRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        margin: '0 auto',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
