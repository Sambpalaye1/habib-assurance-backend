import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Habib Groupe — Courtier Assurance Auto à Dakar, Sénégal" },
      { name: "description", content: "Contactez Habib Groupe à Dakar (Grand Mbao) pour votre assurance auto au Sénégal : téléphone +221 77 759 27 23, WhatsApp 7j/7, email. Réponse sous 1 heure, attestation en 30 minutes." },
      { name: "keywords", content: "contact courtier assurance Dakar, assurance auto Grand Mbao, agence assurance Sénégal, WhatsApp assurance Dakar, téléphone Habib Groupe" },
      { name: "robots", content: "index, follow" },
      { name: "geo.region", content: "SN-DK" },
      { name: "geo.placename", content: "Dakar, Grand Mbao" },
      { name: "geo.position", content: "14.7333;-17.3833" },
      { name: "ICBM", content: "14.7333, -17.3833" },
      { property: "og:title", content: "Contact Habib Groupe — Assurance Auto Dakar" },
      { property: "og:description", content: "Joignez-nous pour votre devis ou pour une question sur votre contrat. Réponse sous 1h." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_SN" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Contact Habib Groupe — Assurance Auto Sénégal" },
      { name: "twitter:description", content: "Téléphone, WhatsApp 7j/7, email — réponse sous 1 heure." },
    ],
    links: [{ rel: "canonical", href: "https://habibgroupe.com/contact" }],
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
                { "@type": "ListItem", position: 2, name: "Contact", item: "https://habibgroupe.com/contact" },
              ],
            },
            {
              "@type": "ContactPage",
              url: "https://habibgroupe.com/contact",
              mainEntity: {
                "@type": "InsuranceAgency",
                name: "Habib Groupe",
                telephone: "+221777592723",
                email: "contact@habibgroupe.com",
                address: { "@type": "PostalAddress", streetAddress: "Grand Mbao", addressLocality: "Dakar", addressCountry: "SN" },
                openingHours: "Mo-Sa 08:00-19:00",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const wa = "https://wa.me/221777592723?text=Bonjour%20Habib%20Groupe%2C%20j'aimerais%20un%20renseignement%20sur%20l'assurance%20auto.";
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-20">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-2 md:px-6">
          <div>
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">Contact</span>
            <h1 className="mt-4 font-display text-4xl font-bold text-primary md:text-5xl">Parlons de votre assurance</h1>
            <p className="mt-4 text-muted-foreground">Notre équipe vous répond en moins d'une heure, du lundi au samedi. Pour toute urgence, contactez-nous par WhatsApp 7j/7.</p>
            <p className="mt-3 inline-block rounded-lg border border-gold/30 bg-gold/5 px-3 py-1.5 text-sm font-semibold text-foreground">⚡ Attestation envoyée en <span className="text-gold">30 min max</span> sur WhatsApp</p>

            <div className="mt-8 space-y-5">
              <ContactLine icon={Phone} title="Téléphone" value="+221 77 759 27 23" href="tel:+221777592723" />
              <ContactLine icon={WhatsAppIcon} title="WhatsApp" value="Discuter avec Maguette" href={wa} />
              <ContactLine icon={Mail} title="Email" value="contact@habibgroupe.com" href="mailto:contact@habibgroupe.com" />
              <ContactLine icon={MapPin} title="Bureau" value="Dakar, Grand Mbao" />
              <ContactLine icon={Clock} title="Horaires" value="Lun-Sam : 8h - 19h" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-elevated">
            <h2 className="font-display text-2xl font-bold text-primary">Envoyez-nous un message</h2>
            <p className="mt-1 text-sm text-muted-foreground">Nous vous recontactons rapidement.</p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const msg = `Bonjour, je suis ${f.get("nom")} (${f.get("tel")}). ${f.get("message")}`;
                window.open(`https://wa.me/221777592723?text=${encodeURIComponent(msg)}`, "_blank");
              }}
            >
              <Field label="Nom complet" name="nom" required />
              <Field label="Téléphone" name="tel" type="tel" required />
              <Field label="Email" name="email" type="email" />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Votre message</label>
                <textarea name="message" rows={4} required maxLength={1000} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">Envoyer via WhatsApp</Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ContactLine({ icon: Icon, title, value, href }: { icon: React.ElementType; title: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="text-base font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block transition-opacity hover:opacity-80">{content}</a> : content;
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}{required && <span className="text-destructive"> *</span>}</label>
      <input type={type} name={name} required={required} maxLength={255} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
