import mysqlClient from "../integrations/mysql/client";
import type { 
  InsurancePolicy, 
  WhatsAppMessage, 
  ExpiringPolicy, 
  AIAgentLog,
  WhatsAppTemplate,
  RenewalData
} from "../integrations/mysql/types";
import type { ResultSetHeader } from "mysql2";
import { v4 as uuidv4 } from "uuid";

export class WhatsAppAgentService {
  private templates: Map<string, WhatsAppTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    this.templates.set("new_policy", {
      type: "new_policy",
      template: "Cher/Chère {client_name}, votre assurance {vehicle_brand} {vehicle_model} est maintenant active! 🎉 Merci de faire confiance à Habib Groupe. Votre couverture commence le {start_date} et se termine le {end_date}. Pour toute question: {contact_phone}",
      variables: ["client_name", "vehicle_brand", "vehicle_model", "start_date", "end_date", "contact_phone"]
    });

    this.templates.set("reminder_3d", {
      type: "reminder_3d",
      template: "⚠️ Rappel Important: Votre assurance {vehicle_brand} {vehicle_model} expire dans 3 jours! Renouvelez dès maintenant pour éviter toute interruption. Lien: {renewal_link}",
      variables: ["vehicle_brand", "vehicle_model", "renewal_link"]
    });

    this.templates.set("reminder_2d", {
      type: "reminder_2d", 
      template: "🔔 Urgent: Plus que 2 jours avant l'expiration de votre assurance! Renouvelez maintenant: {renewal_link}",
      variables: ["renewal_link"]
    });

    this.templates.set("reminder_1d", {
      type: "reminder_1d",
      template: "🚨 DERNIER JOUR! Votre assurance expire demain! Renouvelez immédiatement: {renewal_link}",
      variables: ["renewal_link"]
    });

    this.templates.set("expired", {
      type: "expired",
      template: "❌ Votre assurance a expiré. Vous n'êtes plus couvert. Renouvelez maintenant pour réactiver votre protection: {renewal_link}",
      variables: ["renewal_link"]
    });

    this.templates.set("renewal_confirmation", {
      type: "renewal_confirmation",
      template: "✅ Confirmation: Votre assurance a été renouvelée avec succès! Nouvelle période: {new_start_date} au {new_end_date}. Merci pour votre fidélité! 🙏",
      variables: ["new_start_date", "new_end_date"]
    });
  }

  async checkExpiringPolicies(): Promise<void> {
    try {
      await this.logAgentAction("check_expiring_policies", "Vérification des polices arrivant à échéance");

      // Récupérer les polices qui expirent dans les 30 prochains jours
      const expiringPolicies = (await mysqlClient.query(
        `SELECT * FROM expiring_policies WHERE days_until_expiry <= 30 ORDER BY days_until_expiry ASC`
      )) as ExpiringPolicy[];

      for (const policy of expiringPolicies) {
        await this.processPolicyReminders(policy);
      }

      await this.logAgentAction("check_expiring_policies", "Terminé", { processed: expiringPolicies.length }, { success: true });
    } catch (error) {
      await this.logAgentAction("check_expiring_policies", "Erreur", {}, { success: false, error: (error as Error).message });
      throw error;
    }
  }

  private async processPolicyReminders(policy: ExpiringPolicy): Promise<void> {
    const daysUntilExpiry = policy.days_until_expiry;
    let messageType: WhatsAppMessage["message_type"] | null = null;

    // Déterminer le type de message à envoyer
    if (daysUntilExpiry === 3 && !policy.renewal_reminder_sent_3d) {
      messageType = "reminder_3d";
    } else if (daysUntilExpiry === 2 && !policy.renewal_reminder_sent_2d) {
      messageType = "reminder_2d";
    } else if (daysUntilExpiry === 1 && !policy.renewal_reminder_sent_1d) {
      messageType = "reminder_1d";
    } else if (daysUntilExpiry <= 0 && policy.status === "active") {
      messageType = "expired";
      // Marquer la police comme expirée
      await mysqlClient.update("insurance_policies", 
        { status: "expired" }, 
        { id: policy.id }
      );
    }

    if (messageType) {
      await this.sendWhatsAppMessage(policy.id, messageType);
      
      // Mettre à jour le statut du rappel
      const updateData: any = {};
      if (messageType === "reminder_3d") updateData.renewal_reminder_sent_3d = true;
      if (messageType === "reminder_2d") updateData.renewal_reminder_sent_2d = true;
      if (messageType === "reminder_1d") updateData.renewal_reminder_sent_1d = true;

      if (Object.keys(updateData).length > 0) {
        await mysqlClient.update("insurance_policies", updateData, { id: policy.id });
      }
    }
  }

  async sendWhatsAppMessage(policyId: string, messageType: WhatsAppMessage["message_type"]): Promise<WhatsAppMessage> {
    try {
      // Récupérer les détails de la police
      const policy = (await mysqlClient.getOne(
        "SELECT * FROM insurance_policies WHERE id = ?",
        [policyId]
      )) as InsurancePolicy;

      if (!policy) {
        throw new Error("Police non trouvée");
      }

      // Générer le message
      const template = this.templates.get(messageType);
      if (!template) {
        throw new Error(`Template non trouvé pour le type: ${messageType}`);
      }

      const messageContent = this.generateMessage(template, policy);

      // Créer l'enregistrement du message
      const messageData = {
        policy_id: policyId,
        client_phone: policy.client_phone,
        message_type: messageType,
        message_content: messageContent,
        delivery_status: "pending"
      };

      const result = (await mysqlClient.insert("whatsapp_messages", messageData)) as ResultSetHeader;
      
      const message = (await mysqlClient.getOne(
        "SELECT * FROM whatsapp_messages WHERE id = ?",
        [result.insertId]
      )) as WhatsAppMessage;

      // Envoyer le message via l'API WhatsApp (simulation)
      await this.sendViaWhatsAppAPI(message);

      // Mettre à jour le statut du message
      await mysqlClient.update("whatsapp_messages", 
        { delivery_status: "sent" }, 
        { id: message.id }
      );

      await this.logAgentAction("send_whatsapp_message", `Message ${messageType} envoyé`, 
        { policyId, messageType, phone: policy.client_phone }, 
        { success: true, messageId: message.id }
      );

      return message;
    } catch (error) {
      await this.logAgentAction("send_whatsapp_message", "Erreur d'envoi", 
        { policyId, messageType }, 
        { success: false, error: (error as Error).message }
      );
      throw error;
    }
  }

  private generateMessage(template: WhatsAppTemplate, policy: InsurancePolicy): string {
    let message = template.template;
    
    const variables: Record<string, string> = {
      client_name: policy.client_name,
      vehicle_brand: policy.vehicle_brand || "véhicule",
      vehicle_model: policy.vehicle_model || "",
      start_date: policy.start_date,
      end_date: policy.end_date,
      renewal_link: this.generateRenewalLink(policy.renewal_link_token || ""),
      contact_phone: "+212 6XX XXX XXX", // À configurer
      new_start_date: "", // Pour les renouvellements
      new_end_date: ""    // Pour les renouvellements
    };

    template.variables.forEach(variable => {
      message = message.replace(new RegExp(`{${variable}}`, "g"), variables[variable] || "");
    });

    return message;
  }

  private generateRenewalLink(token: string): string {
    return `https://habibgroupe.com/renewal/${token}`;
  }

  private async sendViaWhatsAppAPI(message: WhatsAppMessage): Promise<void> {
    // Simulation d'envoi via API WhatsApp
    // En production, intégrer avec Twilio WhatsApp ou WhatsApp Business API
    
    console.log(`[WhatsApp] Envoi du message à ${message.client_phone}:`);
    console.log(message.message_content);
    
    // Simulation d'un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async processRenewal(token: string, renewalData: RenewalData): Promise<InsurancePolicy> {
    try {
      await this.logAgentAction("process_renewal", "Traitement du renouvellement", 
        { token, duration: renewalData.duration_months });

      // Récupérer la police via le token
      const policy = (await mysqlClient.getOne(
        "SELECT * FROM insurance_policies WHERE renewal_link_token = ? AND status = 'active'",
        [token]
      )) as InsurancePolicy;

      if (!policy) {
        throw new Error("Token de renouvellement invalide ou police non active");
      }

      // Créer la nouvelle police
      const newStartDate = new Date().toISOString().split("T")[0];
      const newEndDate = this.calculateEndDate(newStartDate, renewalData.duration_months);
      const newPremiumAmount = renewalData.new_premium_amount || policy.premium_amount;

      const newPolicyData = {
        sale_id: policy.sale_id,
        client_name: policy.client_name,
        client_phone: policy.client_phone,
        client_email: policy.client_email,
        vehicle_brand: policy.vehicle_brand,
        vehicle_model: policy.vehicle_model,
        formula: policy.formula,
        start_date: newStartDate,
        end_date: newEndDate,
        duration_months: renewalData.duration_months,
        premium_amount: newPremiumAmount,
        renewal_link_token: uuidv4()
      };

      const result = (await mysqlClient.insert("insurance_policies", newPolicyData)) as ResultSetHeader;
      
      const newPolicy = (await mysqlClient.getOne(
        "SELECT * FROM insurance_policies WHERE id = ?",
        [result.insertId]
      )) as InsurancePolicy;

      // Marquer l'ancienne police comme expirée
      await mysqlClient.update("insurance_policies", 
        { status: "expired" }, 
        { id: policy.id }
      );

      // Envoyer la confirmation de renouvellement
      await this.sendRenewalConfirmation(newPolicy);

      await this.logAgentAction("process_renewal", "Renouvellement terminé", 
        { oldPolicyId: policy.id, newPolicyId: newPolicy.id }, 
        { success: true }
      );

      return newPolicy;
    } catch (error) {
      await this.logAgentAction("process_renewal", "Erreur de renouvellement", 
        { token }, 
        { success: false, error: (error as Error).message }
      );
      throw error;
    }
  }

  private async sendRenewalConfirmation(policy: InsurancePolicy): Promise<void> {
    try {
      const template = this.templates.get("renewal_confirmation");
      if (!template) return;

      const messageContent = this.generateMessage(template, policy);
      
      const messageData = {
        policy_id: policy.id,
        client_phone: policy.client_phone,
        message_type: "renewal_confirmation" as const,
        message_content: messageContent,
        delivery_status: "pending"
      };

      const result = (await mysqlClient.insert("whatsapp_messages", messageData)) as ResultSetHeader;
      
      const message = (await mysqlClient.getOne(
        "SELECT * FROM whatsapp_messages WHERE id = ?",
        [result.insertId]
      )) as WhatsAppMessage;

      await this.sendViaWhatsAppAPI(message);
      
      await mysqlClient.update("whatsapp_messages", 
        { delivery_status: "sent" }, 
        { id: message.id }
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi de la confirmation de renouvellement:", error);
    }
  }

  private calculateEndDate(startDate: string, durationMonths: number): string {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + durationMonths);
    return end.toISOString().split("T")[0];
  }

  private async logAgentAction(
    action: string, 
    description: string, 
    parameters?: any, 
    result?: any
  ): Promise<void> {
    await mysqlClient.insert("ai_agent_logs", {
      action,
      description,
      parameters: parameters ? JSON.stringify(parameters) : null,
      result: result ? JSON.stringify(result) : null,
      status: result?.success ? "success" : "error"
    });
  }

  async getAgentLogs(limit = 50): Promise<AIAgentLog[]> {
    const logs = (await mysqlClient.query(
      "SELECT * FROM ai_agent_logs ORDER BY created_at DESC LIMIT ?",
      [limit]
    )) as AIAgentLog[];

    return logs;
  }

  async getMessageStats(): Promise<any> {
    const stats = (await mysqlClient.query(`
      SELECT 
        message_type,
        COUNT(*) as count,
        SUM(CASE WHEN delivery_status = 'sent' THEN 1 ELSE 0 END) as sent_count,
        SUM(CASE WHEN delivery_status = 'failed' THEN 1 ELSE 0 END) as failed_count,
        DATE(sent_at) as date
      FROM whatsapp_messages 
      WHERE sent_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY message_type, DATE(sent_at)
      ORDER BY date DESC, message_type
    `)) as any[];

    return stats;
  }
}

export const whatsappAgent = new WhatsAppAgentService();
