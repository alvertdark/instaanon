import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: `Política de Privacidad | ${SITE_NAME}`,
  description: `Política de privacidad de ${SITE_NAME}. Información sobre cookies, publicidad y datos recopilados.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  const updated = '20 de junio de 2025';
  return (
    <div className="container" style={{ maxWidth: 760, padding: '3rem 1.5rem' }}>
      <h1>Política de Privacidad</h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: '2rem' }}>
        Última actualización: {updated}
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2>1. Información general</h2>
        <p>
          {SITE_NAME} (&quot;nosotros&quot;, &quot;nuestro&quot;) opera el sitio web instaanon.vercel.app.
          Esta página informa sobre nuestras políticas respecto a la recopilación, uso y divulgación
          de información personal cuando usas nuestro servicio.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>2. Datos que recopilamos</h2>
        <p>Solo recopilamos datos de uso anónimos a través de:</p>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', color: 'var(--color-text-secondary)' }}>
          <li style={{ marginBottom: '0.5rem' }}>Google Analytics 4 (datos anónimos de tráfico)</li>
          <li style={{ marginBottom: '0.5rem' }}>Google AdSense (cookies publicitarias)</li>
          <li>Datos de rendimiento del sitio</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          No recopilamos información personal identificable. No almacenamos usernames buscados
          ni datos de sesión.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>3. Cookies y publicidad</h2>
        <p>
          Usamos cookies de Google AdSense para mostrar publicidad relevante. Puedes optar por
          no participar en la publicidad personalizada visitando{' '}
          <a href="https://www.google.com/settings/ads" rel="nofollow noopener" target="_blank"
            style={{ color: 'var(--color-primary)' }}>
            google.com/settings/ads
          </a>.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          Google, como proveedor externo, utiliza cookies para mostrar anuncios basados en
          visitas anteriores de los usuarios. Puedes desactivar el uso de cookies de Google
          visitando el administrador de opciones de anuncios de Google.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>4. Contenido de terceros</h2>
        <p>
          {SITE_NAME} accede y muestra contenido de perfiles públicos de Instagram.
          No almacenamos este contenido en nuestros servidores. Todo el contenido se sirve
          directamente desde los servidores de Instagram/Meta.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>5. GDPR y derechos del usuario</h2>
        <p>
          Si te encuentras en el Espacio Económico Europeo (EEE), tienes derecho a acceder,
          rectificar, portar y borrar tus datos personales. Para ejercer estos derechos,
          contáctanos.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>6. Menores</h2>
        <p>
          Este servicio no está dirigido a menores de 13 años. No recopilamos intencionalmente
          información de menores de 13 años.
        </p>
      </section>

      <section>
        <h2>7. Contacto</h2>
        <p>
          Si tienes preguntas sobre esta política de privacidad, contáctanos a través del
          sitio web.
        </p>
      </section>
    </div>
  );
}
