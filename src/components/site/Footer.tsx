import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/habib-logo.png";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div>
          <img src={logo} alt="Habib Groupe" className="h-14 w-auto" width={620} height={236} />
          <p className="mt-3 text-sm text-muted-foreground">
            Courtier d'assurance auto agréé au Sénégal. Devis instantané, couverture immédiate.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-primary">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-primary">Accueil</Link></li>
            <li><Link to="/devis" className="text-muted-foreground hover:text-primary">Calculer mon devis</Link></li>
            <li><Link to="/services" className="text-muted-foreground hover:text-primary">Nos services</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-primary">Partenaires</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>ALLIANZ</li>
            <li>FINAFRICA</li>
            <li>ASKIA</li>
            <li>LA PROVIDENCE</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-primary">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> 77 759 27 23</li>
            <li className="flex items-center gap-2"><WhatsAppIcon className="h-4 w-4" /> WhatsApp 7j/7</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /><span>contact@habibgroupe.com</span></li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Dakar, Grand Mbao</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Habib Groupe — Tous droits réservés.
      </div>
    </footer>
  );
}
