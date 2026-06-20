import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Términos de Uso | ${SITE_NAME}`,
  description: `Términos y condiciones de uso de ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="container" style={{ maxWidth: 760, padding: '3rem 1.5rem' }}>
      <h1>Términos de Uso</h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
        Última actualización: 20 de junio de 2025
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2>1. Aceptación de los términos</h2>
        <p>
          Al usar {SITE_NAME}, aceptas estos términos de uso. Si no estás de acuerdo,
          por favor no uses el sitio.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>2. Descripción del servicio</h2>
        <p>
          {SITE_NAME} es una herramienta que permite visualizar contenido de perfiles
          <strong> públicos</strong> de Instagram de forma anónima. No accedemos a perfiles
          privados ni a información protegida.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>3. Uso permitido</h2>
        <p>Solo puedes usar {SITE_NAME} para:</p>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
          <li style={{ marginBottom: '0.5rem' }}>Uso personal e informativo</li>
          <li style={{ marginBottom: '0.5rem' }}>Visualizar contenido públicamente disponible</li>
          <li>Descargar contenido propio o con permiso del autor</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>4. Uso prohibido</h2>
        <p>Está prohibido usar {SITE_NAME} para:</p>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
          <li style={{ marginBottom: '0.5rem' }}>Acosar, intimidar o dañar a otros usuarios</li>
          <li style={{ marginBottom: '0.5rem' }}>Uso comercial del contenido descargado sin permiso</li>
          <li style={{ marginBottom: '0.5rem' }}>Distribuir o republicar contenido ajeno sin autorización</li>
          <li>Violar derechos de autor o propiedad intelectual</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>5. Descargo de responsabilidad</h2>
        <p>
          {SITE_NAME} <strong>no está afiliado con Instagram ni con Meta, Inc.</strong>{' '}
          No somos responsables del contenido de los perfiles visualizados. Todo el contenido
          pertenece a sus respectivos propietarios.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          {SITE_NAME} se proporciona &quot;tal cual&quot; sin garantías de ningún tipo.
          No garantizamos la disponibilidad continua del servicio.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>6. Publicidad</h2>
        <p>
          {SITE_NAME} muestra anuncios de terceros (Google AdSense) para financiar el servicio
          gratuito. Requerimos que los usuarios desactiven los bloqueadores de anuncios para
          acceder al servicio.
        </p>
      </section>

      <section>
        <h2>7. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier momento.
          El uso continuado del servicio implica la aceptación de los nuevos términos.
        </p>
      </section>
    </div>
  );
}
