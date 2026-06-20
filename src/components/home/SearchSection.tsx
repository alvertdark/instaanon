'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchSection.module.css';

const POPULAR_PROFILES = [
  { username: 'cristiano', label: '@cristiano' },
  { username: 'selenagomez', label: '@selenagomez' },
  { username: 'leomessi', label: '@leomessi' },
  { username: 'kyliejenner', label: '@kyliejenner' },
  { username: 'natgeo', label: '@natgeo' },
  { username: 'nasa', label: '@nasa' },
];

export function SearchSection() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const username = query.trim().replace('@', '').toLowerCase();
    if (!username) return;
    setLoading(true);
    router.push(`/profile/${username}`);
  };

  const handleQuickSearch = (username: string) => {
    setLoading(true);
    router.push(`/profile/${username}`);
  };

  return (
    <section className={styles.hero}>
      {/* Background glow */}
      <div className={styles.glow} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        {/* Badge */}
        <div className={`badge badge-purple ${styles.badge}`}>
          <span>✨</span> 100% Anónimo y Gratuito
        </div>

        {/* H1 — Single per page, includes main keyword */}
        <h1 className={styles.title}>
          Ver perfiles de Instagram
          <br />
          <span className="text-gradient">de forma anónima</span>
        </h1>

        <p className={styles.subtitle}>
          Accede a historias, publicaciones, destacados y seguidores de cualquier perfil
          público de Instagram sin necesidad de cuenta. Sin que nadie lo sepa.
        </p>

        {/* Main Search Form */}
        <form
          onSubmit={handleSearch}
          className={styles.searchForm}
          role="search"
          aria-label="Buscar perfil de Instagram"
        >
          <div className={styles.searchWrapper}>
            <span className={styles.searchPrefix}>instagram.com/</span>
            <input
              type="search"
              id="main-search"
              name="username"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="username"
              className={styles.searchInput}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-label="Nombre de usuario de Instagram"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className={`btn btn-primary ${styles.searchBtn}`}
            disabled={loading || !query.trim()}
            id="main-search-btn"
          >
            {loading ? (
              <><span className="spinner" style={{ width: 18, height: 18 }} /> Buscando...</>
            ) : (
              <><span>🔍</span> Ver perfil anónimo</>
            )}
          </button>
        </form>

        {/* What you can view */}
        <div className={styles.features}>
          {[
            { icon: '📸', label: 'Publicaciones' },
            { icon: '📖', label: 'Historias' },
            { icon: '⭐', label: 'Destacados' },
            { icon: '🎬', label: 'Reels' },
            { icon: '👥', label: 'Seguidores' },
            { icon: '⬇️', label: 'Descargar' },
          ].map((f) => (
            <span key={f.label} className={styles.feature}>
              <span>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </div>

        {/* Popular profiles */}
        <div className={styles.popular}>
          <span className={styles.popularLabel}>Perfiles populares:</span>
          <div className={styles.popularList}>
            {POPULAR_PROFILES.map((p) => (
              <button
                key={p.username}
                onClick={() => handleQuickSearch(p.username)}
                className={styles.popularBtn}
                id={`popular-${p.username}`}
                aria-label={`Ver perfil de ${p.label}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
