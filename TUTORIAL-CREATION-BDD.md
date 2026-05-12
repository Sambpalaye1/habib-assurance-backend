# 🗄️ TUTORIEL CRÉATION BASE DE DONNÉES - Systalink

## 📋 **ÉTAPES POUR CRÉER LA BASE DE DONNÉES**

### 🎯 **Étape 1: Accéder à Systalink**

1. **Connectez-vous à votre panneau Systalink**
2. **Identifiants** : votre email et mot de passe Systalink
3. **Tableau de bord** → cherchez "Bases de données"

---

## 🚀 **MÉTHODE 1: VIA PANNEAU SYSTALINK**

### Étape 1.1: Créer la Base de Données
1. **Dans le tableau de bord** → cliquez sur **"Bases de données MySQL"**
2. **Cliquez sur** **"Créer une base de données"**
3. **Remplissez les informations** :
   - **Nom de la base** : `habib_assurance`
   - **Utilisateur** : `habib_user`
   - **Mot de passe** : `choisissez_un_mot_de_passe_solide`
   - **Type** : MySQL 8.0 (sélectionnez si disponible)
4. **Cliquez sur** **"Créer"**

### Étape 1.2: Notez les Informations
**Notez ces informations quelque part :**
```
📝 Nom de la base : habib_assurance
👤 Utilisateur : habib_user
🔐 Mot de passe : [votre_mot_de_passe]
🌐 Hôte : localhost (ou l'adresse fournie)
```

---

## 🛠️ **MÉTHODE 2: VIA PHPMYADMIN**

### Étape 2.1: Accéder à phpMyAdmin
1. **Dans le tableau de bord Systalink**
2. **Cherchez** **"phpMyAdmin"** ou **"Gestionnaire MySQL"**
3. **Cliquez pour ouvrir** phpMyAdmin

### Étape 2.2: Créer la Base (si pas déjà fait)
1. **Dans phpMyAdmin** → cliquez sur **"Nouvelle base de données"**
2. **Nom de la base** : `habib_assurance`
3. **"Créer"**

### Étape 2.3: Importer le Schéma
1. **Sélectionnez la base** `habib_assurance` (côté gauche)
2. **Cliquez sur l'onglet** **"Importer"**
3. **"Choisissez le fichier"** → sélectionnez `database/mysql_schema.sql`
4. **"Exécuter"** (en bas de la page)

---

## ✅ **VÉRIFICATION**

### Étape 3.1: Vérifiez les Tables Créées
1. **Dans phpMyAdmin** → sélectionnez `habib_assurance`
2. **Vous devriez voir ces tables** :
   - ✅ `users`
   - ✅ `user_roles`
   - ✅ `sales`
   - ✅ `insurance_policies`
   - ✅ `whatsapp_messages`
   - ✅ `ai_agent_logs`

### Étape 3.2: Testez la Connexion
1. **Cliquez sur une table** (ex: `users`)
2. **"Afficher"** → vous devriez voir les colonnes
3. **"Insérer"** → testez d'ajouter une donnée

---

## 🚨 **PROBLÈMES COURANTS**

### ❌ **"Base de données introuvable"**
**Solution** : Vérifiez que vous avez bien créé `habib_assurance`

### ❌ **"Accès refusé"**
**Solution** : Vérifiez l'utilisateur `habib_user` et le mot de passe

### ❌ **"Importation échouée"**
**Solution** : Vérifiez que le fichier `mysql_schema.sql` est complet

---

## 📱 **CAPTURES D'ÉCRAN GUIDE**

### Étape 1: Panneau Systalink
```
📸 [Screenshot du tableau de bord]
├── Sites web
├── Bases de données MySQL ← CLIQUEZ ICI
├── Boîtes aux lettres
└── Domaines
```

### Étape 2: Création Base
```
📸 [Screenshot formulaire création]
Nom de la base: [habib_assurance]
Utilisateur: [habib_user]
Mot de passe: [********]
[CRÉER]
```

### Étape 3: phpMyAdmin
```
📸 [Screenshot phpMyAdmin]
├── habib_assurance ← SÉLECTIONNEZ
├── information_schema
└── mysql

[Importer] ← CLIQUEZ ICI
```

---

## 🔧 **COMMANDE SQL DIRECTE (Alternative)**

Si vous avez accès à la console SQL :

### Étape 4.1: Exécuter la Commande
```sql
-- Créer la base de données
CREATE DATABASE IF NOT EXISTS habib_assurance;

-- Utiliser la base
USE habib_assurance;

-- Le reste du schéma sera importé depuis le fichier
```

### Étape 4.2: Importer le Fichier
```bash
# Si vous avez accès SSH/FTP
mysql -u habib_user -p habib_assurance < database/mysql_schema.sql
```

---

## 🎯 **RÉSUMÉ RAPIDE**

### ✅ **En 5 Étapes Simples :**
1. **Connectez-vous** à Systalink
2. **"Bases de données MySQL"** → "Créer"
3. **Nommez** : `habib_assurance`, utilisateur : `habib_user`
4. **phpMyAdmin** → sélectionnez `habib_assurance`
5. **"Importer"** → choisissez `mysql_schema.sql`

### 📋 **Checklist Finale :**
- ✅ Base `habib_assurance` créée
- ✅ Utilisateur `habib_user` créé
- ✅ Schéma importé
- ✅ Tables visibles dans phpMyAdmin
- ✅ Connexion testée

---

## 🎉 **FÉLICITATIONS !**

Votre base de données est maintenant prête ! 

**Prochaine étape :** Hébergez votre site sur Systalink

**Votre base de données MySQL est opérationnelle pour Habib Groupe Assurance !** 🗄️🎋🇸🇳
