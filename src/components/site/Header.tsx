import { Link } from "@tanstack/react-router";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/habib-logo.png";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Accueil" },
    { to: "/devis", label: "Devis en ligne" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center" aria-label="Habib Groupe — Accueil">
          <img src={logo} alt="Habib Groupe — Votre sécurité, notre priorité" className="h-12 w-auto md:h-14" width={620} height={236} />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href="tel:+221777592723" className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Phone className="h-4 w-4" /> 77 759 27 23
          </a>
          <Button asChild size="sm" variant="gold">
            <Link to="/devis">Devis gratuit</Link>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                {l.label}
              </Link>
            ))}
            <a href="tel:+221777592723" className="rounded-md px-3 py-2 text-sm font-semibold text-primary">📞 77 759 27 23</a>
            <Button asChild variant="gold" className="mt-2">
              <Link to="/devis" onClick={() => setOpen(false)}>Obtenir mon devis</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
