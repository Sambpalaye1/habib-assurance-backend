import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Users, Award, ArrowRight, Calculator, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroCar from "@/assets/hero-car.jpg";

const FAQS = [
  {
    q: "Comment obtenir un devis d'assurance auto au Sénégal en ligne ?",
    a: "Avec Habib Groupe, obtenir un devis d'assurance auto au Sénégal prend moins de 30 secondes. Rendez-vous sur notre calculateur en ligne, indiquez la puissance fiscale de votre véhicule (en chevaux fiscaux, CV), la date de 1ère mise en circulation ainsi que la durée de couverture souhaitée (de 1 à 12 mois). Le tarif Responsabilité Civile (RC) s'affiche immédiatement, calculé selon le barème officiel appliqué par les compagnies agréées au Sénégal (Allianz, Askia, Finafrica, La Providence). Vous pouvez ensuite valider votre devis directement sur WhatsApp avec votre conseiller dédié à Dakar.",
  },
  {
    q: "Quel est le prix d'une assurance auto au Sénégal en 2026 ?",
    a: "Le prix d'une assurance auto au Sénégal dépend de plusieurs facteurs : la puissance fiscale du véhicule (CV), le type de couverture (Responsabilité Civile obligatoire ou Tous Risques), la durée de souscription et l'âge du véhicule. Chez Habib Groupe, les tarifs commencent à 6 285 FCFA par mois pour un véhicule de 2 CV en RC simple. Pour un véhicule de 7 à 10 CV, comptez environ 9 500 à 14 000 FCFA mensuels. Notre calculateur en ligne vous donne le prix exact selon le barème officiel des compagnies d'assurance sénégalaises, sans engagement.",
  },
  {
    q: "L'assurance auto est-elle obligatoire au Sénégal ?",
    a: "Oui, la Responsabilité Civile (RC) automobile est strictement obligatoire au Sénégal pour tout véhicule à moteur circulant sur la voie publique, conformément au Code CIMA (Conférence Interafricaine des Marchés d'Assurances). Conduire sans assurance expose le conducteur à des amendes, à la mise en fourrière du véhicule, et à une responsabilité financière totale en cas d'accident. Habib Groupe vous propose des polices RC agréées Allianz, Askia, Finafrica et La Providence, avec attestation provisoire envoyée le jour même.",
  },
  {
    q: "Que faire en cas de sinistre avec mon assurance auto Habib Groupe ?",
    a: "En cas de sinistre auto au Sénégal (accident, vol, bris de glace), contactez immédiatement Habib Groupe au 77 759 27 23 ou via WhatsApp 7j/7. Votre conseiller dédié vous accompagne dans la déclaration auprès de la compagnie d'assurance, le constat amiable, l'expertise du véhicule et le suivi de l'indemnisation. Notre équipe traite votre dossier sinistre en moins de 48 heures grâce à des relations directes avec Allianz, Askia, Finafrica et La Providence.",
  },
  {
    q: "Quelle différence entre Responsabilité Civile (RC) et Tous Risques ?",
    a: "La Responsabilité Civile (RC) est la couverture minimale obligatoire au Sénégal : elle indemnise les dommages causés à des tiers (autres conducteurs, piétons, biens) mais ne couvre pas votre propre véhicule. La formule Tous Risques inclut la RC plus la garantie dommages tous accidents, le vol, l'incendie, le bris de glace et l'assistance. Habib Groupe vous conseille la formule la plus adaptée à l'âge et à la valeur de votre véhicule lors de l'établissement du devis.",
  },
  {
    q: "Puis-je assurer un véhicule importé d'occasion au Sénégal ?",
    a: "Oui, Habib Groupe assure tous les véhicules immatriculés au Sénégal, y compris les voitures d'occasion importées (Europe, Dubaï, États-Unis). Lors du devis, indiquez simplement la date de 1ère mise en circulation d'origine du véhicule (mentionnée sur la carte grise), la puissance fiscale en CV et la valeur estimée si vous souhaitez une formule Tous Risques. Nous travaillons avec les compagnies les plus flexibles du marché sénégalais pour les véhicules anciens.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Assurance Auto Sénégal — Devis en 30s | Habib Groupe Dakar" },
      { name: "description", content: "Assurance auto au Sénégal : devis instantané en ligne, tarifs officiels Allianz, Askia, Finafrica, La Providence. Couverture immédiate à partir de 6 285 FCFA/mois. Courtier agréé à Dakar." },
      { name: "keywords", content: "assurance auto Sénégal, assurance voiture Dakar, devis assurance auto en ligne, RC auto Sénégal, courtier assurance Dakar, assurance moto Sénégal, assurance Jakarta, assurance scooter Dakar, Allianz Sénégal, Askia Assurances, Finafrica, La Providence, tarif assurance auto Sénégal, attestation assurance WhatsApp, assurance tous risques Sénégal, assurance vol incendie auto, assurance taxi Dakar, assurance véhicule importé Sénégal, prix assurance voiture Dakar, courtier auto Grand Mbao, souscription assurance en ligne Sénégal" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "Habib Groupe" },
      { name: "geo.region", content: "SN-DK" },
      { name: "geo.placename", content: "Dakar" },
      { property: "og:title", content: "Assurance Auto Sénégal — Devis en 30s | Habib Groupe" },
      { property: "og:description", content: "Calculez votre devis assurance auto en 30 secondes. Tarifs officiels, couverture immédiate au Sénégal." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_SN" },
      { property: "og:site_name", content: "Habib Groupe" },
      { property: "og:image", content: heroCar },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Assurance Auto Sénégal — Habib Groupe" },
      { name: "twitter:description", content: "Devis assurance auto instantané au Sénégal. À partir de 6 285 FCFA/mois." },
    ],
    links: [{ rel: "canonical", href: "https://habibgroupe.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "InsuranceAgency",
              "@id": "https://habibgroupe.com/#org",
              name: "Habib Groupe",
              alternateName: "Habib Groupe Assurance Auto Sénégal",
              url: "https://habibgroupe.com/",
              logo: "https://habibgroupe.com/apple-touch-icon.png",
              image: "https://habibgroupe.com/apple-touch-icon.png",
              telephone: "+221777592723",
              email: "contact@habibgroupe.com",
              areaServed: [
                { "@type": "Country", name: "Sénégal" },
                { "@type": "City", name: "Dakar" },
                { "@type": "City", name: "Thiès" },
                { "@type": "City", name: "Saint-Louis" },
                { "@type": "City", name: "Mbour" },
                { "@type": "City", name: "Rufisque" },
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "Grand Mbao",
                addressLocality: "Dakar",
                addressRegion: "Dakar",
                addressCountry: "SN",
              },
              geo: { "@type": "GeoCoordinates", latitude: 14.7333, longitude: -17.3833 },
              openingHoursSpecification: [
                { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "19:00" },
              ],
              priceRange: "FCFA 6285 - 100834",
              currenciesAccepted: "XOF",
              paymentAccepted: "Cash, Mobile Money, Wave, Orange Money, Virement bancaire",
              sameAs: [
                "https://wa.me/221777592723",
              ],
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "247", bestRating: "5", worstRating: "1" },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Assurances auto",
                itemListElement: [
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Assurance Responsabilité Civile auto" }, priceCurrency: "XOF", price: "6285" },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Assurance Tous Risques auto" }, priceCurrency: "XOF" },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Assurance Vol & Incendie auto" }, priceCurrency: "XOF" },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Assurance Moto Jakarta" }, priceCurrency: "XOF", price: "5293" },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Assurance Scooter" }, priceCurrency: "XOF", price: "6165" },
                ],
              },
              description: "Courtier d'assurance auto agréé au Sénégal — devis instantané, attestation WhatsApp en 30 min, partenaire Allianz, Askia, Finafrica, La Providence.",
            },
            {
              "@type": "WebSite",
              "@id": "https://habibgroupe.com/#website",
              url: "https://habibgroupe.com/",
              name: "Habib Groupe",
              inLanguage: "fr-SN",
              publisher: { "@id": "https://habibgroupe.com/#org" },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://habibgroupe.com/devis?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "HowTo",
              name: "Obtenir un devis d'assurance auto au Sénégal",
              description: "Calculez et souscrivez votre assurance auto au Sénégal en 3 étapes.",
              totalTime: "PT2M",
              estimatedCost: { "@type": "MonetaryAmount", currency: "XOF", value: "6285" },
              step: [
                { "@type": "HowToStep", position: 1, name: "Renseigner le véhicule", text: "Indiquez la puissance fiscale (CV) et la date de 1ère mise en circulation." },
                { "@type": "HowToStep", position: 2, name: "Choisir la durée", text: "Sélectionnez la durée de couverture souhaitée (1 à 12 mois)." },
                { "@type": "HowToStep", position: 3, name: "Recevoir l'attestation", text: "Validez le devis sur WhatsApp et recevez votre attestation provisoire dans la journée." },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[image:var(--gradient-hero)]">
          <div className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary animate-shimmer-gold">
                <Award className="h-3.5 w-3.5 text-gold" />
                Agréé · Allianz · Askia · Finafrica · La Providence
              </div>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-primary md:text-6xl">
                L'assurance auto<br />
                <span className="italic text-gold">en 30 secondes</span>
              </h1>
              <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg animate-fade-up delay-100">
                Calculez votre devis Responsabilité Civile au Sénégal en ligne, comparez et souscrivez auprès des meilleures compagnies. <strong className="text-foreground">Votre attestation reçue par WhatsApp en 30 minutes maximum.</strong>
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up delay-200">
                <Button asChild variant="hero" size="xl">
                  <Link to="/devis"><Calculator className="h-4 w-4" /> Calculer mon devis</Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <a href="https://wa.me/221777592723" target="_blank" rel="noreferrer">
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp Maguette
                  </a>
                </Button>
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-foreground sm:grid-cols-4 animate-fade-up delay-300">
                {["Attestation 30 min", "Tarifs officiels", "Réponse < 1h", "Sinistre 48h"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> {t}</li>
                ))}
              </ul>
            </div>

            <div className="relative animate-fade-in-soft delay-200">
              {/* Palette colorée derrière la photo */}
              <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[image:var(--gradient-photo)] opacity-30 blur-3xl" />
              <div className="absolute -right-6 -top-6 -z-10 h-40 w-40 rounded-full bg-gold/30 blur-3xl animate-float-slow" />
              <div className="absolute -bottom-10 -left-6 -z-10 h-48 w-48 rounded-full bg-primary/25 blur-3xl animate-float-slow" style={{ animationDelay: "1.5s" }} />

              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated hover-lift">
                <div className="relative">
                  <img src={heroCar} alt="Assurance véhicule au Sénégal" width={1280} height={896} className="aspect-[5/4] w-full object-cover transition-transform duration-700 hover:scale-105" />
                  {/* Overlay teinté palette */}
                  <div className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-photo)] mix-blend-soft-light opacity-40" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                </div>
              </div>

              <div className="absolute -bottom-5 left-4 rounded-2xl border border-border bg-card px-4 py-3 shadow-elevated md:-bottom-6 md:left-8 animate-fade-up delay-400">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">À partir de</div>
                <div className="font-display text-2xl font-bold text-primary">6 285 FCFA<span className="text-xs font-normal text-muted-foreground"> / mois</span></div>
              </div>
              <div className="absolute -top-3 right-4 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-soft md:-top-4 md:right-8 animate-fade-up delay-300">
                +2 000 clients assurés
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-y border-border bg-card">
          <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 md:px-6">
            {[
              { v: "+2 000", l: "Clients assurés" },
              { v: "48h", l: "Traitement sinistre" },
              { v: "4", l: "Compagnies partenaires" },
              { v: "5 min", l: "Souscription" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display text-3xl font-bold text-primary md:text-4xl">{s.v}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY US */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Pourquoi nous choisir</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">L'assurance auto, <span className="italic text-gold">simplifiée</span></h2>
              <p className="mt-3 text-muted-foreground">Une expérience fluide, du devis jusqu'à la gestion des sinistres.</p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Calculator, title: "Devis instantané", desc: "Calculez votre prime en 30 secondes selon le barème officiel." },
                { icon: Shield, title: "Couverture immédiate", desc: "Votre attestation provisoire vous est envoyée dans la journée." },
                { icon: Users, title: "Conseiller dédié", desc: "Maguette vous accompagne sur WhatsApp 7j/7." },
                { icon: Clock, title: "Sinistre en 48h", desc: "Suivi complet et traitement accéléré de vos dossiers." },
              ].map((f, i) => (
                <div key={f.title} className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift hover:shadow-elevated animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="absolute right-5 top-5 font-display text-3xl font-bold text-accent">0{i + 1}</div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110"><f.icon className="h-5 w-5" /></div>
                  <h3 className="font-display text-lg font-bold text-primary">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNERS */}
        <section className="border-t border-border bg-secondary/40 py-16">
          <div className="container mx-auto px-4 text-center md:px-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Nos partenaires agréés</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">Les meilleures compagnies <span className="italic">sénégalaises</span></h2>
            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              {["ALLIANZ", "ASKIA", "FINAFRICA", "LA PROVIDENCE"].map((n) => (
                <div key={n} className="rounded-xl border border-border bg-card px-6 py-8 font-display text-lg font-bold tracking-wider text-primary shadow-soft transition-all hover:shadow-elevated">{n}</div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto max-w-3xl px-4 md:px-6">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Questions fréquentes</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-4xl">Tout savoir sur <span className="italic">l'assurance auto au Sénégal</span></h2>
            </div>
            <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-6 shadow-soft">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border last:border-b-0">
                  <AccordionTrigger className="font-display text-base font-semibold text-primary">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center md:px-6">
            <h2 className="font-display text-3xl font-bold md:text-5xl">Prêt à assurer votre véhicule ?</h2>
            <p className="max-w-xl opacity-90">Obtenez votre tarif personnalisé en moins d'une minute. Sans engagement.</p>
            <Button asChild variant="gold" size="xl">
              <Link to="/devis">Calculer mon devis <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
