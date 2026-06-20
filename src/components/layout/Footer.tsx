import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            👁️ Insta<span className={styles.accent}>Anon</span>
          </Link>
          <p className={styles.tagline}>
            Ve perfiles de Instagram de forma anónima y gratuita. Sin registro, sin rastro.
          </p>
          <p className={styles.disclaimer}>
            ⚠️ InstaAnon no está afiliado con Instagram ni Meta, Inc. Solo mostramos contenido
            de perfiles públicos. Úsalo con responsabilidad.
          </p>
        </div>

        {/* Links — Anchor text descriptivo para SEO */}
        <nav className={styles.linksSection} aria-label="Links del sitio">
          <div className={styles.linkGroup}>
            <h3 className={styles.linkGroupTitle}>Herramientas</h3>
            <ul>
              <li><Link href="/" className={styles.link}>Ver perfiles de Instagram</Link></li>
              <li><Link href="/stories/example" className={styles.link}>Ver historias anónimas</Link></li>
              <li><Link href="/highlights/example" className={styles.link}>Ver destacados sin cuenta</Link></li>
              <li><Link href="/reels/example" className={styles.link}>Ver reels de Instagram</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.linkGroupTitle}>Sitio</h3>
            <ul>
              <li><Link href="/about" className={styles.link}>Acerca de InstaAnon</Link></li>
              <li><Link href="/support" className={styles.link}>Apoyar el proyecto</Link></li>
              <li><Link href="/privacy" className={styles.link}>Política de privacidad</Link></li>
              <li><Link href="/terms" className={styles.link}>Términos de uso</Link></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.linkGroupTitle}>Buscar perfiles</h3>
            <ul>
              <li><Link href="/profile/cristiano" className={styles.link}>Ver @cristiano</Link></li>
              <li><Link href="/profile/selenagomez" className={styles.link}>Ver @selenagomez</Link></li>
              <li><Link href="/profile/leomessi" className={styles.link}>Ver @leomessi</Link></li>
              <li><Link href="/profile/kyliejenner" className={styles.link}>Ver @kyliejenner</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className="container">
          <p className={styles.copyright}>
            © {year} InstaAnon. Todos los derechos reservados.
          </p>
          <p className={styles.adNotice}>
            Este sitio usa publicidad para mantenerse gratuito. Los anuncios son seguros y no intrusivos.
          </p>
        </div>
      </div>
    </footer>
  );
}
