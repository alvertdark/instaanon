'use client';

import { useState, useEffect, useCallback } from 'react';
import { detectAdBlock } from '@/lib/adblock';

export function AdBlockDetector() {
  const [detected, setDetected] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Run check after a short delay (let ads load first)
    const timer = setTimeout(async () => {
      const hasAdBlock = await detectAdBlock();
      if (hasAdBlock) setDetected(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const recheck = useCallback(async () => {
    setChecking(true);
    await new Promise((r) => setTimeout(r, 500));
    const hasAdBlock = await detectAdBlock();
    if (!hasAdBlock) {
      setDetected(false);
    } else {
      setChecking(false);
    }
  }, []);

  if (!detected) return null;

  return (
    <div className="adblock-overlay" role="alertdialog" aria-modal="true">
      <div className="adblock-modal animate-slide-up">
        <span className="adblock-icon" role="img" aria-label="Bloqueado">🚫</span>
        <h2>Bloqueador de anuncios detectado</h2>
        <p>
          <strong style={{ color: 'var(--color-text)' }}>InstaAnon es 100% gratuito</strong> gracias
          a los anuncios. Los anuncios nos permiten mantener esta herramienta sin cobrarte nada.
          Por favor, desactiva tu bloqueador de anuncios para continuar usando el sitio.
        </p>

        <div className="adblock-steps">
          <p>📌 <strong>Cómo desactivarlo:</strong></p>
          <p>1. Haz clic en el ícono de tu extensión (uBlock, AdBlock, etc.)</p>
          <p>2. Selecciona <strong>"Pausar en este sitio"</strong> o <strong>"Desactivar"</strong></p>
          <p>3. Recarga la página con F5</p>
          <p>4. Haz clic en el botón de abajo</p>
        </div>

        <button
          className="adblock-btn"
          onClick={recheck}
          disabled={checking}
          id="adblock-recheck-btn"
        >
          {checking ? '⏳ Verificando...' : '✅ Ya lo desactivé — Continuar'}
        </button>

        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
          Los anuncios son seguros y no intrusivos. Sin ellos, no podemos mantener InstaAnon gratuito. 💜
        </p>
      </div>
    </div>
  );
}
