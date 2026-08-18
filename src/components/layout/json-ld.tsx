const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: "Kamerinos by Sandra Pinzon",
  description:
    "Centro de bienestar y estética en Bogotá. Servicios profesionales de cuidado facial, corporal, capilar, masajes terapéuticos y tratamientos de belleza personalizados.",
  url: SITE_URL,
  telephone: "+573041338567",
  email: "kamerinosg@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle 53b # 25-21",
    addressLocality: "Bogotá",
    addressRegion: "Cundinamarca",
    addressCountry: "CO",
    postalCode: "111311",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 4.64271,
    longitude: -74.07480,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  priceRange: "$$",
  currenciesAccepted: "COP",
  paymentAccepted: "Credit Card, Debit Card, PSE, Nequi",
  image: `${SITE_URL}/og-image.jpg`,
  sameAs: [],
}

const WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kamerinos by Sandra Pinzon",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/servicios?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
}

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kamerinos by Sandra Pinzon",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.jpg`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+573041338567",
    contactType: "customer service",
    availableLanguage: ["Spanish"],
  },
}

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
      />
    </>
  )
}
