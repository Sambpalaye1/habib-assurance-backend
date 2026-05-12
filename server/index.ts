import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import mysqlClient from "../src/integrations/mysql/client";
import { authService } from "../src/integrations/mysql/auth";
import { salesService } from "../src/integrations/mysql/sales";
import { whatsappAgent } from "../src/services/whatsapp-agent";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware d'authentification
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token requis" });
  }

  try {
    const user = authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token invalide" });
  }
};

// Middleware de vérification de rôle admin
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const hasAdminRole = await authService.hasRole(req.user.id, "admin");
    if (!hasAdminRole) {
      return res.status(403).json({ error: "Accès admin requis" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Erreur de vérification des droits" });
  }
};

// Routes d'authentification
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login({ email, password });
    const token = authService.generateToken(user);
    
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    const token = authService.generateToken(user);
    
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur utilisateur" });
  }
});

// Routes des ventes (admin uniquement)
app.get("/api/sales", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const sales = await salesService.getAllSales(Number(limit), Number(offset));
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des ventes" });
  }
});

app.post("/api/sales", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const saleData = { ...req.body, created_by: req.user.id };
    const sale = await salesService.createSale(saleData);
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la vente" });
  }
});

app.put("/api/sales/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await salesService.updateSale(id, req.body);
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de la vente" });
  }
});

app.post("/api/sales/:id/confirm", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date } = req.body;
    const policy = await salesService.confirmSale(id, start_date);
    
    // Envoyer un message WhatsApp de confirmation
    if (policy) {
      await whatsappAgent.sendWhatsAppMessage(policy.id, "new_policy");
    }
    
    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la confirmation de la vente" });
  }
});

// Routes des polices d'assurance
app.get("/api/policies", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const policies = await mysqlClient.query(
      "SELECT * FROM insurance_policies ORDER BY created_at DESC"
    );
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des polices" });
  }
});

app.get("/api/policies/expiring", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const policies = await mysqlClient.query(
      "SELECT * FROM expiring_policies ORDER BY days_until_expiry ASC"
    );
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des polices expirantes" });
  }
});

// Routes WhatsApp
app.get("/api/whatsapp/messages", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await mysqlClient.query(
      "SELECT * FROM whatsapp_messages ORDER BY sent_at DESC LIMIT 100"
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des messages" });
  }
});

app.post("/api/whatsapp/check-expiring", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await whatsappAgent.checkExpiringPolicies();
    res.json({ message: "Vérification terminée" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la vérification des polices" });
  }
});

app.post("/api/whatsapp/send/:policyId/:messageType", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { policyId, messageType } = req.params;
    const message = await whatsappAgent.sendWhatsAppMessage(policyId, messageType as any);
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
});

// Route de renouvellement (publique)
app.post("/api/renewal/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const renewalData = req.body;
    const policy = await whatsappAgent.processRenewal(token, renewalData);
    res.json(policy);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Route pour obtenir les détails de renouvellement (publique)
app.get("/api/renewal/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const policy = await mysqlClient.getOne(
      "SELECT * FROM insurance_policies WHERE renewal_link_token = ? AND status = 'active'",
      [token]
    );
    
    if (!policy) {
      return res.status(404).json({ error: "Token de renouvellement invalide" });
    }
    
    res.json(policy);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des détails" });
  }
});

// Routes de statistiques
app.get("/api/stats/dashboard", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await mysqlClient.getOne(`
      SELECT 
        COUNT(*) as total_policies,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_policies,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_policies,
        SUM(CASE WHEN end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as pending_renewals,
        SUM(premium_amount) as total_revenue,
        SUM(CASE WHEN created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') THEN premium_amount ELSE 0 END) as monthly_revenue
      FROM insurance_policies
    `);

    const todayMessages = await mysqlClient.getOne(`
      SELECT 
        COUNT(*) as messages_sent_today,
        SUM(CASE WHEN delivery_status = 'sent' THEN 1 ELSE 0 END) * 100 / COUNT(*) as success_rate
      FROM whatsapp_messages 
      WHERE DATE(sent_at) = CURDATE()
    `);

    const finalStats = {
      ...stats,
      ...todayMessages,
      success_rate: Math.round(todayMessages?.success_rate || 0)
    };

    res.json(finalStats);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
  }
});

app.get("/api/stats/sales", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { start, end } = req.query;
    const stats = await salesService.getSalesStats(
      start && end ? { start: start as string, end: end as string } : undefined
    );
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des statistiques de ventes" });
  }
});

// Routes des logs de l'agent IA
app.get("/api/agent/logs", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const logs = await whatsappAgent.getAgentLogs(Number(limit));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des logs" });
  }
});

// Route de santé
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/health`);
  
  // Démarrer la tâche automatisée de vérification des polices
  startAutomatedTasks();
});

// Tâches automatisées
function startAutomatedTasks() {
  // Vérifier les polices expirantes toutes les heures
  setInterval(async () => {
    try {
      console.log("🔍 Vérification automatique des polices expirantes...");
      await whatsappAgent.checkExpiringPolicies();
      console.log("✅ Vérification terminée");
    } catch (error) {
      console.error("❌ Erreur lors de la vérification automatique:", error);
    }
  }, 60 * 60 * 1000); // Toutes les heures

  // Vérifier toutes les 5 minutes en développement
  if (process.env.NODE_ENV === "development") {
    setInterval(async () => {
      try {
        console.log("🔍 Vérification développement des polices expirantes...");
        await whatsappAgent.checkExpiringPolicies();
        console.log("✅ Vérification développement terminée");
      } catch (error) {
        console.error("❌ Erreur lors de la vérification développement:", error);
      }
    }, 5 * 60 * 1000); // Toutes les 5 minutes
  }
}

export default app;
