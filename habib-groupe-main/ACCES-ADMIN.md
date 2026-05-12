# 🔐 ACCÈS ESPACE ADMIN - Habib Groupe Assurance

## 🎯 **ACCÈS À L'INTERFACE ADMIN**

### 📍 **URL de l'Espace Admin :**
```
https://habibgroupe.com/admin
```

### 🔑 **Identifiants par Défaut :**
- **Email** : `admin@habibgroupe.com`
- **Mot de passe** : `admin123`

---

## 🚀 **ÉTAPES POUR ACCÉDER À L'ADMIN**

### Étape 1: Héberger le Site Complet
Pour accéder à l'interface admin, vous devez héberger la **version complète** du site (pas la version simple).

### Étape 2: Créer l'Utilisateur Admin
```sql
-- Dans phpMyAdmin, exécutez cette requête :
INSERT INTO users (id, email, password_hash) VALUES 
(UUID(), 'admin@habibgroupe.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvGm');

INSERT INTO user_roles (user_id, role) 
SELECT id, 'admin' FROM users WHERE email = 'admin@habibgroupe.com' LIMIT 1;
```

### Étape 3: Accéder à l'Interface
1. **Allez sur** : `https://habibgroupe.com/admin`
2. **Entrez les identifiants** ci-dessus
3. **Cliquez sur "Se connecter"**

---

## 📊 **FONCTIONNALITÉS DE L'INTERFACE ADMIN**

### 🏠 **Dashboard Principal**
- **Statistiques en temps réel**
- **Ventes du mois**
- **Nouveaux clients**
- **Polices expirantes**
- **Revenus mensuels**

### 👥 **Gestion des Clients**
- **Liste des clients** avec recherche
- **Ajouter un nouveau client**
- **Modifier les informations**
- **Voir l'historique** des polices

### 📋 **Gestion des Ventes**
- **Créer une nouvelle police**
- **Liste des polices actives**
- **Suivi des paiements**
- **Gestion des renouvellements**

### 💬 **Agent IA WhatsApp**
- **Messages envoyés/reçus**
- **Templates de messages**
- **Statistiques d'engagement**
- **Configuration automatique**

### 📈 **Rapports et Analytics**
- **Rapports de ventes** mensuels
- **Performance des agents**
- **Analyse des tendances**
- **Export de données**

---

## 🔧 **CONFIGURATION DE L'ADMIN**

### Étape 1: Variables d'Environnement
Dans votre fichier `.env` :
```env
JWT_SECRET=votre_secret_jwt_tres_long_et_unique
ADMIN_EMAIL=admin@habibgroupe.com
NODE_ENV=production
```

### Étape 2: Sécurité
```bash
# Changez le mot de passe par défaut
npm run change-admin-password
```

### Étape 3: Permissions
- **Admin** : Accès complet à tout
- **Dev** : Accès limité au développement
- **Agent** : Accès client uniquement

---

## 📱 **ACCÈS MOBILE ADMIN**

### 📲 **Application Mobile**
L'interface admin est **responsive** et fonctionne sur :
- ✅ **Smartphones** (Android/iOS)
- ✅ **Tablettes** 
- ✅ **Ordinateurs**

### 🌐 **URL Mobile**
```
https://habibgroupe.com/admin
```

---

## 🚨 **DÉPANNAGE ADMIN**

### Problème : "Page introuvable"
**Solution** : Vous utilisez la version simple. Hébergez la version complète.

### Problème : "Identifiants incorrects"
**Solution** : Vérifiez que l'utilisateur admin est créé dans la base de données.

### Problème : "Accès refusé"
**Solution** : Vérifiez que l'utilisateur a le rôle 'admin' dans la table `user_roles`.

---

## 🎯 **UTILISATION QUOTIDIENNE**

### Matin (9h-10h) :
1. **Consultez le dashboard** pour les nouvelles demandes
2. **Traitez les devis** en attente
3. **Vérifiez les polices** expirantes

### Après-midi (14h-16h) :
1. **Suivez les paiements**
2. **Contactez les clients** pour renouvellements
3. **Analysez les statistiques** du jour

### Soir (17h-18h) :
1. **Exportez les rapports** quotidiens
2. **Planifiez les messages** WhatsApp automatiques
3. **Préparez le travail** du lendemain

---

## 📋 **RACCOURCIS ADMIN**

### Navigation Rapide :
- **Dashboard** : `/admin`
- **Clients** : `/admin/clients`
- **Ventes** : `/admin/sales`
- **WhatsApp** : `/admin/whatsapp`
- **Rapports** : `/admin/reports`

### Actions Rapides :
- **Nouveau client** : `Ctrl + N`
- **Recherche** : `Ctrl + F`
- **Export** : `Ctrl + E`
- **Rafraîchir** : `F5`

---

## 🔐 **SÉCURITÉ ADMIN**

### Bonnes Pratiques :
- ✅ **Changez le mot de passe** par défaut
- ✅ **Utilisez un mot de passe fort**
- ✅ **Déconnectez-vous** après utilisation
- ✅ **Évitez les WiFi publics**

### Session :
- **Durée** : 24 heures automatique
- **Déconnexion** : Manuel ou automatique
- **Sécurité** : JWT token crypté

---

## 🎉 **PRÊT À UTILISER L'ADMIN !**

### Récapitulatif :
1. **URL** : `https://habibgroupe.com/admin`
2. **Email** : `admin@habibgroupe.com`
3. **Mot de passe** : `admin123`
4. **Fonctionnalités** : Complètes et professionnelles

### Prochaines Étapes :
1. **Hébergez le site complet** sur Systalink
2. **Créez l'utilisateur admin** dans la base
3. **Accédez à l'interface** et configurez
4. **Personnalisez** selon vos besoins

**Votre interface admin professionnelle est prête !** 🔐📊🎋
