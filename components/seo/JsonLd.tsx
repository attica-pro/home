import { siteConfig, siteUrl } from '@/lib/site-config';

interface JsonLdProps {
  locale: string;
}

export function JsonLd({ locale }: JsonLdProps) {
  const isGreek = locale === 'el';
  const isArabic = locale === 'ar';

  const description = isGreek
    ? 'Εξειδικευμένες εργασίες μόνωσης και στεγανοποίησης ταρατσών, ελαιοχρωματισμοί, ανακαινίσεις και τεχνικές επισκευές στην Αθήνα και όλη την Αττική. 18 χρόνια εμπειρίας, δωρεάν αυτοψία στον χώρο σας.'
    : isArabic
      ? 'أعمال عزل مائي وحراري للأسطح، دهانات وتشطيبات، ترميم وتجديد شقق ومباني في أثينا وأتيكا. خبرة 18 عاماً ومعاينة مجانية في الموقع.'
      : 'Specialized roof insulation, waterproofing, professional painting, and renovations contractor in Athens and Attica. 18 years of experience, free on-site estimate.';

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['RoofingContractor', 'HomeAndConstructionBusiness', 'Painter'],
    name: 'AtticaPro',
    alternateName: isGreek
      ? 'AtticaPro Μονώσεις & Ανακαινίσεις'
      : isArabic
        ? 'أتيكا برو للعزل والتشطيبات'
        : 'AtticaPro Insulation & Renovations',
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/images/hero-mohamed.png`,
    image: `${siteUrl}/images/hero-mohamed.png`,
    description,
    telephone: siteConfig.phoneHref.replace('tel:', ''),
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Λ. Συγγρού 196',
      addressLocality: 'Καλλιθέα',
      addressRegion: 'Αττική',
      postalCode: '17671',
      addressCountry: 'GR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.9547,
      longitude: 23.7089,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '07:30',
        closes: '20:00',
      },
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Αττική' },
      { '@type': 'City', name: 'Καλλιθέα' },
      { '@type': 'City', name: 'Αθήνα' },
      { '@type': 'AdministrativeArea', name: 'Νότια Προάστια' },
      { '@type': 'AdministrativeArea', name: 'Βόρεια Προάστια' },
      { '@type': 'City', name: 'Πειραιάς' },
      { '@type': 'City', name: 'Νέα Σμύρνη' },
      { '@type': 'City', name: 'Παλαιό Φάληρο' },
      { '@type': 'City', name: 'Άλιμος' },
      { '@type': 'City', name: 'Γλυφάδα' },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phoneHref.replace('tel:', ''),
        contactType: 'customer support',
        availableLanguage: ['Greek', 'English', 'Arabic'],
      },
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.landlineHref.replace('tel:', ''),
        contactType: 'office',
        availableLanguage: ['Greek'],
      },
    ],
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.mapsHref,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
