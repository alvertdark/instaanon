'use client';

import { useState } from 'react';
import styles from './FaqSection.module.css';

const FAQS = [
  {
    q: '¿Cómo ver historias de Instagram sin que te vean?',
    a: 'Con InstaAnon puedes ver cualquier historia de Instagram de forma anónima. Solo escribe el @username en el buscador y podrás ver sus historias sin aparecer en la lista de vistos. Es completamente gratis y no requiere registro.',
  },
  {
    q: '¿Es gratis ver perfiles de Instagram anónimamente?',
    a: 'Sí, InstaAnon es completamente gratuito para todos los usuarios. La herramienta se mantiene gracias a la publicidad no intrusiva que mostramos en el sitio. No necesitas crear una cuenta ni pagar nada.',
  },
  {
    q: '¿Puedo descargar fotos y videos de Instagram?',
    a: 'Sí, puedes descargar fotos, videos, historias y reels de perfiles públicos de Instagram de forma gratuita con InstaAnon. Las descargas son en la máxima calidad disponible y sin marca de agua.',
  },
  {
    q: '¿InstaAnon puede ver perfiles privados de Instagram?',
    a: 'InstaAnon solo muestra contenido de perfiles públicos de Instagram. El contenido de perfiles privados no es accesible por razones de privacidad y respeto a los usuarios.',
  },
  {
    q: '¿El dueño del perfil sabrá que lo visité?',
    a: 'No. InstaAnon te permite ver perfiles, historias y publicaciones de Instagram de forma completamente anónima. El dueño del perfil no recibirá ninguna notificación ni verá tu nombre en la lista de vistos.',
  },
  {
    q: '¿Necesito tener cuenta de Instagram para usar InstaAnon?',
    a: 'No. InstaAnon funciona sin que necesites tener cuenta de Instagram. Puedes ver cualquier perfil público directamente desde el buscador, sin iniciar sesión.',
  },
  {
    q: '¿Puedo ver los destacados de Instagram sin cuenta?',
    a: 'Sí, InstaAnon te permite ver todos los destacados (highlights) de cualquier perfil público de Instagram, incluso si no tienes cuenta. Solo escribe el usuario y accede a todos sus álbumes de destacados.',
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2>Preguntas frecuentes sobre InstaAnon</h2>
          <p>Todo lo que necesitas saber para ver Instagram de forma anónima</p>
        </div>

        <div className={styles.faqList} role="list">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`${styles.faqItem} ${open === i ? styles.open : ''}`}
              role="listitem"
            >
              <button
                className={styles.faqQuestion}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                id={`faq-${i}`}
                aria-controls={`faq-answer-${i}`}
              >
                <span>{faq.q}</span>
                <span className={styles.faqIcon} aria-hidden="true">
                  {open === i ? '−' : '+'}
                </span>
              </button>
              {open === i && (
                <div
                  className={styles.faqAnswer}
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-${i}`}
                >
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
