# 📦 École CP v2.0 - Package Complet

## 🎉 Nouveau Départ - Version Moderne

Cette version a été **complètement recréée** avec les technologies modernes et est prête pour l'hébergement web.

---

## 📋 Contenu du package

```
ecole-cp-app/
│
├── 📖 README.md              ← Lisez-moi d'abord !
├── ⚡ QUICK_START.md         ← Démarrage en 5 minutes
├── 🌐 HEBERGEMENT_WEB.md     ← Guide complet hébergement
├── 🚫 .gitignore
│
├── 📡 backend/               ← API Node.js
│   ├── server.js            ← Serveur Express
│   ├── database.js          ← SQLite + données démo
│   ├── package.json         ← Dépendances Node
│   └── .env.example         ← Configuration
│
└── 🎨 frontend/              ← Application React
    ├── src/
    │   ├── App.js           ← Application principale
    │   ├── App.css          ← Styles modernes
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json         ← Dépendances React
```

---

## 🚀 Solutions d'hébergement

### 1️⃣ Railway - LE PLUS SIMPLE ⭐
```
✅ Gratuit pour commencer ($5 offerts)
✅ Déploiement automatique
✅ Base de données incluse
✅ HTTPS automatique
💰 ~$5-10/mois après
```

**Commandes :**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### 2️⃣ Render - 100% GRATUIT
```
✅ Complètement gratuit
✅ HTTPS automatique
⚠️ Apps s'endorment après 15 min
⚠️ Démarrage lent (30 sec)
💰 Gratuit à vie
```

**Via interface web :**
1. render.com → Nouveau Web Service
2. Connecter GitHub
3. Déployer

### 3️⃣ Vercel + Railway/Render
```
✅ Frontend ultra-rapide
✅ Backend flexible
💰 Gratuit ou ~$5/mois
```

### 4️⃣ VPS (Contabo, OVH, Hetzner)
```
✅ Contrôle total
✅ Performances maximales
⚠️ Plus technique
💰 3-6€/mois
```

---

## ⚡ Installation locale (Test)

### Étape 1 : Backend
```bash
cd backend
npm install
cp .env.example .env
# Éditez .env et changez JWT_SECRET
npm start
```

✅ Backend lancé sur http://localhost:3001

### Étape 2 : Frontend
```bash
cd frontend
npm install
npm start
```

✅ Frontend lancé sur http://localhost:3000

### Étape 3 : Créer l'admin
```bash
curl -X POST http://localhost:3001/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

✅ Admin créé : admin / admin123

---

## 🌐 Hébergement Web - Étapes

### Railway (Recommandé)

1. **Créer compte** : railway.app
2. **Nouveau projet** : Deploy from GitHub
3. **Variables d'environnement** :
   ```
   Backend:
   NODE_ENV=production
   JWT_SECRET=votre-secret-securise
   
   Frontend:
   REACT_APP_API_URL=https://votre-backend.up.railway.app/api
   ```
4. **Déployer** : railway up
5. **Accéder** : https://votre-app.up.railway.app

### Render (Gratuit)

1. **Créer compte** : render.com
2. **Backend** :
   - New Web Service
   - Build: `npm install`
   - Start: `node server.js`
   - Variables : NODE_ENV, JWT_SECRET
3. **Frontend** :
   - New Static Site
   - Build: `npm install && npm run build`
   - Variable : REACT_APP_API_URL
4. **Accéder** : https://ecole-cp.onrender.com

### VPS

1. **Louer un VPS** : Contabo (4€/mois)
2. **Installer Node.js 18** :
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
3. **Installer PM2** :
   ```bash
   sudo npm install -g pm2
   ```
4. **Déployer l'app** :
   ```bash
   cd /opt
   git clone https://github.com/votre-repo/ecole-cp-app.git
   cd ecole-cp-app/backend
   npm install
   pm2 start server.js --name backend
   ```
5. **Configurer Nginx + HTTPS** (voir HEBERGEMENT_WEB.md)

---

## 📊 Comparaison rapide

| Critère | Railway | Render | VPS |
|---------|---------|--------|-----|
| **Prix** | $5/mois | Gratuit | 4€/mois |
| **Difficulté** | ⭐ Facile | ⭐ Facile | ⭐⭐⭐ Avancé |
| **Temps setup** | 10 min | 15 min | 30 min |
| **Performance** | ⭐⭐⭐ Bon | ⭐⭐ Moyen | ⭐⭐⭐⭐ Excellent |
| **Contrôle** | ⭐⭐ Limité | ⭐⭐ Limité | ⭐⭐⭐⭐ Total |
| **HTTPS** | ✅ Auto | ✅ Auto | ⚙️ Config |
| **Recommandé pour** | Débutants | Gratuit | Pros |

---

## 🎓 Fonctionnalités

### Pour les élèves
- ✅ Inscription / Connexion
- ✅ Mode invité (sans compte)
- ✅ 3 matières : Français, Maths, Découverte
- ✅ Exercices interactifs variés
- ✅ Progression sauvegardée
- ✅ Statistiques personnelles

### Pour les enseignants (Admin)
- ✅ Création de matières
- ✅ Ajout de chapitres
- ✅ Création d'exercices :
  - QCM (choix multiples)
  - Textes à trous
  - Calculs mathématiques
  - Comptage
- ✅ Modification d'exercices
- ✅ Suppression d'exercices

### Types d'exercices
1. **QCM** - Choix multiples
2. **Textes à trous** - Compléter des mots
3. **Mathématiques** - Additions, soustractions
4. **Comptage** - Compter des objets
5. **Lecture** - Questions sur un texte

---

## 🔧 Technologies

### Backend (API)
- **Node.js 18+** - Runtime JavaScript
- **Express 4** - Framework web
- **SQLite** (better-sqlite3) - Base de données
- **JWT** - Authentification
- **bcrypt** - Sécurité mots de passe

### Frontend (Interface)
- **React 18** - Framework UI
- **React Scripts 5** - Build tools
- **CSS moderne** - Design responsive

---

## 📝 Configuration

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=CHANGEZ_MOI_SECRET_ULTRA_SECURISE_123456789
DATABASE_PATH=./data/ecole-cp.db
```

### Frontend (.env)
```env
# Local
REACT_APP_API_URL=http://localhost:3001/api

# Railway
REACT_APP_API_URL=https://ecole-cp-backend.up.railway.app/api

# Render
REACT_APP_API_URL=https://ecole-cp-backend.onrender.com/api

# VPS
REACT_APP_API_URL=https://votre-domaine.com/api
```

---

## 🎯 Prochaines étapes

### 1. Tester en local
```bash
# Suivez QUICK_START.md
```

### 2. Choisir une solution d'hébergement
```bash
# Consultez HEBERGEMENT_WEB.md
```

### 3. Déployer
```bash
# Railway, Render ou VPS
```

### 4. Partager
```bash
# Donnez l'URL à vos élèves !
```

---

## ✅ Checklist de déploiement

- [ ] Backend installé et testé en local
- [ ] Frontend installé et testé en local
- [ ] Compte admin créé
- [ ] Solution d'hébergement choisie
- [ ] Variables d'environnement configurées
- [ ] JWT_SECRET changé (IMPORTANT !)
- [ ] Backend déployé
- [ ] Frontend déployé
- [ ] URL de l'API configurée dans le frontend
- [ ] Application accessible sur Internet
- [ ] Test de connexion réussi
- [ ] HTTPS configuré (recommandé)
- [ ] Mot de passe admin changé

---

## 🆘 Support

### Problèmes courants

**1. "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**2. "Cannot connect to API"**
→ Vérifiez `REACT_APP_API_URL` dans frontend/.env

**3. "Port already in use"**
```bash
# Changer le port dans backend/.env
PORT=3002
```

**4. Base de données verrouillée**
```bash
rm backend/data/ecole-cp.db
# Redémarrer le backend (recrée la DB)
```

### Logs

**Railway :**
```bash
railway logs
```

**Render :**
Dashboard → Logs

**VPS :**
```bash
pm2 logs
```

---

## 📚 Documentation

- **README.md** - Vue d'ensemble du projet
- **QUICK_START.md** - Démarrage rapide 5 minutes
- **HEBERGEMENT_WEB.md** - Guide complet hébergement
- **Ce fichier** - Récapitulatif général

---

## 🎉 Conclusion

Vous avez maintenant **tout ce qu'il faut** pour :

1. ✅ Tester l'application en local
2. ✅ La déployer sur Internet
3. ✅ La partager avec vos élèves
4. ✅ Créer vos propres exercices

**Bonne chance avec École CP ! 🚀**

**Questions ? Consultez HEBERGEMENT_WEB.md pour plus de détails !**
