export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  category: 'marketing' | 'utility' | 'authentication';
}

export const whatsappTemplates: WhatsAppTemplate[] = [
  {
    id: 'welcome_new_client',
    name: 'Bienvenue Nouveau Client',
    category: 'marketing',
    content: `🎋 *Bienvenue chez Habib Groupe Assurance !*

Cher(e) {{client_name}},

Nous sommes ravis de vous accueillir dans notre famille d'assurés ! Votre police d'assurance est maintenant active.

📋 *Détails de votre assurance :*
🚗 Véhicule : {{vehicle_brand}} {{vehicle_model}}
📋 Formule : {{formula}}
💰 Prime : {{premium_amount}} DH
📅 Début : {{start_date}}
📅 Fin : {{end_date}}

🔗 *Lien de gestion :*
{{renewal_link}}

Pour toute question, contactez-nous au +212 5XX XXX XXX

*Cordialement,*
*Habib Groupe Assurance*`,
    variables: ['client_name', 'vehicle_brand', 'vehicle_model', 'formula', 'premium_amount', 'start_date', 'end_date', 'renewal_link']
  },
  {
    id: 'reminder_3_days',
    name: 'Rappel 3 Jours',
    category: 'utility',
    content: `⏰ *Rappel Important - 3 Jours Avant Expiration*

Cher(e) {{client_name}},

Votre assurance automobile expire dans **3 jours** !

📋 *Détils de votre police :*
🚗 Véhicule : {{vehicle_brand}} {{vehicle_model}}
📋 Formule : {{formula}}
📅 Date d'expiration : {{end_date}}

🔗 *Renouvelez maintenant :*
{{renewal_link}}

Évitez toute interruption de couverture !

*Habib Groupe Assurance*`,
    variables: ['client_name', 'vehicle_brand', 'vehicle_model', 'formula', 'end_date', 'renewal_link']
  },
  {
    id: 'reminder_2_days',
    name: 'Rappel 2 Jours',
    category: 'utility',
    content: `⚠️ *URGENT - 2 Jours Avant Expiration*

Cher(e) {{client_name}},

Votre assurance expire dans **2 jours seulement** !

🚗 Véhicule : {{vehicle_brand}} {{vehicle_model}}
📅 Expiration : {{end_date}}

🔗 *Renouvellement immédiat :*
{{renewal_link}}

Ne risquez pas de conduire sans assurance !

*Habib Groupe Assurance*`,
    variables: ['client_name', 'vehicle_brand', 'vehicle_model', 'end_date', 'renewal_link']
  },
  {
    id: 'reminder_1_day',
    name: 'Rappel 1 Jour',
    category: 'utility',
    content: `🚨 *DERNIER RAPPEL - Expire Demain !*

Cher(e) {{client_name}},

Votre assurance automobile expire **DEMAIN** !

🚗 Véhicule : {{vehicle_brand}} {{vehicle_model}}
📅 Expiration : {{end_date}}

🔗 *Renouvellez maintenant :*
{{renewal_link}}

📞 Appelez-nous d'urgence : +212 5XX XXX XXX

*Habib Groupe Assurance*`,
    variables: ['client_name', 'vehicle_brand', 'vehicle_model', 'end_date', 'renewal_link']
  },
  {
    id: 'policy_expired',
    name: 'Police Expirée',
    category: 'utility',
    content: `❌ *Votre Assurance est Expirée*

Cher(e) {{client_name}},

Votre police d'assurance automobile a expiré le {{end_date}}.

🚗 Véhicule concerné : {{vehicle_brand}} {{vehicle_model}}

⚠️ Vous conduisez actuellement sans assurance !

🔗 *Renouvellez immédiatement :*
{{renewal_link}}

📞 Contact d'urgence : +212 5XX XXX XXX

*Habib Groupe Assurance*`,
    variables: ['client_name', 'vehicle_brand', 'vehicle_model', 'end_date', 'renewal_link']
  },
  {
    id: 'renewal_confirmation',
    name: 'Confirmation Renouvellement',
    category: 'utility',
    content: `✅ *Renouvellement Confirmé !*

Cher(e) {{client_name}},

Félicitations ! Votre assurance a été renouvelée avec succès.

📋 *Nouveaux détails :*
🚗 Véhicule : {{vehicle_brand}} {{vehicle_model}}
📋 Formule : {{formula}}
💰 Prime : {{premium_amount}} DH
📅 Nouvelle période : {{start_date}} au {{end_date}}

📄 Votre attestation sera envoyée par email dans les prochaines heures.

Merci de votre confiance !

*Habib Groupe Assurance*`,
    variables: ['client_name', 'vehicle_brand', 'vehicle_model', 'formula', 'premium_amount', 'start_date', 'end_date']
  },
  {
    id: 'payment_reminder',
    name: 'Rappel Paiement',
    category: 'utility',
    content: `💳 *Rappel de Paiement*

Cher(e) {{client_name}},

Un paiement est en attente pour votre assurance.

📋 *Détails :*
🚗 Véhicule : {{vehicle_brand}} {{vehicle_model}}
💰 Montant : {{amount}} DH
📅 Échéance : {{due_date}}

🔗 *Payer maintenant :*
{{payment_link}}

Pour toute question : +212 5XX XXX XXX

*Habib Groupe Assurance*`,
    variables: ['client_name', 'vehicle_brand', 'vehicle_model', 'amount', 'due_date', 'payment_link']
  },
  {
    id: 'special_offer',
    name: 'Offre Spéciale',
    category: 'marketing',
    content: `🎉 *Offre Spéciale Exclusivité !*

Cher(e) {{client_name}},

Profitez de notre offre limitée sur votre prochain renouvellement !

🎁 *Offre spéciale :*
-10% sur votre prime si vous renouvelez avant {{offer_expiry}}

🚗 Votre véhicule : {{vehicle_brand}} {{vehicle_model}}
💰 Prime habituelle : {{regular_premium}} DH
💰 Prime avec offre : {{discounted_premium}} DH

🔗 *Profitez de l'offre :*
{{renewal_link}}

Offre valable jusqu'au {{offer_expiry}} !

*Habib Groupe Assurance*`,
    variables: ['client_name', 'vehicle_brand', 'vehicle_model', 'regular_premium', 'discounted_premium', 'offer_expiry', 'renewal_link']
  },
  {
    id: 'document_request',
    name: 'Demande de Documents',
    category: 'utility',
    content: `📄 *Documents Requis*

Cher(e) {{client_name}},

Pour finaliser votre dossier, nous avons besoin des documents suivants :

📋 *Documents requis :*
🆔 Carte d'identité (recto/verso)
🚗 Carte grise du véhicule
📸 Photos du véhicule (4 angles)
📋 Permis de conduire

📤 *Envoyez les documents :*
📧 Email : documents@habibgroupe.com
📱 WhatsApp : +212 6XX XXX XXX

🔗 *Suivi du dossier :*
{{tracking_link}}

*Habib Groupe Assurance*`,
    variables: ['client_name', 'tracking_link']
  },
  {
    id: 'survey_feedback',
    name: 'Satisfaction Client',
    category: 'marketing',
    content: `⭐ *Votre Opinion Compte !*

Cher(e) {{client_name}},

Merci de faire confiance à Habib Groupe Assurance !

Aidez-nous à améliorer nos services en partageant votre expérience :

⭐ *Évaluez notre service :*
1️⃣ Très satisfait(e)
2️⃣ Satisfait(e)  
3️⃣ Neutre
4️⃣ Peu satisfait(e)
5️⃣ Pas du tout satisfait(e)

💬 *Laissez un commentaire :*
{{survey_link}}

Votre feedback nous aide à vous mieux servir !

*Habib Groupe Assurance*`,
    variables: ['client_name', 'survey_link']
  }
];

export function getTemplateById(id: string): WhatsAppTemplate | undefined {
  return whatsappTemplates.find(template => template.id === id);
}

export function getTemplatesByCategory(category: 'marketing' | 'utility' | 'authentication'): WhatsAppTemplate[] {
  return whatsappTemplates.filter(template => template.category === category);
}

export function renderTemplate(template: WhatsAppTemplate, variables: Record<string, string>): string {
  let content = template.content;
  
  template.variables.forEach(variable => {
    const value = variables[variable] || `{{${variable}}}`;
    content = content.replace(new RegExp(`{{${variable}}}`, 'g'), value);
  });
  
  return content;
}
