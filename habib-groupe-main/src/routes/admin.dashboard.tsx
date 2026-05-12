import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  MessageSquare, 
  DollarSign,
  Calendar,
  Phone,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface DashboardStats {
  total_policies: number;
  active_policies: number;
  expired_policies: number;
  pending_renewals: number;
  total_revenue: number;
  monthly_revenue: number;
  messages_sent_today: number;
  success_rate: number;
}

interface RecentSale {
  id: string;
  client_name: string;
  client_phone: string;
  formula: string;
  premium_paid: number;
  status: string;
  created_at: string;
}

interface ExpiringPolicy {
  id: string;
  client_name: string;
  client_phone: string;
  formula: string;
  end_date: string;
  days_until_expiry: number;
}

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [expiringPolicies, setExpiringPolicies] = useState<ExpiringPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simuler le chargement des données depuis l'API MySQL
      const mockStats: DashboardStats = {
        total_policies: 150,
        active_policies: 120,
        expired_policies: 30,
        pending_renewals: 15,
        total_revenue: 45000,
        monthly_revenue: 12000,
        messages_sent_today: 25,
        success_rate: 95
      };

      const mockRecentSales: RecentSale[] = [
        {
          id: "1",
          client_name: "Mohammed Ali",
          client_phone: "+212 6XX XXX XXX",
          formula: "Formule Premium",
          premium_paid: 1200,
          status: "confirmed",
          created_at: "2024-01-15T10:30:00Z"
        },
        {
          id: "2", 
          client_name: "Fatima Zahra",
          client_phone: "+212 7XX XXX XXX",
          formula: "Formule Standard",
          premium_paid: 800,
          status: "pending",
          created_at: "2024-01-14T14:20:00Z"
        }
      ];

      const mockExpiringPolicies: ExpiringPolicy[] = [
        {
          id: "1",
          client_name: "Ahmed Hassan",
          client_phone: "+212 6XX XXX XXX",
          formula: "Formule Premium",
          end_date: "2024-01-20",
          days_until_expiry: 3
        },
        {
          id: "2",
          client_name: "Mariam Said",
          client_phone: "+212 7XX XXX XXX", 
          formula: "Formule Standard",
          end_date: "2024-01-19",
          days_until_expiry: 2
        }
      ];

      setStats(mockStats);
      setRecentSales(mockRecentSales);
      setExpiringPolicies(mockExpiringPolicies);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getExpiryColor = (days: number) => {
    if (days <= 1) return "bg-red-100 text-red-800";
    if (days <= 3) return "bg-orange-100 text-orange-800";
    if (days <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
          <p className="text-gray-600">Gérez votre activité d'assurance</p>
        </div>
        <div className="flex space-x-4">
          <Button 
            onClick={() => navigate({ to: "/admin/sales" })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Ventes
          </Button>
          <Button 
            onClick={() => navigate({ to: "/admin/policies" })}
            className="bg-green-600 hover:bg-green-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Polices
          </Button>
          <Button 
            onClick={() => navigate({ to: "/admin/whatsapp" })}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Polices Actives</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_policies}</div>
              <p className="text-xs text-muted-foreground">
                sur {stats.total_policies} totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_revenue.toLocaleString()} DH</div>
              <p className="text-xs text-muted-foreground">
                +{stats.monthly_revenue.toLocaleString()} DH ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Renouvellements en Attente</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_renewals}</div>
              <p className="text-xs text-muted-foreground">
                nécessitent une attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages WhatsApp Aujourd'hui</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messages_sent_today}</div>
              <p className="text-xs text-muted-foreground">
                {stats.success_rate}% de taux de succès
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="recent-sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent-sales">Ventes Récentes</TabsTrigger>
          <TabsTrigger value="expiring-policies">Polices Expirant Bientôt</TabsTrigger>
          <TabsTrigger value="quick-actions">Actions Rapides</TabsTrigger>
        </TabsList>

        <TabsContent value="recent-sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventes Récentes</CardTitle>
              <CardDescription>
                Les dernières ventes enregistrées dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{sale.client_name}</p>
                        <p className="text-sm text-gray-600">{sale.client_phone}</p>
                        <p className="text-sm text-gray-600">{sale.formula}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{sale.premium_paid.toLocaleString()} DH</p>
                      <Badge className={getStatusColor(sale.status)}>
                        {sale.status === "confirmed" ? "Confirmé" : 
                         sale.status === "pending" ? "En attente" : "Annulé"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring-policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Polices Expirant Bientôt</CardTitle>
              <CardDescription>
                Polices qui nécessitent un renouvellement imminent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiringPolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{policy.client_name}</p>
                        <p className="text-sm text-gray-600">{policy.client_phone}</p>
                        <p className="text-sm text-gray-600">{policy.formula}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Expire le {policy.end_date}</p>
                      <Badge className={getExpiryColor(policy.days_until_expiry)}>
                        {policy.days_until_expiry} jour{policy.days_until_expiry > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate({ to: "/admin/sales/new" })}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Nouvelle Vente
                </CardTitle>
                <CardDescription>
                  Enregistrer une nouvelle vente d'assurance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate({ to: "/admin/policies/new" })}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-600" />
                  Nouvelle Police
                </CardTitle>
                <CardDescription>
                  Créer une nouvelle police d'assurance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate({ to: "/admin/whatsapp/campaign" })}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                  Campagne WhatsApp
                </CardTitle>
                <CardDescription>
                  Lancer une campagne de messages WhatsApp
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate({ to: "/admin/reports" })}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                  Rapports
                </CardTitle>
                <CardDescription>
                  Voir les rapports et statistiques détaillées
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate({ to: "/admin/settings" })}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-600" />
                  Paramètres
                </CardTitle>
                <CardDescription>
                  Configurer les paramètres du système
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate({ to: "/admin/users" })}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-600" />
                  Utilisateurs
                </CardTitle>
                <CardDescription>
                  Gérer les utilisateurs et permissions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
