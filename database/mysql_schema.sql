-- Base de données MySQL pour Habib Groupe Assurance
-- Migration depuis Supabase vers MySQL

CREATE DATABASE IF NOT EXISTS habib_assurance;
USE habib_assurance;

-- Table des utilisateurs (remplace auth.users de Supabase)
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_sign_in_at TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Table des rôles utilisateurs
CREATE TABLE user_roles (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  role ENUM('admin', 'dev') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_role (user_id, role)
);

-- Table des ventes / commissions
CREATE TABLE sales (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  vehicle_brand VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_cv INT,
  formula VARCHAR(100) NOT NULL,
  duration_months INT NOT NULL DEFAULT 12,
  premium_paid DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  broker_profit DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  dev_share DECIMAL(12,2) GENERATED ALWAYS AS (ROUND(broker_profit * 0.30, 2)) STORED,
  status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Table des assurances actives pour le suivi des échéances
CREATE TABLE insurance_policies (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  sale_id VARCHAR(36) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  client_email VARCHAR(255),
  vehicle_brand VARCHAR(100),
  vehicle_model VARCHAR(100),
  formula VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_months INT NOT NULL,
  premium_amount DECIMAL(12,2) NOT NULL,
  status ENUM('active', 'expired', 'cancelled') NOT NULL DEFAULT 'active',
  renewal_reminder_sent_3d BOOLEAN DEFAULT FALSE,
  renewal_reminder_sent_2d BOOLEAN DEFAULT FALSE,
  renewal_reminder_sent_1d BOOLEAN DEFAULT FALSE,
  renewal_link_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

-- Table des messages WhatsApp envoyés
CREATE TABLE whatsapp_messages (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  policy_id VARCHAR(36) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  message_type ENUM('new_policy', 'reminder_3d', 'reminder_2d', 'reminder_1d', 'expired', 'renewal_confirmation') NOT NULL,
  message_content TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivery_status ENUM('pending', 'sent', 'delivered', 'failed') DEFAULT 'pending',
  error_message TEXT,
  FOREIGN KEY (policy_id) REFERENCES insurance_policies(id) ON DELETE CASCADE
);

-- Table des logs de l'agent IA
CREATE TABLE ai_agent_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  action VARCHAR(100) NOT NULL,
  description TEXT,
  parameters JSON,
  result JSON,
  status ENUM('success', 'error', 'pending') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_created_at ON sales(created_at DESC);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_insurance_policies_status ON insurance_policies(status);
CREATE INDEX idx_insurance_policies_end_date ON insurance_policies(end_date);
CREATE INDEX idx_insurance_policies_client_phone ON insurance_policies(client_phone);
CREATE INDEX idx_whatsapp_messages_policy_id ON whatsapp_messages(policy_id);
CREATE INDEX idx_whatsapp_messages_sent_at ON whatsapp_messages(sent_at);

-- Trigger pour promouvoir le premier utilisateur en admin
DELIMITER //
CREATE TRIGGER promote_first_user_to_admin
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  DECLARE admin_count INT;
  SELECT COUNT(*) INTO admin_count FROM user_roles WHERE role = 'admin';
  IF admin_count = 0 THEN
    INSERT INTO user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
END//
DELIMITER ;

-- Procédure pour créer une police d'assurance depuis une vente confirmée
DELIMITER //
CREATE PROCEDURE create_insurance_policy_from_sale(
  IN p_sale_id VARCHAR(36),
  IN p_start_date DATE
)
BEGIN
  DECLARE v_client_name VARCHAR(255);
  DECLARE v_client_phone VARCHAR(20);
  DECLARE v_vehicle_brand VARCHAR(100);
  DECLARE v_vehicle_model VARCHAR(100);
  DECLARE v_formula VARCHAR(100);
  DECLARE v_duration_months INT;
  DECLARE v_premium_paid DECIMAL(12,2);
  DECLARE v_end_date DATE;
  DECLARE v_renewal_token VARCHAR(255);
  
  -- Récupérer les informations de la vente
  SELECT client_name, client_phone, vehicle_brand, vehicle_model, formula, duration_months, premium_paid
  INTO v_client_name, v_client_phone, v_vehicle_brand, v_vehicle_model, v_formula, v_duration_months, v_premium_paid
  FROM sales WHERE id = p_sale_id AND status = 'confirmed';
  
  IF v_client_name IS NOT NULL THEN
    -- Calculer la date de fin
    SET v_end_date = DATE_ADD(p_start_date, INTERVAL v_duration_months MONTH);
    SET v_renewal_token = CONCAT('renewal_', UUID());
    
    -- Insérer la police d'assurance
    INSERT INTO insurance_policies (
      sale_id, client_name, client_phone, vehicle_brand, vehicle_model, formula,
      start_date, end_date, duration_months, premium_amount, renewal_link_token
    ) VALUES (
      p_sale_id, v_client_name, v_client_phone, v_vehicle_brand, v_vehicle_model, v_formula,
      p_start_date, v_end_date, v_duration_months, v_premium_paid, v_renewal_token
    );
  END IF;
END//
DELIMITER ;

-- Vue pour les statistiques de ventes
CREATE VIEW sales_stats AS
SELECT 
  COUNT(*) as total_sales,
  SUM(premium_paid) as total_premium,
  SUM(broker_profit) as total_profit,
  SUM(dev_share) as total_dev_share,
  COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_sales,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_sales,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_sales,
  DATE(created_at) as sale_date
FROM sales
GROUP BY DATE(created_at);

-- Vue pour les polices arrivant à échéance
CREATE VIEW expiring_policies AS
SELECT 
  ip.*,
  DATEDIFF(ip.end_date, CURDATE()) as days_until_expiry
FROM insurance_policies ip
WHERE ip.status = 'active'
  AND ip.end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY ip.end_date ASC;

