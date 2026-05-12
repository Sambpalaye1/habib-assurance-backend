import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Download, RefreshCw, TrendingUp, Wallet, Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatFCFA } from "@/lib/tarifs";

type Sale = {
  id: string;
  client_name: string;
  client_phone: string | null;
  vehicle_brand: string | null;
  vehicle_model: string | null;
  formula: string;
  duration_months: number;
  premium_paid: number;
  broker_profit: number;
  dev_share: number;
  status: "pending" | "confirmed" | "cancelled";
  notes: string | null;
  created_at: string;
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Admin — Habib Groupe" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Role = "admin" | "dev" | null;

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [period, setPeriod] = useState<"all" | "30d" | "month" | "year">("all");

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate({ to: "/admin/login" });
        return;
      }
      const userId = sess.session.user.id;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      const userRole = (roles?.[0]?.role as Role) ?? null;
      setRole(userRole);
      if (!userRole) {
        setLoading(false);
        return;
      }
      await loadSales();
      setLoading(false);
    })();
  }, [navigate]);

  const loadSales = async () => {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      return;
    }
    setSales((data ?? []) as Sale[]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const filtered = useMemo(() => {
    let list = sales;
    if (filter !== "all") list = list.filter((s) => s.status === filter);
    if (period !== "all") {
      const now = Date.now();
      const cutoff =
        period === "30d" ? now - 30 * 86400000 :
        period === "month" ? new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() :
        new Date(new Date().getFullYear(), 0, 1).getTime();
      list = list.filter((s) => new Date(s.created_at).getTime() >= cutoff);
    }
    return list;
  }, [sales, filter, period]);

  const stats = useMemo(() => {
    const confirmed = filtered.filter((s) => s.status === "confirmed");
    return {
      total: filtered.length,
      pending: filtered.filter((s) => s.status === "pending").length,
      confirmedCount: confirmed.length,
      totalProfit: confirmed.reduce((sum, s) => sum + Number(s.broker_profit || 0), 0),
      devShare: confirmed.reduce((sum, s) => sum + Number(s.dev_share || 0), 0),
      totalPremium: confirmed.reduce((sum, s) => sum + Number(s.premium_paid || 0), 0),
    };
  }, [filtered]);

  const exportCSV = () => {
    const headers = ["Date", "Client", "Téléphone", "Véhicule", "Formule", "Durée (mois)", "Prime (FCFA)", "Bénéfice courtier (FCFA)", "Part dev 30% (FCFA)", "Statut"];
    const rows = filtered.map((s) => [
      new Date(s.created_at).toLocaleDateString("fr-FR"),
      s.client_name,
      s.client_phone ?? "",
      `${s.vehicle_brand ?? ""} ${s.vehicle_model ?? ""}`.trim(),
      s.formula,
      s.duration_months,
      s.premium_paid,
      s.broker_profit,
      s.dev_share,
      s.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateSale = async (id: string, patch: Partial<Sale>) => {
    const { error } = await supabase.from("sales").update(patch).eq("id", id);
    if (error) {
      alert("Erreur : " + error.message);
      return;
    }
    await loadSales();
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Chargement…</div>;
  }

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-elevated">
          <h1 className="font-display text-2xl font-bold text-primary">Accès refusé</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Votre compte n'a pas les permissions pour accéder à cet espace. Contactez l'administrateur.
          </p>
          <Button onClick={handleLogout} variant="outline" className="mt-6">
            <LogOut className="h-4 w-4" /> Se déconnecter
          </Button>
        </div>
      </div>
    );
  }

  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <h1 className="font-display text-xl font-bold text-primary">Dashboard Commissions</h1>
            <p className="text-xs text-muted-foreground">
              Connecté en tant que <Badge variant="secondary">{role.toUpperCase()}</Badge>
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/">← Site</Link></Button>
            <Button onClick={loadSales} variant="outline" size="sm"><RefreshCw className="h-4 w-4" /></Button>
            <Button onClick={exportCSV} variant="outline" size="sm"><Download className="h-4 w-4" /> CSV</Button>
            <Button onClick={handleLogout} variant="ghost" size="sm"><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:px-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Devis total" value={stats.total.toString()} />
          <StatCard icon={CheckCircle2} label="Ventes confirmées" value={stats.confirmedCount.toString()} accent="success" />
          <StatCard icon={TrendingUp} label="Bénéfice courtier" value={formatFCFA(stats.totalProfit)} />
          <StatCard icon={Wallet} label="Votre part (30%)" value={formatFCFA(stats.devShare)} accent="gold" />
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2 rounded-xl border border-border bg-card p-3">
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="cancelled">Annulées</option>
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value as typeof period)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
            <option value="all">Toute la période</option>
            <option value="30d">30 derniers jours</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">Client</th>
                <th className="px-3 py-2.5">Véhicule</th>
                <th className="px-3 py-2.5">Formule</th>
                <th className="px-3 py-2.5 text-right">Prime</th>
                <th className="px-3 py-2.5 text-right">Bénéfice</th>
                <th className="px-3 py-2.5 text-right">Part 30%</th>
                <th className="px-3 py-2.5">Statut</th>
                {isAdmin && <th className="px-3 py-2.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={isAdmin ? 9 : 8} className="px-3 py-8 text-center text-muted-foreground">Aucune vente pour ces filtres.</td></tr>
              )}
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString("fr-FR")}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium">{s.client_name}</div>
                    {s.client_phone && <div className="text-xs text-muted-foreground">{s.client_phone}</div>}
                  </td>
                  <td className="px-3 py-2.5 text-xs">{[s.vehicle_brand, s.vehicle_model].filter(Boolean).join(" ")}</td>
                  <td className="px-3 py-2.5 text-xs">{s.formula}</td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">{formatFCFA(Number(s.premium_paid))}</td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    {isAdmin ? (
                      <input
                        type="number"
                        defaultValue={s.broker_profit}
                        onBlur={(e) => {
                          const v = parseFloat(e.target.value) || 0;
                          if (v !== Number(s.broker_profit)) updateSale(s.id, { broker_profit: v });
                        }}
                        className="h-8 w-28 rounded border border-input bg-background px-2 text-right text-sm"
                      />
                    ) : formatFCFA(Number(s.broker_profit))}
                  </td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap font-semibold text-gold">{formatFCFA(Number(s.dev_share))}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={s.status} /></td>
                  {isAdmin && (
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">
                      <select
                        value={s.status}
                        onChange={(e) => updateSale(s.id, { status: e.target.value as Sale["status"] })}
                        className="h-8 rounded border border-input bg-background px-2 text-xs"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          💡 Astuce : pour finaliser une vente, saisis le bénéfice réel du courtier (clic sur le champ, puis Tab/clic ailleurs) et passe le statut à <strong>Confirmée</strong>. Ta part 30% est calculée automatiquement.
        </p>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: typeof TrendingUp; label: string; value: string; accent?: "gold" | "success" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className={`h-4 w-4 ${accent === "gold" ? "text-gold" : accent === "success" ? "text-success" : "text-primary"}`} />
        {label}
      </div>
      <div className={`mt-2 font-display text-2xl font-bold ${accent === "gold" ? "text-gold" : "text-primary"}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Sale["status"] }) {
  if (status === "confirmed") return <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success"><CheckCircle2 className="h-3 w-3" /> Confirmée</span>;
  if (status === "cancelled") return <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive"><XCircle className="h-3 w-3" /> Annulée</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"><Clock className="h-3 w-3" /> En attente</span>;
}
