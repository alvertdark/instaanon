import type { Metadata } from 'next';
import { AdBanner } from '@/components/ads/AdBanner';
import Link from 'next/link';
import styles from './page.module.css';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Apoyar a ${SITE_NAME} — Gracias por tu apoyo`,
  description: `Gracias por apoyar a ${SITE_NAME}. Tu apoyo nos ayuda a mantener esta herramienta gratuita para todos.`,
  robots: { index: false }, // Don't index support page
};

export default function SupportPage() {
  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.hero}>
        <span className={styles.emoji}>🙏</span>
        <h1>¡Gracias por apoyar InstaAnon!</h1>
        <p>
          Tu apoyo nos ayuda a mantener esta herramienta{' '}
          <strong>100% gratuita</strong> para millones de personas.
          Al visitar esta página, nos ayudas a cubrir los costos del servidor.
        </p>
      </div>

      {/* Ad blocks — main revenue on support page */}
      <div className={styles.adBlock}>
        <AdBanner slot="support-1" format="rectangle" />
      </div>

      <div className={styles.message}>
        <div className={styles.messageCard}>
          <h2>¿Por qué existen los anuncios?</h2>
          <p>
            InstaAnon es completamente gratuito. Para poder mantenernos sin cobrar a los usuarios,
            mostramos publicidad no intrusiva. Los anuncios nos permiten pagar los servidores,
            el dominio y el equipo de desarrollo.
          </p>
        </div>
        <div className={styles.messageCard}>
          <h2>¿Cómo ayuda esta página?</h2>
          <p>
            Al visitar la página de apoyo, ves anuncios adicionales que nos generan ingresos
            directamente. Es la mejor forma de apoyar InstaAnon sin gastar un solo euro.
          </p>
        </div>
      </div>

      <div className={styles.adBlock}>
        <AdBanner slot="support-2" format="horizontal" />
      </div>

      <div className={styles.adBlock}>
        <AdBanner slot="support-3" format="auto" />
      </div>

      <div className={styles.back}>
        <Link href="/" className="btn btn-primary">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
