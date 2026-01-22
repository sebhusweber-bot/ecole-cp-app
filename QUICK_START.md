# ⚡ Démarrage Rapide - École CP

## 🎯 En 5 minutes chrono !

### Option 1 : Tester en local

```bash
# 1. Backend
cd backend
npm install
echo 'NODE_ENV=development
PORT=3001
JWT_SECRET=mon-secret-dev-123
DATABASE_PATH=./data/ecole-cp.db' > .env
npm start

# 2. Frontend (nouveau terminal)
cd frontend
npm install
npm start

# 3. Créer l'admin
curl -X POST http://localhost:3001/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 4. Ouvrir http://localhost:3000
```

### Option 2 : Déployer sur Railway (gratuit)

```bash
# 1. Installer Railway CLI
npm install -g @railway/cli

# 2. Se connecter
railway login

# 3. Déployer
railway init
railway up

# C'est tout ! Railway vous donne l'URL
```

### Option 3 : Déployer sur Render (gratuit)

1. Allez sur [render.com](https://render.com)
2. Créez un compte (gratuit)
3. **New Web Service** → Connectez GitHub
4. Configurez et déployez

Détails complets dans [HEBERGEMENT_WEB.md](HEBERGEMENT_WEB.md)

---

## 🔑 Compte admin par défaut

```
Username: admin
Password: admin123
```

⚠️ **CHANGEZ LE MOT DE PASSE** après la première connexion !

---

## 📱 Accès après installation

**Local :**
- Frontend : http://localhost:3000
- Backend : http://localhost:3001

**Railway :**
- Automatique : https://votre-app.up.railway.app

**Render :**
- Frontend : https://ecole-cp.onrender.com
- Backend : https://ecole-cp-backend.onrender.com

---

## 🆘 Problèmes ?

### Le backend ne démarre pas
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Le frontend ne se compile pas
```bash
cd frontend
rm -rf node_modules build package-lock.json
npm install
npm run build
```

### "Cannot connect to API"
Vérifiez le fichier `frontend/.env` :
```env
REACT_APP_API_URL=http://localhost:3001/api
```

---

## 📚 Prochaines étapes

1. ✅ Testez l'application en local
2. 📖 Lisez [HEBERGEMENT_WEB.md](HEBERGEMENT_WEB.md) pour déployer
3. 🎨 Personnalisez les exercices via le compte admin
4. 🚀 Partagez avec vos élèves !

**Bon apprentissage ! 🎓**
