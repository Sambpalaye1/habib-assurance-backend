import { useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, CheckCircle2, Sparkles, Building2, Briefcase, Shield } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CATEGORIES, DUREES, PUISSANCES, USAGES, COMPAGNIES, TYPES_ASSURANCE,
  calculerPrimeDetail, formatFCFA,
  type CategorieVehicule, type Duree, type PuissanceFiscale,
  type UsageVehicule, type Compagnie, type TypeAssurance,
} from "@/lib/tarifs";

type FormState = {
  nom: string;
  telephone: string;
  immatriculation: string;
  marque: string;
  modele: string;
  dateMiseEnCirculation: Date | undefined;
  categorie: CategorieVehicule;
  puissance: PuissanceFiscale;
  duree: Duree;
  usage: UsageVehicule;
  compagnie: Compagnie;
  typeAssurance: TypeAssurance;
  useCustomDuree: boolean;
  customMonths: number;
};

const initial: FormState = {
  nom: "", telephone: "", immatriculation: "", marque: "", modele: "",
  dateMiseEnCirculation: undefined,
  categorie: "particulier", puissance: "3-6", duree: "1an",
  usage: "particulier", compagnie: "askia", typeAssurance: "rc",
  useCustomDuree: false, customMonths: 4,
};

const USAGE_ICONS: Record<UsageVehicule, typeof Briefcase> = {
  particulier: Shield,
  commercial: Briefcase,
  transport: Building2,
};

export function DevisCalculator() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);

  const cat = CATEGORIES.find((c) => c.value === form.categorie)!;
  const result = useMemo(
    () => calculerPrimeDetail({
      categorie: form.categorie,
      duree: form.duree,
      puissance: cat.needsPuissance ? form.puissance : undefined,
      usage: form.usage,
      compagnie: form.compagnie,
      typeAssurance: form.typeAssurance,
      customMonths: form.useCustomDuree ? form.customMonths : undefined,
    }),
    [form, cat.needsPuissance],
  );

  const dureeLabel = form.useCustomDuree
    ? `${form.customMonths} mois`
    : DUREES.find((d) => d.value === form.duree)?.label ?? "";

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((p) => ({ ...p, [k]: v }));

  const sendWhatsApp = () => {
    const dateStr = form.dateMiseEnCirculation ? format(form.dateMiseEnCirculation, "dd/MM/yyyy") : "—";
    const usageL = USAGES.find((u) => u.value === form.usage)?.label;
    const compL = COMPAGNIES.find((c) => c.value === form.compagnie)?.label;
    const typeL = TYPES_ASSURANCE.find((t) => t.value === form.typeAssurance)?.label;
    const msg =
      `🚗 *DEMANDE DE DEVIS — HABIB GROUPE*%0A%0A` +
      `👤 *Client :* ${form.nom}%0A` +
      `📞 *Téléphone :* ${form.telephone}%0A%0A` +
      `🚙 *Véhicule*%0A` +
      `• Marque/Modèle : ${form.marque} ${form.modele}%0A` +
      `• Immatriculation : ${form.immatriculation || "—"}%0A` +
      `• 1ère mise en circulation : ${dateStr}%0A` +
      `• Catégorie : ${cat.label}%0A` +
      (cat.needsPuissance ? `• Puissance fiscale : ${PUISSANCES.find((p) => p.value === form.puissance)?.label}%0A` : "") +
      `%0A🛡️ *Couverture*%0A` +
      `• Usage : ${usageL}%0A` +
      `• Type d'assurance : ${typeL}%0A` +
      `• Compagnie : ${compL}%0A` +
      `• Durée : ${dureeLabel}%0A%0A` +
      `💰 *Prime totale estimée : ${formatFCFA(result.total)}*`;
    window.open(`https://wa.me/221777592723?text=${msg}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => document.getElementById("resultat")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);

    // Enregistrement silencieux du lead pour le suivi commission (best-effort)
    try {
      await supabase.from("sales").insert({
        client_name: form.nom,
        client_phone: form.telephone,
        vehicle_brand: form.marque,
        vehicle_model: form.modele,
        vehicle_cv: cat.needsPuissance ? parseInt(form.puissance.split("-")[0], 10) || null : null,
        formula: `${TYPES_ASSURANCE.find((t) => t.value === form.typeAssurance)?.label} - ${COMPAGNIES.find((c) => c.value === form.compagnie)?.label}`,
        duration_months: form.useCustomDuree ? form.customMonths : (DUREES.find((d) => d.value === form.duree)?.mois ?? 12),
        premium_paid: result.total,
        broker_profit: 0,
        status: "pending",
      });
    } catch (err) {
      console.error("Sale recording failed:", err);
    }

    // Envoi automatique WhatsApp dès validation du devis
    setTimeout(() => sendWhatsApp(), 400);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* FORM */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-elevated md:p-8">
        <SectionTitle index={1} title="Vos coordonnées" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom complet" required>
            <input value={form.nom} onChange={(e) => update("nom", e.target.value)} maxLength={100} required className={inputCls} placeholder="Awa Diop" />
          </Field>
          <Field label="Téléphone" required>
            <input type="tel" value={form.telephone} onChange={(e) => update("telephone", e.target.value)} maxLength={20} required className={inputCls} placeholder="77 123 45 67" />
          </Field>
        </div>

        <SectionTitle index={2} title="Votre véhicule" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Marque" required>
            <input value={form.marque} onChange={(e) => update("marque", e.target.value)} maxLength={50} required className={inputCls} placeholder="Toyota" />
          </Field>
          <Field label="Modèle" required>
            <input value={form.modele} onChange={(e) => update("modele", e.target.value)} maxLength={50} required className={inputCls} placeholder="Corolla" />
          </Field>
          <Field label="Immatriculation">
            <input value={form.immatriculation} onChange={(e) => update("immatriculation", e.target.value.toUpperCase())} maxLength={20} className={inputCls} placeholder="DK 1234 AB" />
          </Field>
          <Field label="Date de 1ère mise en circulation" required>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className={cn("h-10 w-full justify-start text-left font-normal", !form.dateMiseEnCirculation && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.dateMiseEnCirculation ? format(form.dateMiseEnCirculation, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.dateMiseEnCirculation}
                  onSelect={(d) => update("dateMiseEnCirculation", d)}
                  disabled={(date) => date > new Date() || date < new Date("1960-01-01")}
                  defaultMonth={form.dateMiseEnCirculation ?? new Date(2018, 0)}
                  captionLayout="dropdown"
                  startMonth={new Date(1960, 0)}
                  endMonth={new Date(new Date().getFullYear(), 11)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </Field>
        </div>

        <SectionTitle index={3} title="Catégorie & puissance" />
        <div className="space-y-5">
          <Field label="Catégorie de véhicule" required>
            <select value={form.categorie} onChange={(e) => update("categorie", e.target.value as CategorieVehicule)} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>

          {cat.needsPuissance && (
            <Field label="Puissance fiscale (CV)" required>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PUISSANCES.map((p) => (
                  <ChoiceChip key={p.value} active={form.puissance === p.value} onClick={() => update("puissance", p.value)}>{p.label}</ChoiceChip>
                ))}
              </div>
            </Field>
          )}
        </div>

        <SectionTitle index={4} title="Usage du véhicule" />
        <div className="grid gap-3 sm:grid-cols-3">
          {USAGES.map((u) => {
            const Icon = USAGE_ICONS[u.value];
            const active = form.usage === u.value;
            return (
              <button
                key={u.value}
                type="button"
                onClick={() => update("usage", u.value)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all",
                  active ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-background hover:border-primary/40",
                )}
              >
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-primary">{u.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{u.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        <SectionTitle index={5} title="Type d'assurance" />
        <div className="space-y-2">
          {TYPES_ASSURANCE.map((t) => {
            const active = form.typeAssurance === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => update("typeAssurance", t.value)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
                  active ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-background hover:border-primary/40",
                )}
              >
                <div className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  active ? "border-primary bg-primary" : "border-muted-foreground/40",
                )}>
                  {active && <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                </div>
                <div className="flex-1">
                  <div className="font-display text-sm font-bold text-primary">{t.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{t.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        <SectionTitle index={6} title="Compagnie d'assurance" />
        <div className="grid gap-2 sm:grid-cols-2">
          {COMPAGNIES.map((c) => {
            const active = form.compagnie === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => update("compagnie", c.value)}
                className={cn(
                  "rounded-xl border-2 p-3 text-left transition-all",
                  active ? "border-gold bg-gold/10 shadow-soft" : "border-border bg-background hover:border-gold/50",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="font-display text-sm font-bold text-primary">{c.label}</div>
                  {active && <CheckCircle2 className="h-4 w-4 text-gold" />}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{c.description}</div>
              </button>
            );
          })}
        </div>

        <SectionTitle index={7} title="Durée de couverture" />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {DUREES.map((d) => (
            <ChoiceChip
              key={d.value}
              active={!form.useCustomDuree && form.duree === d.value}
              onClick={() => { update("useCustomDuree", false); update("duree", d.value); }}
            >{d.label}</ChoiceChip>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-border bg-background p-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={form.useCustomDuree}
              onChange={(e) => update("useCustomDuree", e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Durée personnalisée (en mois)
          </label>
          {form.useCustomDuree && (
            <div className="mt-3 flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={60}
                value={form.customMonths}
                onChange={(e) => update("customMonths", Math.max(1, Math.min(60, parseInt(e.target.value || "1", 10))))}
                className={cn(inputCls, "max-w-[120px]")}
                placeholder="ex : 4"
              />
              <span className="text-sm text-muted-foreground">mois (1 à 60) — tarif calculé au prorata du barème officiel.</span>
            </div>
          )}
        </div>

        <Button type="submit" variant="hero" size="xl" className="mt-8 w-full">
          <Sparkles className="h-4 w-4" /> Calculer mon devis
        </Button>
      </form>

      {/* RESULT */}
      <div id="resultat" className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-[oklch(0.32_0.12_255)] text-primary-foreground shadow-elevated">
          <div className="p-6">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-80">Estimation en direct</div>
            <div className="mt-2 font-display text-sm opacity-90">Prime totale — {dureeLabel}</div>
            <div className="mt-3 font-display text-4xl font-bold md:text-5xl">{formatFCFA(result.total)}</div>
            <div className="mt-2 text-xs opacity-75">{TYPES_ASSURANCE.find((t) => t.value === form.typeAssurance)?.label} · {COMPAGNIES.find((c) => c.value === form.compagnie)?.label}</div>
          </div>

          <div className="space-y-2 border-t border-white/15 bg-black/10 p-6 text-sm">
            <Row label="Catégorie" value={cat.label} />
            {cat.needsPuissance && <Row label="Puissance" value={PUISSANCES.find((p) => p.value === form.puissance)?.label ?? ""} />}
            <Row label="Usage" value={USAGES.find((u) => u.value === form.usage)?.label ?? ""} />
            <Row label="Type" value={TYPES_ASSURANCE.find((t) => t.value === form.typeAssurance)?.label ?? ""} />
            <Row label="Compagnie" value={COMPAGNIES.find((c) => c.value === form.compagnie)?.label ?? ""} />
            <Row label="Durée" value={dureeLabel} />
            {form.dateMiseEnCirculation && <Row label="1ère circulation" value={format(form.dateMiseEnCirculation, "dd/MM/yyyy")} />}
            <div className="!mt-3 border-t border-white/15 pt-3">
              <Row label="Prime de base RC" value={formatFCFA(result.base)} />
            </div>
          </div>
        </div>

        {submitted && (
          <div className="mt-4 rounded-2xl border border-success/30 bg-success/10 p-5 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <div>
                <div className="font-semibold text-foreground">Demande envoyée à Maguette ✅</div>
                <p className="mt-1 text-muted-foreground">
                  Votre attestation d'assurance vous est envoyée par WhatsApp en <strong className="text-foreground">30 minutes maximum</strong>.
                </p>
              </div>
            </div>
            <Button type="button" onClick={sendWhatsApp} variant="gold" size="lg" className="mt-4 w-full">
              <WhatsAppIcon className="h-4 w-4" /> Renvoyer sur WhatsApp
            </Button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gold/30 bg-gold/5 px-3 py-2 text-xs font-medium text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          Attestation envoyée en <strong>30 min max</strong> sur WhatsApp
        </div>

        <p className="mt-4 px-1 text-xs text-muted-foreground">
          Tarifs indicatifs basés sur le barème officiel Habib Groupe. Le contrat final est établi après vérification des documents.
        </p>
      </div>
    </div>
  );
}

const inputCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}{required && <span className="text-destructive"> *</span>}</label>
      {children}
    </div>
  );
}

function SectionTitle({ index, title }: { index: number; title: string }) {
  return (
    <div className="mb-4 mt-6 flex items-center gap-3 first:mt-0">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index}</span>
      <h2 className="font-display text-lg font-bold text-primary">{title}</h2>
    </div>
  );
}

function ChoiceChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cn(
      "rounded-md border px-3 py-2 text-sm font-medium transition-all",
      active ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent/40",
    )}>{children}</button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="opacity-75">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
