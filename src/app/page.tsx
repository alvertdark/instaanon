import type { Metadata } from 'next';
import { SearchSection } from '@/components/home/SearchSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FaqSection } from '@/components/home/FaqSection';
import { StatsBar } from '@/components/home/StatsBar';
import { AdBanner } from '@/components/ads/AdBanner';
import { JsonLd } from '@/components/seo/JsonLd';
import { getWebAppSchema, getFaqSchema, SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_NAME} — Ver Instagram Anónimamente Gratis | Perfiles, Historias y Más`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} — Ver Instagram Anónimamente Gratis`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd schema={getWebAppSchema()} />
      <JsonLd schema={getFaqSchema()} />

      {/* Hero + Search */}
      <SearchSection />

      {/* Ad Banner below hero */}
      <div className="container" style={{ marginTop: '1.5rem' }}>
        <AdBanner slot="top-banner" format="horizontal" />
      </div>

      {/* Stats bar */}
      <StatsBar />

      {/* How it works */}
      <HowItWorks />

      {/* FAQ — Rich snippets for Google */}
      <FaqSection />

      {/* Ad Banner at bottom */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <AdBanner slot="bottom-banner" format="horizontal" />
      </div>
    </>
  );
}
