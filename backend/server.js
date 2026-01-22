require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-super-securise-changez-moi';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());

// Health check pour les plateformes d'hébergement
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Route racine
app.get('/', (req, res) => {
  res.json({ 
    message: 'API École CP',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      subjects: '/api/subjects',
      chapters: '/api/chapters/:id',
      exercises: '/api/exercises/:id',
      progress: '/api/progress (auth)',
      admin: '/api/admin/* (auth + admin)'
    }
  });
});

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
    req.user = user;
    next();
  });
};

// Middleware pour vérifier le rôle admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
};

// ==================== ROUTES D'AUTHENTIFICATION ====================

// Inscription
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }
    
    if (username.length < 3) {
      return res.status(400).json({ error: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const result = db.prepare(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
    ).run(username, hashedPassword, 'student');
    
    // Générer le token
    const token = jwt.sign(
      { id: result.lastInsertRowid, username, role: 'student' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: result.lastInsertRowid,
        username,
        role: 'student'
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// Connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }
    
    // Chercher l'utilisateur
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Utilisateur ou mot de passe incorrect' });
    }
    
    // Générer le token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// ==================== ROUTES DES MATIÈRES ====================

// Liste des matières
app.get('/api/subjects', (req, res) => {
  try {
    const subjects = db.prepare('SELECT * FROM subjects ORDER BY order_index').all();
    res.json(subjects);
  } catch (error) {
    console.error('Erreur récupération matières:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des matières' });
  }
});

// Détails d'une matière avec ses chapitres
app.get('/api/subjects/:id', (req, res) => {
  try {
    const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }
    
    const chapters = db.prepare('SELECT * FROM chapters WHERE subject_id = ? ORDER BY order_index').all(req.params.id);
    subject.chapters = chapters;
    
    res.json(subject);
  } catch (error) {
    console.error('Erreur récupération matière:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la matière' });
  }
});

// ==================== ROUTES DES CHAPITRES ====================

// Détails d'un chapitre avec ses exercices
app.get('/api/chapters/:id', (req, res) => {
  try {
    const chapter = db.prepare('SELECT * FROM chapters WHERE id = ?').get(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ error: 'Chapitre non trouvé' });
    }
    
    const exercises = db.prepare('SELECT * FROM exercises WHERE chapter_id = ? ORDER BY order_index').all(req.params.id);
    
    // Parser le contenu JSON des exercices
    chapter.exercises = exercises.map(exercise => ({
      ...exercise,
      content: JSON.parse(exercise.content)
    }));
    
    res.json(chapter);
  } catch (error) {
    console.error('Erreur récupération chapitre:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du chapitre' });
  }
});

// ==================== ROUTES DES EXERCICES ====================

// Détails d'un exercice
app.get('/api/exercises/:id', (req, res) => {
  try {
    const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' });
    }
    
    exercise.content = JSON.parse(exercise.content);
    res.json(exercise);
  } catch (error) {
    console.error('Erreur récupération exercice:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'exercice' });
  }
});

// Soumettre une réponse à un exercice
app.post('/api/exercises/:id/submit', (req, res) => {
  try {
    const { answer, isGuest } = req.body;
    const exerciseId = req.params.id;
    
    const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(exerciseId);
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercice non trouvé' });
    }
    
    const content = JSON.parse(exercise.content);
    let isCorrect = false;
    let score = 0;
    
    // Vérifier la réponse selon le type d'exercice
    switch (exercise.type) {
      case 'multiple-choice':
        if (content.multiSelect) {
          // Comparaison de tableaux
          isCorrect = JSON.stringify(answer.sort()) === JSON.stringify(content.correct.sort());
        } else {
          isCorrect = answer === content.correct;
        }
        break;
      
      case 'fill-blank':
      case 'math':
      case 'count':
        isCorrect = answer.toString().toLowerCase() === content.answer.toString().toLowerCase();
        break;
      
      default:
        isCorrect = false;
    }
    
    score = isCorrect ? 100 : 0;
    
    // Enregistrer la progression si l'utilisateur est connecté
    if (!isGuest && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const existing = db.prepare(
          'SELECT * FROM user_progress WHERE user_id = ? AND exercise_id = ?'
        ).get(decoded.id, exerciseId);
        
        if (existing) {
          // Mettre à jour la progression
          db.prepare(
            'UPDATE user_progress SET score = ?, attempts = attempts + 1, completed = ?, last_attempt = CURRENT_TIMESTAMP WHERE user_id = ? AND exercise_id = ?'
          ).run(
            Math.max(existing.score, score),
            isCorrect ? 1 : existing.completed,
            decoded.id,
            exerciseId
          );
        } else {
          // Créer une nouvelle progression
          db.prepare(
            'INSERT INTO user_progress (user_id, exercise_id, score, attempts, completed) VALUES (?, ?, ?, 1, ?)'
          ).run(decoded.id, exerciseId, score, isCorrect ? 1 : 0);
        }
      } catch (err) {
        console.error('Erreur enregistrement progression:', err);
      }
    }
    
    res.json({
      correct: isCorrect,
      score: score
    });
  } catch (error) {
    console.error('Erreur soumission exercice:', error);
    res.status(500).json({ error: 'Erreur lors de la soumission de la réponse' });
  }
});

// ==================== ROUTES DE PROGRESSION ====================

// Progression de l'utilisateur connecté
app.get('/api/progress', authenticateToken, (req, res) => {
  try {
    const progress = db.prepare(`
      SELECT 
        up.*,
        e.title as exercise_title,
        e.type as exercise_type,
        c.name as chapter_name,
        s.name as subject_name,
        s.color as subject_color
      FROM user_progress up
      JOIN exercises e ON up.exercise_id = e.id
      JOIN chapters c ON e.chapter_id = c.id
      JOIN subjects s ON c.subject_id = s.id
      WHERE up.user_id = ?
      ORDER BY up.last_attempt DESC
    `).all(req.user.id);
    
    res.json(progress);
  } catch (error) {
    console.error('Erreur récupération progression:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des progrès' });
  }
});

// Statistiques de l'utilisateur
app.get('/api/stats', authenticateToken, (req, res) => {
  try {
    const stats = {
      totalExercises: db.prepare('SELECT COUNT(*) as count FROM exercises').get().count,
      completedExercises: db.prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND completed = 1').get(req.user.id).count,
      averageScore: db.prepare('SELECT AVG(score) as avg FROM user_progress WHERE user_id = ?').get(req.user.id).avg || 0,
      totalAttempts: db.prepare('SELECT SUM(attempts) as sum FROM user_progress WHERE user_id = ?').get(req.user.id).sum || 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// ==================== ROUTES ADMIN ====================

// Créer une matière
app.post('/api/admin/subjects', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, icon, color, order_index } = req.body;
    
    const result = db.prepare(
      'INSERT INTO subjects (name, icon, color, order_index) VALUES (?, ?, ?, ?)'
    ).run(name, icon, color, order_index || 0);
    
    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      icon,
      color,
      order_index
    });
  } catch (error) {
    console.error('Erreur création matière:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la matière' });
  }
});

// Créer un chapitre
app.post('/api/admin/chapters', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { subject_id, name, description, order_index } = req.body;
    
    const result = db.prepare(
      'INSERT INTO chapters (subject_id, name, description, order_index) VALUES (?, ?, ?, ?)'
    ).run(subject_id, name, description, order_index || 0);
    
    res.status(201).json({
      id: result.lastInsertRowid,
      subject_id,
      name,
      description,
      order_index
    });
  } catch (error) {
    console.error('Erreur création chapitre:', error);
    res.status(500).json({ error: 'Erreur lors de la création du chapitre' });
  }
});

// Créer un exercice
app.post('/api/admin/exercises', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { chapter_id, title, type, difficulty, content, order_index } = req.body;
    
    const result = db.prepare(
      'INSERT INTO exercises (chapter_id, title, type, difficulty, content, order_index) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      chapter_id,
      title,
      type,
      difficulty || 1,
      JSON.stringify(content),
      order_index || 0
    );
    
    res.status(201).json({
      id: result.lastInsertRowid,
      chapter_id,
      title,
      type,
      difficulty,
      content,
      order_index
    });
  } catch (error) {
    console.error('Erreur création exercice:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'exercice' });
  }
});

// Modifier un exercice
app.put('/api/admin/exercises/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { title, type, difficulty, content } = req.body;
    
    db.prepare(
      'UPDATE exercises SET title = ?, type = ?, difficulty = ?, content = ? WHERE id = ?'
    ).run(title, type, difficulty, JSON.stringify(content), req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur modification exercice:', error);
    res.status(500).json({ error: 'Erreur lors de la modification de l\'exercice' });
  }
});

// Supprimer un exercice
app.delete('/api/admin/exercises/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM exercises WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression exercice:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'exercice' });
  }
});

// Créer le compte admin initial
app.post('/api/admin/setup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Vérifier si un admin existe déjà
    const existingAdmin = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');
    if (existingAdmin) {
      return res.status(400).json({ error: 'Un administrateur existe déjà' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
    ).run(username, hashedPassword, 'admin');
    
    res.status(201).json({
      message: 'Compte administrateur créé avec succès',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Erreur création admin:', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte administrateur' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log('════════════════════════════════════════');
  console.log(`🚀 École CP - Backend API`);
  console.log(`📡 Serveur démarré sur le port ${PORT}`);
  console.log(`🌍 Environnement: ${NODE_ENV}`);
  console.log(`📍 API disponible: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log('════════════════════════════════════════');
});

// Gestion des erreurs non gérées
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
});
