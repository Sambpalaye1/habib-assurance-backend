# Habib Groupe Assurance

Système complet d'assurance automobile avec agent IA de marketing WhatsApp intégré.

## 🚀 Fonctionnalités

### 🎯 Core Features
- **Gestion des ventes d'assurance** avec calculateur de tarifs en temps réel
- **Suivi des polices d'assurance** avec dates d'échéance automatiques
- **Agent IA WhatsApp** pour le marketing automatisé et les rappels de renouvellement
- **Interface admin complète** avec tableau de bord et statistiques
- **Système de renouvellement en ligne** avec liens sécurisés

### 🤖 Agent IA WhatsApp
- **Rappels automatiques** : 3 jours, 2 jours et 1 jour avant expiration
- **Messages de bienvenue** lors de la souscription d'une nouvelle assurance
- **Notifications d'expiration** lorsque l'assurance est terminée
- **Confirmations de renouvellement** après succès du paiement
- **Liens de renouvellement personnalisés** pour chaque client

### 📊 Tableau de Bord Admin
- **Statistiques en temps réel** : polices actives, revenus, messages envoyés
- **Ventes récentes** avec statut et détails des clients
- **Polices expirant bientôt** avec alertes prioritaires
- **Actions rapides** pour créer des ventes et lancer des campagnes
- **Rapports détaillés** et export de données

## 🛠️ Architecture Technique

### Base de Données
- **MySQL** avec schéma optimisé pour les assurances
- **Tables principales** : users, sales, insurance_policies, whatsapp_messages, ai_agent_logs
- **Vues et procédures stockées** pour les statistiques complexes

### Backend
- **Node.js + Express** avec TypeScript
- **JWT** pour l'authentification sécurisée
- **MySQL2** pour la connexion à la base de données
- **Twilio** pour l'intégration WhatsApp (pré-configuré)

### Frontend
- **React + TanStack Router** pour la navigation
- **TailwindCSS + shadcn/ui** pour l'interface moderne
- **React Hook Form + Zod** pour la validation des formulaires

## 📋 Prérequis

- Node.js 18+
- MySQL 8.0+
- Compte Twilio (pour WhatsApp)
- Hébergement avec support Node.js

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd habib-groupe-main
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer la base de données MySQL
```bash
# Créer la base de données
mysql -u root -p -e "CREATE DATABASE habib_assurance;"

# Importer le schéma
mysql -u root -p habib_assurance < database/mysql_schema.sql
```

### 4. Configurer les variables d'environnement
```bash
cp .env.example .env
```

Éditer `.env` avec vos configurations :
```env
# Configuration MySQL
MYSQL_HOST="localhost"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD="votre_mot_de_passe"
MYSQL_DATABASE="habib_assurance"

# Configuration JWT
JWT_SECRET="votre_secret_key_super_securise"
JWT_EXPIRES_IN="7d"

# Configuration WhatsApp (Twilio)
TWILIO_ACCOUNT_SID="votre_sid"
TWILIO_AUTH_TOKEN="votre_token"
TWILIO_PHONE_NUMBER="+1234567890"
TWILIO_WHATSAPP_NUMBER="+14155238886"

# Configuration site
SITE_URL="https://habibgroupe.com"
SITE_NAME="Habib Groupe Assurance"
```

### 5. Démarrer l'application
```bash
# Développement
npm run dev

# Serveur backend uniquement
npm run server:dev

# Production
npm run build
npm run start
```

## 🌐 Déploiement sur habibgroupe.com

### Configuration du domaine
1. **DNS** : Pointer `habibgroupe.com` vers votre serveur
2. **SSL** : Configurer un certificat SSL (Let's Encrypt recommandé)
3. **Reverse Proxy** : Nginx ou Apache pour rediriger vers Node.js

### Exemple Nginx
```nginx
server {
    listen 80;
    server_name habibgroupe.com www.habibgroupe.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name habibgroupe.com www.habibgroupe.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Process Manager (PM2)
```bash
# Installer PM2
npm install -g pm2

# Démarrer avec PM2
pm2 start server/index.ts --name habib-assurance --interpreter tsx

# Sauvegarder la configuration
pm2 save
pm2 startup
```

## 📱 Configuration WhatsApp

### 1. Créer un compte Twilio
- Inscrivez-vous sur [twilio.com](https://twilio.com)
- Obtenez un Account SID et Auth Token
- Configurez un numéro WhatsApp Business

### 2. Mettre à jour .env
```env
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+15017122661"
TWILIO_WHATSAPP_NUMBER="+14155238886"
```

### 3. Configurer les templates WhatsApp
Les templates sont pré-configurés dans `src/services/whatsapp-agent.ts` :
- `new_policy` : Message de bienvenue
- `reminder_3d` : Rappel 3 jours avant expiration
- `reminder_2d` : Rappel 2 jours avant expiration  
- `reminder_1d` : Rappel 1 jour avant expiration
- `expired` : Notification d'expiration
- `renewal_confirmation` : Confirmation de renouvellement

## 👥 Utilisateurs par défaut

### Admin
- **Email** : admin@habibgroupe.com
- **Mot de passe** : admin123
- **Rôle** : Administrateur complet

> ⚠️ **Important** : Changez le mot de passe admin après la première connexion !

## 🔄 Tâches Automatisées

L'agent IA exécute automatiquement :
- **Toutes les heures** : Vérification des polices expirantes
- **En développement** : Toutes les 5 minutes pour les tests

Les logs sont enregistrés dans la table `ai_agent_logs`.

## 📊 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Profil utilisateur

### Ventes
- `GET /api/sales` - Liste des ventes
- `POST /api/sales` - Créer une vente
- `PUT /api/sales/:id` - Mettre à jour une vente
- `POST /api/sales/:id/confirm` - Confirmer une vente

### Polices
- `GET /api/policies` - Liste des polices
- `GET /api/policies/expiring` - Polices expirantes

### WhatsApp
- `GET /api/whatsapp/messages` - Messages envoyés
- `POST /api/whatsapp/check-expiring` - Lancer vérification
- `POST /api/whatsapp/send/:policyId/:messageType` - Envoyer message

### Renouvellement (public)
- `GET /api/renewal/:token` - Détails de renouvellement
- `POST /api/renewal/:token` - Traiter renouvellement

### Statistiques
- `GET /api/stats/dashboard` - Stats tableau de bord
- `GET /api/stats/sales` - Stats ventes
- `GET /api/agent/logs` - Logs agent IA

## 🛡️ Sécurité

- **JWT tokens** avec expiration configurable
- **Rôles utilisateurs** : admin, dev
- **Validation des entrées** avec Zod
- **Protection CORS** configurée
- **Connexion sécurisée** MySQL avec SSL recommandé

## 📈 Monitoring

### Logs
- Logs de l'agent IA dans `ai_agent_logs`
- Logs des messages WhatsApp dans `whatsapp_messages`
- Logs d'erreur du serveur Node.js

### Santé du système
- `GET /api/health` - Vérifier l'état du serveur
- Monitoring des performances avec PM2

## 🤝 Support

Pour toute question ou problème :
1. Consulter les logs dans la base de données
2. Vérifier la configuration `.env`
3. Tester l'API avec Postman ou curl
4. Contacter le support technique

## 📝 License

© 2024 Habib Groupe Assurance. Tous droits réservés.
