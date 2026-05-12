import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Shield, Car, FileCheck, Clock, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Assurance Auto Sénégal : RC, Tous Risques, Vol — Habib Groupe" },
      { name: "description", content: "Tous nos services d'assurance auto au Sénégal : Responsabilité Civile, Tous Risques, Vol & Incendie, courte durée, assurance moto et scooter. Devis instantané, attestation WhatsApp en 30 min." },
      { name: "keywords", content: "assurance tous risques Sénégal, RC auto Dakar, assurance vol incendie voiture, assurance courte durée Sénégal, assurance moto Jakarta, assurance scooter Dakar, courtier assurance auto Sénégal" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "SN-DK" },
      { property: "og:title", content: "Services d'assurance auto au Sénégal — Habib Groupe" },
      { property: "og:description", content: "RC, Tous Risques, Vol & Incendie, courte durée 1 mois à 1 an. Allianz, Askia, Finafrica, La Providence." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_SN" },
      { property: "og:site_name", content: "Habib Groupe" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Services Habib Groupe — Assurance Auto Sénégal" },
      { name: "twitter:description", content: "Toutes les couvertures auto et 2-roues au Sénégal." },
    ],
    links: [{ rel: "canonical", href: "https://habibgroupe.com/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://habibgroupe.com/" },
            { "@type": "ListItem", position: 2, name: "Services", item: "https://habibgroupe.com/services" },
          ],
        }),
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Shield, title: "Responsabilité Civile", desc: "L'assurance obligatoire au Sénégal. Couvre les dommages causés aux tiers." },
  { icon: Car, title: "Tous Risques", desc: "Couverture maximale : tiers, vol, incendie, dommages tous accidents." },
  { icon: FileCheck, title: "Vol & Incendie", desc: "Protégez votre véhicule contre le vol et les incendies en complément du tiers." },
  { icon: Clock, title: "Courte durée", desc: "Souscrivez de 1 mois à 1 an selon vos besoins. Idéal pour véhicules occasionnels." },
  { icon: Headphones, title: "Assistance 24/7", desc: "Conseiller dédié joignable par WhatsApp 7j/7 pour toutes vos questions." },
  { icon: Sparkles, title: "Sinistre en 48h", desc: "Prise en charge accélérée et suivi complet de votre dossier sinistre." },
];

function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-secondary/40 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center md:px-6">
            <h1 className="font-display text-4xl font-bold text-primary md:text-5xl">Nos services d'assurance</h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Des solutions adaptées à chaque conducteur, chaque véhicule et chaque budget.</p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto grid gap-6 px-4 md:grid-cols-2 md:px-6 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="group rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-primary">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-primary py-16 text-primary-foreground">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center md:px-6">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Besoin d'un devis personnalisé ?</h2>
            <p className="max-w-xl opacity-90">Obtenez votre tarif en 30 secondes, sans engagement.</p>
            <Button asChild variant="gold" size="xl">
              <Link to="/devis">Calculer mon devis</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
