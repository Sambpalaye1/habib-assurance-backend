import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DevisCalculator } from "@/components/devis/DevisCalculator";

export const Route = createFileRoute("/devis")({
  head: () => ({
    meta: [
      { title: "Devis Assurance Auto Sénégal en ligne — Calculateur Habib Groupe" },
      { name: "description", content: "Calculez gratuitement votre devis assurance auto au Sénégal en 30 secondes. Tarif RC officiel selon puissance fiscale (CV) et date de 1ère mise en circulation. À partir de 6 285 FCFA/mois." },
      { name: "keywords", content: "devis assurance auto Sénégal, calculateur assurance voiture Dakar, tarif RC auto, prix assurance auto Sénégal" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Calculateur de devis assurance auto Sénégal — Habib Groupe" },
      { property: "og:description", content: "Devis assurance auto instantané basé sur le barème officiel. Couverture immédiate au Sénégal." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_SN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Devis Assurance Auto Sénégal — Habib Groupe" },
      { name: "twitter:description", content: "Calculateur en ligne gratuit. Devis en 30 secondes." },
    ],
    links: [{ rel: "canonical", href: "https://habibgroupe.com/devis" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Accueil", item: "https://habibgroupe.com/" },
                { "@type": "ListItem", position: 2, name: "Devis", item: "https://habibgroupe.com/devis" },
              ],
            },
            {
              "@type": "Service",
              name: "Devis assurance auto en ligne",
              provider: { "@type": "InsuranceAgency", name: "Habib Groupe", areaServed: "Sénégal" },
              areaServed: { "@type": "Country", name: "Sénégal" },
              serviceType: "Assurance automobile Responsabilité Civile",
              offers: {
                "@type": "Offer",
                priceCurrency: "XOF",
                price: "6285",
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: "6285",
                  priceCurrency: "XOF",
                  unitText: "MONTH",
                },
                availability: "https://schema.org/InStock",
              },
            },
            {
              "@type": "HowTo",
              name: "Calculer son devis assurance auto",
              step: [
                { "@type": "HowToStep", position: 1, name: "Puissance fiscale", text: "Sélectionnez les CV de votre véhicule." },
                { "@type": "HowToStep", position: 2, name: "Date 1ère mise en circulation", text: "Renseignez la date pour calculer l'âge du véhicule." },
                { "@type": "HowToStep", position: 3, name: "Durée de couverture", text: "Choisissez la durée souhaitée et obtenez votre prime." },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: DevisPage,
});

function DevisPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">Devis instantané</span>
            <h1 className="mt-4 font-display text-4xl font-bold text-primary md:text-5xl">Calculez votre devis en 30 secondes</h1>
            <p className="mt-3 text-muted-foreground">Tarifs officiels Habib Groupe — Responsabilité Civile obligatoire (toutes compagnies agréées).</p>
            <p className="mt-2 text-sm font-semibold text-gold">⚡ Votre attestation envoyée par WhatsApp en 30 minutes maximum</p>
          </div>
          <DevisCalculator />
        </div>
      </main>
      <Footer />
    </div>
  );
}
