// Types MySQL pour Habib Groupe Assurance

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  is_active: boolean;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'dev';
  created_at: string;
}

export interface Sale {
  id: string;
  client_name: string;
  client_phone?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_cv?: number;
  formula: string;
  duration_months: number;
  premium_paid: number;
  broker_profit: number;
  dev_share?: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface InsurancePolicy {
  id: string;
  sale_id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  formula: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  premium_amount: number;
  status: 'active' | 'expired' | 'cancelled';
  renewal_reminder_sent_3d: boolean;
  renewal_reminder_sent_2d: boolean;
  renewal_reminder_sent_1d: boolean;
  renewal_link_token?: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessage {
  id: string;
  policy_id: string;
  client_phone: string;
  message_type: 'new_policy' | 'reminder_3d' | 'reminder_2d' | 'reminder_1d' | 'expired' | 'renewal_confirmation';
  message_content: string;
  sent_at: string;
  delivery_status: 'pending' | 'sent' | 'delivered' | 'failed';
  error_message?: string;
}

export interface AIAgentLog {
  id: string;
  action: string;
  description?: string;
  parameters?: any;
  result?: any;
  status: 'success' | 'error' | 'pending';
  created_at: string;
}

export interface SalesStats {
  total_sales: number;
  total_premium: number;
  total_profit: number;
  total_dev_share: number;
  confirmed_sales: number;
  pending_sales: number;
  cancelled_sales: number;
  sale_date: string;
}

export interface ExpiringPolicy {
  id: string;
  sale_id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  formula: string;
  start_date: string;
  end_date: string;
  status: string;
  days_until_expiry: number;
}

// Types pour les formulaires
export interface CreateSaleData {
  client_name: string;
  client_phone?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_cv?: number;
  formula: string;
  duration_months: number;
  premium_paid: number;
  broker_profit: number;
  notes?: string;
}

export interface UpdateSaleData extends Partial<CreateSaleData> {
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export interface CreatePolicyData {
  sale_id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  formula: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  premium_amount: number;
}

export interface RenewalData {
  policy_id: string;
  duration_months: number;
  new_premium_amount?: number;
}

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'dev';
  last_sign_in_at?: string;
}

// Types pour les messages WhatsApp
export interface WhatsAppTemplate {
  type: 'new_policy' | 'reminder_3d' | 'reminder_2d' | 'reminder_1d' | 'expired' | 'renewal_confirmation';
  template: string;
  variables: string[];
}

export interface WhatsAppConfig {
  api_key: string;
  phone_number_id: string;
  business_account_id: string;
  webhook_verify_token?: string;
}

// Types pour l'agent IA
export interface AgentAction {
  type: 'send_reminder' | 'process_renewal' | 'generate_report' | 'update_policy';
  parameters: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  scheduled_at?: string;
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// Types pour les exports
export interface ExportData {
  format: 'csv' | 'excel' | 'pdf';
  date_range: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

export interface DashboardStats {
  total_policies: number;
  active_policies: number;
  expired_policies: number;
  pending_renewals: number;
  total_revenue: number;
  monthly_revenue: number;
  messages_sent_today: number;
  success_rate: number;
}
