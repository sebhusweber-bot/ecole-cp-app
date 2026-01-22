# 🌐 Guide d'hébergement École CP sur le Web

Ce guide vous présente **4 solutions** pour héberger votre application École CP sur Internet, du gratuit au payant.

---

## 📊 Comparatif des solutions

| Solution | Prix | Difficulté | Temps | Recommandé pour |
|----------|------|------------|-------|-----------------|
| **Railway** | Gratuit puis $5/mois | ⭐ Facile | 10 min | Débutants |
| **Render** | Gratuit | ⭐ Facile | 15 min | Tous |
| **Vercel + PlanetScale** | Gratuit | ⭐⭐ Moyen | 20 min | Développeurs |
| **VPS (Contabo/OVH)** | 4€/mois | ⭐⭐⭐ Avancé | 30 min | Contrôle total |

---

## 🚀 Solution 1 : Railway (RECOMMANDÉ - Le plus simple)

**Railway** héberge automatiquement votre backend ET frontend.

### ✅ Avantages
- Configuration automatique
- Base de données incluse
- HTTPS automatique
- Domaine gratuit (.up.railway.app)
- $5 offerts à l'inscription

### 📋 Étapes

#### 1. Créer un compte Railway
- Allez sur [railway.app](https://railway.app)
- Connectez-vous avec GitHub
- $5 de crédit gratuit offerts

#### 2. Créer un nouveau projet
```bash
# Option A : Depuis GitHub (recommandé)
1. Uploadez votre dossier ecole-cp-app sur GitHub
2. Dans Railway : "New Project" → "Deploy from GitHub repo"
3. Sélectionnez votre repository

# Option B : Depuis CLI Railway
npm install -g @railway/cli
railway login
railway init
railway up
```

#### 3. Configuration du backend

Dans Railway, ajoutez ces **variables d'environnement** :

```
NODE_ENV=production
PORT=3001
JWT_SECRET=votre-secret-ultra-securise-changez-moi-123456789
DATABASE_PATH=/app/data/ecole-cp.db
```

#### 4. Configuration du frontend

Ajoutez cette variable d'environnement pour le frontend :

```
REACT_APP_API_URL=https://votre-backend.up.railway.app/api
```

Remplacez `votre-backend` par l'URL que Railway vous donne pour le backend.

#### 5. Déployer
```bash
railway up
```

✅ **C'est tout !** Votre app est en ligne !

### 💰 Coûts
- **$5/mois gratuits** offerts
- Après : **~$5-10/mois** selon l'utilisation
- Pas de carte bancaire requise pour commencer

### 📱 Accès
- Frontend : `https://votre-app.up.railway.app`
- Backend : `https://votre-backend.up.railway.app`

---

## 🎨 Solution 2 : Render (100% Gratuit)

**Render** est complètement gratuit pour les petites apps.

### ✅ Avantages
- Totalement gratuit
- HTTPS automatique
- Configuration simple
- Domaine gratuit (.onrender.com)

### ⚠️ Inconvénients
- Les apps gratuites s'endorment après 15 min d'inactivité
- Démarrage lent (30 secondes) au premier accès

### 📋 Étapes

#### 1. Créer un compte
- Allez sur [render.com](https://render.com)
- Inscrivez-vous (gratuit)

#### 2. Déployer le backend

1. **New** → **Web Service**
2. Connectez votre GitHub ou uploadez le code
3. Configuration :
   ```
   Name: ecole-cp-backend
   Environment: Node
   Build Command: npm install
   Start Command: node server.js
   ```

4. Variables d'environnement :
   ```
   NODE_ENV=production
   JWT_SECRET=votre-secret-securise
   DATABASE_PATH=/opt/render/project/data/ecole-cp.db
   ```

5. **Create Web Service**

#### 3. Déployer le frontend

1. **New** → **Static Site**
2. Sélectionnez le dossier `frontend`
3. Configuration :
   ```
   Build Command: npm install && npm run build
   Publish Directory: build
   ```

4. Variable d'environnement :
   ```
   REACT_APP_API_URL=https://ecole-cp-backend.onrender.com/api
   ```

5. **Create Static Site**

### 📱 Accès
- Frontend : `https://ecole-cp.onrender.com`
- Backend : `https://ecole-cp-backend.onrender.com`

### 💰 Coûts
- **100% gratuit**
- Option payante : $7/mois pour éviter l'endormissement

---

## ⚡ Solution 3 : Vercel (Frontend) + Railway/Render (Backend)

**Vercel** est ultra-rapide pour le frontend. Combinez-le avec Railway ou Render pour le backend.

### 📋 Étapes

#### 1. Déployer le backend sur Railway ou Render
Suivez les étapes de la Solution 1 ou 2 pour le backend.

#### 2. Déployer le frontend sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez GitHub
3. **Import Project** → Sélectionnez le dossier `frontend`
4. Configuration :
   ```
   Framework Preset: Create React App
   Build Command: npm run build
   Output Directory: build
   ```

5. Variable d'environnement :
   ```
   REACT_APP_API_URL=https://votre-backend.onrender.com/api
   ```

6. **Deploy**

### 📱 Accès
- Frontend : `https://ecole-cp.vercel.app`
- Backend : Sur Railway ou Render

### 💰 Coûts
- **Frontend Vercel : Gratuit**
- **Backend : Voir Solution 1 ou 2**

---

## 🖥️ Solution 4 : VPS (Serveur dédié)

Pour un **contrôle total** et des **performances maximales**.

### 📊 Fournisseurs recommandés

| Fournisseur | Prix | RAM | Stockage |
|-------------|------|-----|----------|
| **Contabo** | 4€/mois | 4 GB | 50 GB |
| **OVH** | 3.50€/mois | 2 GB | 20 GB |
| **Hetzner** | 4.50€/mois | 4 GB | 40 GB |
| **DigitalOcean** | $6/mois | 1 GB | 25 GB |

### 📋 Étapes (Ubuntu 22.04)

#### 1. Créer le VPS
- Choisissez **Ubuntu 22.04 LTS**
- Notez l'adresse IP

#### 2. Se connecter en SSH
```bash
ssh root@VOTRE_IP
```

#### 3. Installer Node.js 18
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Devrait afficher v18.x
```

#### 4. Installer PM2 (gestionnaire de processus)
```bash
sudo npm install -g pm2
```

#### 5. Télécharger l'application
```bash
cd /opt
git clone https://github.com/VOTRE_USERNAME/ecole-cp-app.git
# OU
wget https://votresite.com/ecole-cp-app.zip
unzip ecole-cp-app.zip
```

#### 6. Installer et démarrer le backend
```bash
cd /opt/ecole-cp-app/backend
npm install --production

# Créer le .env
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
JWT_SECRET=votre-secret-super-securise
DATABASE_PATH=/opt/ecole-cp-app/data/ecole-cp.db
EOF

# Démarrer avec PM2
pm2 start server.js --name ecole-cp-backend
pm2 save
pm2 startup
```

#### 7. Compiler et démarrer le frontend
```bash
cd /opt/ecole-cp-app/frontend

# Configurer l'URL de l'API
echo "REACT_APP_API_URL=http://VOTRE_IP:3001/api" > .env

# Installer et compiler
npm install
npm run build

# Installer un serveur web
sudo npm install -g serve

# Démarrer avec PM2
pm2 start "serve -s build -p 80" --name ecole-cp-frontend
pm2 save
```

#### 8. Configurer le pare-feu
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 🌐 Ajouter un nom de domaine (optionnel)

#### 1. Acheter un domaine
- **Namecheap** : ~10€/an
- **OVH** : ~5€/an
- **Gandi** : ~15€/an

#### 2. Configurer le DNS
Ajoutez un enregistrement A :
```
Type: A
Nom: @
Valeur: VOTRE_IP_VPS
TTL: 3600
```

#### 3. Installer HTTPS avec Let's Encrypt
```bash
sudo apt install -y nginx certbot python3-certbot-nginx

# Configurer Nginx
sudo nano /etc/nginx/sites-available/ecole-cp

# Coller cette configuration :
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activer le site
sudo ln -s /etc/nginx/sites-available/ecole-cp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Installer le certificat SSL
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

### 📱 Accès
- **Avec domaine** : `https://votre-domaine.com`
- **Sans domaine** : `http://VOTRE_IP`

### 💰 Coûts
- **VPS** : 3-6€/mois
- **Domaine** : 5-15€/an (optionnel)
- **Total** : ~4-7€/mois

---

## 📌 Recommandations finales

### 🎯 Pour débuter
→ **Railway** ou **Render** (gratuit et simple)

### 💼 Pour un projet sérieux
→ **VPS** (contrôle total, performances)

### ⚡ Pour de la performance
→ **Vercel** (frontend) + **Railway** (backend)

### 💰 Pour du 100% gratuit
→ **Render** (frontend + backend)

---

## 🔧 Configuration de l'URL de l'API

Pour chaque solution, vous devez configurer l'URL de l'API dans le frontend.

### Créez un fichier `.env` dans le dossier `frontend` :

```env
# Pour Railway
REACT_APP_API_URL=https://ecole-cp-backend.up.railway.app/api

# Pour Render
REACT_APP_API_URL=https://ecole-cp-backend.onrender.com/api

# Pour VPS
REACT_APP_API_URL=http://VOTRE_IP:3001/api

# Pour VPS avec domaine
REACT_APP_API_URL=https://votre-domaine.com/api
```

Puis **recompilez** le frontend :
```bash
cd frontend
npm run build
```

---

## ✅ Checklist finale

- [ ] Backend déployé et accessible
- [ ] Base de données créée et initialisée
- [ ] Frontend déployé
- [ ] URL de l'API configurée dans le frontend
- [ ] Compte admin créé
- [ ] Test de connexion réussi
- [ ] HTTPS configuré (recommandé)
- [ ] Domaine configuré (optionnel)

---

## 🆘 Besoin d'aide ?

### Logs et débogage

**Railway :**
```bash
railway logs
```

**Render :**
Consultez les logs dans le dashboard

**VPS :**
```bash
# Logs du backend
pm2 logs ecole-cp-backend

# Logs du frontend
pm2 logs ecole-cp-frontend

# Logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Problèmes courants

**1. "Cannot connect to API"**
→ Vérifiez l'URL dans `REACT_APP_API_URL`
→ Vérifiez que le backend est bien démarré

**2. "CORS error"**
→ Le backend doit autoriser votre domaine frontend
→ Ajoutez CORS dans `server.js` si nécessaire

**3. "Database error"**
→ Vérifiez que le dossier `data/` existe
→ Vérifiez les permissions d'écriture

---

## 🎉 Félicitations !

Votre application École CP est maintenant accessible sur Internet ! 🚀

Partagez le lien avec vos élèves et profitez de l'apprentissage en ligne !
