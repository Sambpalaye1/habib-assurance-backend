// Barème officiel Habib Groupe (FCFA) - Responsabilité Civile obligatoire
export type Duree = "1m" | "2m" | "3m" | "6m" | "1an";
export type CategorieVehicule = "particulier" | "moto-jakarta" | "moto-3roues" | "scooter-plus125" | "scooter-moins125";
export type PuissanceFiscale = "2" | "3-6" | "7-10" | "11-14" | "15-23" | "24+";
export type UsageVehicule = "particulier" | "commercial" | "transport";
export type Compagnie = "allianz" | "askia" | "finafrica" | "providence";
export type TypeAssurance = "rc" | "rc-vol-incendie" | "tous-risques";

export const DUREES: { value: Duree; label: string; mois: number }[] = [
  { value: "1m", label: "1 mois", mois: 1 },
  { value: "2m", label: "2 mois", mois: 2 },
  { value: "3m", label: "3 mois", mois: 3 },
  { value: "6m", label: "6 mois", mois: 6 },
  { value: "1an", label: "1 an", mois: 12 },
];

export const PUISSANCES: { value: PuissanceFiscale; label: string }[] = [
  { value: "2", label: "2 CV" },
  { value: "3-6", label: "3 à 6 CV" },
  { value: "7-10", label: "7 à 10 CV" },
  { value: "11-14", label: "11 à 14 CV" },
  { value: "15-23", label: "15 à 23 CV" },
  { value: "24+", label: "24 CV & plus" },
];

export const CATEGORIES: { value: CategorieVehicule; label: string; needsPuissance: boolean }[] = [
  { value: "particulier", label: "Véhicule particulier", needsPuissance: true },
  { value: "moto-jakarta", label: "Moto Jakarta", needsPuissance: false },
  { value: "moto-3roues", label: "Moto / Tricycle 3 roues", needsPuissance: false },
  { value: "scooter-plus125", label: "Scooter + de 125 cm³", needsPuissance: false },
  { value: "scooter-moins125", label: "Scooter - de 125 cm³", needsPuissance: false },
];

// Usage : coefficient appliqué à la prime de base
export const USAGES: { value: UsageVehicule; label: string; description: string; coef: number }[] = [
  { value: "particulier", label: "Particulier", description: "Trajets privés et domicile-travail", coef: 1 },
  { value: "commercial", label: "Commercial / Affaires", description: "Visites clients, livraisons légères", coef: 1.25 },
  { value: "transport", label: "Transport public", description: "Taxi, VTC, transport de marchandises", coef: 1.6 },
];

// Compagnies partenaires agréées au Sénégal
export const COMPAGNIES: { value: Compagnie; label: string; description: string; coef: number }[] = [
  { value: "allianz", label: "Allianz Sénégal", description: "Leader international, sinistres < 48h", coef: 1.05 },
  { value: "askia", label: "Askia Assurances", description: "Acteur sénégalais de référence", coef: 1.0 },
  { value: "finafrica", label: "Finafrica Assurances", description: "Tarifs compétitifs, service rapide", coef: 0.97 },
  { value: "providence", label: "La Providence", description: "Couverture étendue, ancienneté forte", coef: 1.02 },
];

// Type d'assurance : coefficient multiplicateur sur la RC de base
export const TYPES_ASSURANCE: { value: TypeAssurance; label: string; description: string; coef: number }[] = [
  { value: "rc", label: "Responsabilité Civile (RC)", description: "Couverture obligatoire — dommages aux tiers", coef: 1 },
  { value: "rc-vol-incendie", label: "RC + Vol & Incendie", description: "RC + protection contre vol et incendie", coef: 1.45 },
  { value: "tous-risques", label: "Tous Risques", description: "Protection complète : RC, vol, incendie, dommages tous accidents, bris de glace", coef: 2.3 },
];

// Tarifs particuliers : [puissance][durée]
const TARIFS_PARTICULIER: Record<PuissanceFiscale, Record<Duree, number>> = {
  "2":     { "1m": 6285,  "2m": 9895,  "3m": 12960, "6m": 22161, "1an": 38806 },
  "3-6":   { "1m": 7446,  "2m": 11132, "3m": 14815, "6m": 25869, "1an": 45871 },
  "7-10":  { "1m": 7927,  "2m": 12093, "3m": 16258, "6m": 28754, "1an": 51367 },
  "11-14": { "1m": 9119,  "2m": 14473, "3m": 19830, "6m": 35898, "1an": 64974 },
  "15-23": { "1m": 10812, "2m": 17864, "3m": 24914, "6m": 46065, "1an": 84339 },
  "24+":   { "1m": 12256, "2m": 20750, "3m": 29244, "6m": 54725, "1an": 100834 },
};

const TARIFS_DEUX_TROIS_ROUES: Record<Exclude<CategorieVehicule, "particulier">, Record<Duree, number>> = {
  "moto-jakarta":     { "1m": 5293, "2m": 6826,  "3m": 8357,  "6m": 12951, "1an": 21265 },
  "moto-3roues":      { "1m": 7097, "2m": 10429, "3m": 13764, "6m": 23765, "1an": 41863 },
  "scooter-plus125":  { "1m": 6817, "2m": 9311,  "3m": 12080, "6m": 20488, "1an": 35469 },
  "scooter-moins125": { "1m": 6165, "2m": 8565,  "3m": 10967, "6m": 18171, "1an": 31207 },
};

export type CalculInput = {
  categorie: CategorieVehicule;
  duree: Duree;
  puissance?: PuissanceFiscale;
  usage?: UsageVehicule;
  compagnie?: Compagnie;
  typeAssurance?: TypeAssurance;
  /** Si fourni, écrase `duree` : nombre de mois personnalisé (1-60). */
  customMonths?: number;
};

export type CalculResult = {
  base: number;
  total: number;
  details: { label: string; value: string }[];
};

function getBase(categorie: CategorieVehicule, duree: Duree, puissance?: PuissanceFiscale): number {
  if (categorie === "particulier") {
    if (!puissance) return 0;
    return TARIFS_PARTICULIER[puissance][duree];
  }
  return TARIFS_DEUX_TROIS_ROUES[categorie][duree];
}

/** Tarif barème pour un nombre de mois quelconque, par interpolation linéaire entre les paliers (1,2,3,6,12). */
function getBaseCustomMonths(
  categorie: CategorieVehicule,
  months: number,
  puissance?: PuissanceFiscale,
): number {
  const m = Math.max(1, Math.min(60, Math.round(months)));
  const tiers: { mois: number; duree: Duree }[] = [
    { mois: 1, duree: "1m" },
    { mois: 2, duree: "2m" },
    { mois: 3, duree: "3m" },
    { mois: 6, duree: "6m" },
    { mois: 12, duree: "1an" },
  ];
  // Au-delà d'1 an : prorata annuel
  if (m >= 12) {
    const annuel = getBase(categorie, "1an", puissance);
    return Math.round((annuel * m) / 12);
  }
  // Trouver les deux paliers encadrants
  for (let i = 0; i < tiers.length - 1; i++) {
    const a = tiers[i];
    const b = tiers[i + 1];
    if (m >= a.mois && m <= b.mois) {
      const pa = getBase(categorie, a.duree, puissance);
      const pb = getBase(categorie, b.duree, puissance);
      if (m === a.mois) return pa;
      if (m === b.mois) return pb;
      const ratio = (m - a.mois) / (b.mois - a.mois);
      return Math.round(pa + (pb - pa) * ratio);
    }
  }
  return getBase(categorie, "1m", puissance);
}

export function calculerPrimeDetail(input: CalculInput): CalculResult {
  const base = input.customMonths
    ? getBaseCustomMonths(input.categorie, input.customMonths, input.puissance)
    : getBase(input.categorie, input.duree, input.puissance);
  const usage = USAGES.find((u) => u.value === (input.usage ?? "particulier"))!;
  const compagnie = COMPAGNIES.find((c) => c.value === (input.compagnie ?? "askia"))!;
  const type = TYPES_ASSURANCE.find((t) => t.value === (input.typeAssurance ?? "rc"))!;

  const total = Math.round(base * usage.coef * compagnie.coef * type.coef);
  const dureeLabel = input.customMonths
    ? `${input.customMonths} mois (personnalisé)`
    : DUREES.find((d) => d.value === input.duree)?.label ?? "";

  return {
    base,
    total,
    details: [
      { label: "Prime de base RC", value: formatFCFA(base) },
      { label: "Durée", value: dureeLabel },
      { label: "Type d'assurance", value: `${type.label} (×${type.coef})` },
      { label: "Usage", value: `${usage.label} (×${usage.coef})` },
      { label: "Compagnie", value: `${compagnie.label} (×${compagnie.coef})` },
    ],
  };
}

// Compat
export function calculerPrime(
  categorie: CategorieVehicule,
  duree: Duree,
  puissance?: PuissanceFiscale
): number {
  return getBase(categorie, duree, puissance);
}

export function formatFCFA(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}
