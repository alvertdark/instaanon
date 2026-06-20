'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import styles from './Header.module.css';

export function Header() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const username = query.trim().replace('@', '').toLowerCase();
    if (username) {
      router.push(`/profile/${username}`);
      setQuery('');
      setIsOpen(false);
    }
  };

  return (
    <header className={styles.header} role="banner">
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="InstaAnon — Inicio">
          <span className={styles.logoIcon}>👁️</span>
          <span className={styles.logoText}>
            Insta<span className={styles.logoAccent}>Anon</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Navegación principal">
          <Link href="/" className={styles.navLink}>Inicio</Link>
          <Link href="/stories/example" className={styles.navLink}>Historias</Link>
          <Link href="/highlights/example" className={styles.navLink}>Destacados</Link>
          <Link href="/reels/example" className={styles.navLink}>Reels</Link>
          <Link href="/about" className={styles.navLink}>Acerca de</Link>
        </nav>

        {/* Desktop Search (mini) */}
        <form onSubmit={handleSearch} className={styles.searchForm} role="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="@usuario..."
            className={styles.searchInput}
            aria-label="Buscar usuario de Instagram"
            id="header-search"
          />
          <button type="submit" className={styles.searchBtn} aria-label="Buscar">
            🔍
          </button>
        </form>

        {/* Support Button — always visible */}
        <Link href="/support" className="btn-support" id="support-btn">
          🙏 Apoyar gratis
        </Link>

        {/* Mobile menu toggle */}
        <button
          className={styles.menuToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
          aria-expanded={isOpen}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <nav aria-label="Navegación móvil">
            <Link href="/" className={styles.mobileLink} onClick={() => setIsOpen(false)}>🏠 Inicio</Link>
            <Link href="/stories/example" className={styles.mobileLink} onClick={() => setIsOpen(false)}>📖 Historias</Link>
            <Link href="/highlights/example" className={styles.mobileLink} onClick={() => setIsOpen(false)}>⭐ Destacados</Link>
            <Link href="/reels/example" className={styles.mobileLink} onClick={() => setIsOpen(false)}>🎬 Reels</Link>
            <Link href="/support" className={styles.mobileLink} onClick={() => setIsOpen(false)}>🙏 Apoyar InstaAnon</Link>
          </nav>
          <form onSubmit={handleSearch} className={styles.mobileSearch}>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar @usuario..."
              className={styles.searchInput}
              aria-label="Buscar usuario"
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Buscar
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
