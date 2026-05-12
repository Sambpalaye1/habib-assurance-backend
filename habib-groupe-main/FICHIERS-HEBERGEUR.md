# 📋 Fichiers à Donner à l'Hébergeur - Habib Groupe Assurance

## 🎯 FICHIERS ESSENTIELS (OBLIGATOIRES)

### 📄 Site Web Principal
- ✅ **`site-simple.html`** - Page principale (RECOMMANDÉ pour hébergement)
- ✅ **`index.html`** - Version avancée (si hébergeur supporte)
- ✅ **`index-offline.html`** - Version autonome

### ⚙️ Configuration Base de Données
- ✅ **`database/mysql_schema.sql`** - Schéma MySQL complet

### 📋 Documentation
- ✅ **`README.md`** - Documentation technique
- ✅ **`PARTAGE-SITE.md`** - Instructions pour partager

---

## 🗄️ CONFIGURATION BASE DE DONNÉES MYSQL

### Étape 1: Créer la Base de Données
```sql
CREATE DATABASE habib_assurance;
USE habib_assurance;
```

### Étape 2: Importer le Schéma
Exécutez le fichier `database/mysql_schema.sql` dans phpMyAdmin ou via ligne de commande :
```bash
mysql -u utilisateur -p habib_assurance < database/mysql_schema.sql
```

### Étape 3: Créer Utilisateur Admin
```sql
INSERT INTO users (id, email, password_hash) VALUES 
(UUID(), 'admin@habibgroupe.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvGm');

INSERT INTO user_roles (user_id, role) 
SELECT id, 'admin' FROM users WHERE email = 'admin@habibgroupe.com' LIMIT 1;
```

### Étape 4: Configurer l'Application
Modifiez le fichier `.env` avec vos identifiants MySQL :
```env
DB_HOST=localhost
DB_USER=votre_utilisateur_mysql
DB_PASSWORD=votre_mot_de_passe
DB_NAME=habib_assurance
```

---

## 🌐 INSTRUCTIONS HÉBERGEUR

### Option 1: Hébergement Simple (Recommandé)
1. **Uploadez `site-simple.html`** comme page d'accueil
2. **Configurez la base de données MySQL**
3. **Le site fonctionne immédiatement**

### Option 2: Hébergement Complet
1. **Uploadez tout le projet React**
2. **Configurez le serveur Node.js**
3. **Connectez la base de données MySQL**

---

## 📞 INFORMATIONS POUR L'HÉBERGEUR

### 🔧 Configuration Requise
- **PHP 7.4+** (si utilisation PHP)
- **MySQL 5.7+** ou **MariaDB 10.2+**
- **Node.js 16+** (si application complète)
- **HTTPS** (obligatoire pour WhatsApp)

### 📱 Numéro WhatsApp à Configurer
- **+221 77 759 27 23**
- **Email**: contact@habibgroupe.com
- **Domaine**: habibgroupe.com

### 🎨 Design et SEO
- **Titre**: "Assurance Automobile Sénégal | Habib Groupe"
- **Description**: "Assurance automobile pas cher au Sénégal..."
- **Mots-clés**: "assurance automobile sénégal, assurance auto sénégal..."

---

## 🚀 DÉPLOIEMENT RAPIDE

### Étapes Immédiates
1. ✅ **Uploadez `site-simple.html`**
2. ✅ **Configurez la base de données MySQL**
3. ✅ **Testez le site**
4. ✅ **Configurez le domaine**

### Vérifications Finales
- ✅ Site accessible via HTTPS
- ✅ Formulaire de contact fonctionnel
- ✅ Numéro WhatsApp cliquable
- ✅ Base de données connectée

---

## 📊 TABLES MYSQL CRÉÉES

Le schéma crée automatiquement :
- `users` - Utilisateurs et authentification
- `user_roles` - Rôles (admin, dev)
- `sales` - Ventes et polices d'assurance
- `insurance_policies` - Polices d'assurance
- `whatsapp_messages` - Messages WhatsApp
- `ai_agent_logs` - Logs de l'agent IA

---

## 🎉 RÉSUMÉ

### 📦 Package Complet à Donner
```
📁 HEBERGEMENT/
├── 📄 site-simple.html (page principale)
├── 📄 database/mysql_schema.sql (base de données)
├── 📋 README.md (documentation)
└── 📋 INSTRUCTIONS-HEBERGEUR.md (ce fichier)
```

### ⏡ Temps de Déploiement
- **Site simple**: 15 minutes
- **Base de données**: 10 minutes
- **Total**: 25 minutes

**Le site sera fonctionnel immédiatement après l'upload !** 🎋🚗🇸🇳
