import styles from './HowItWorks.module.css';

const STEPS = [
  {
    step: '01',
    icon: '✏️',
    title: 'Escribe el usuario',
    description: 'Ingresa el @username del perfil de Instagram que quieres ver en el buscador.',
  },
  {
    step: '02',
    icon: '👁️',
    title: 'Ve el perfil anónimo',
    description: 'Accede a fotos, historias, destacados, reels y más sin que el usuario lo sepa.',
  },
  {
    step: '03',
    icon: '⬇️',
    title: 'Descarga el contenido',
    description: 'Descarga fotos, videos e historias en tu dispositivo, gratis y sin marca de agua.',
  },
];

export function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2>¿Cómo funciona InstaAnon?</h2>
          <p>Ver Instagram anónimamente nunca fue tan fácil. Solo 3 pasos.</p>
        </div>

        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNumber}>{s.step}</div>
              <div className={styles.stepIcon}>{s.icon}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.description}</p>
            </div>
          ))}
        </div>

        {/* SEO text block */}
        <div className={styles.seoText}>
          <p>
            <strong>InstaAnon</strong> es la herramienta gratuita más completa para{' '}
            <strong>ver perfiles de Instagram de forma anónima</strong>. Puedes ver historias sin aparecer
            en los vistos, explorar publicaciones sin tener cuenta, ver destacados archivados y descargar
            cualquier contenido público. Todo sin registro y sin dejar rastro.
          </p>
        </div>
      </div>
    </section>
  );
}
