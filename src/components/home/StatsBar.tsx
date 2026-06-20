import styles from './StatsBar.module.css';

const STATS = [
  { value: '2.3M+', label: 'Búsquedas este mes' },
  { value: '180+', label: 'Países activos' },
  { value: '100%', label: 'Anónimo siempre' },
  { value: '0€', label: 'Siempre gratis' },
];

export function StatsBar() {
  return (
    <section className={styles.statsBar} aria-label="Estadísticas de InstaAnon">
      <div className="container">
        <div className={styles.grid}>
          {STATS.map((s, i) => (
            <div key={i} className={styles.stat}>
              <span className={styles.value}>{s.value}</span>
              <span className={styles.label}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
