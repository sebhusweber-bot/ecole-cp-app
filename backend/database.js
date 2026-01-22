const Database = require('better-sqlite3');
const path = require('path');

// Déterminer le chemin de la base de données
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'ecole-cp.db');
const dbDir = path.dirname(dbPath);

// Créer le dossier data s'il n'existe pas
const fs = require('fs');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Connexion à la base de données
const db = new Database(dbPath, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

// Activer les clés étrangères
db.pragma('foreign_keys = ON');

// Créer les tables si elles n'existent pas
const initDatabase = () => {
  // Table des utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des matières
  db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des chapitres
  db.exec(`
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    )
  `);

  // Table des exercices
  db.exec(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('multiple-choice', 'fill-blank', 'math', 'count', 'reading')),
      difficulty INTEGER DEFAULT 1 CHECK(difficulty BETWEEN 1 AND 3),
      content TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    )
  `);

  // Table de progression des utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      score INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT 0,
      last_attempt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
      UNIQUE(user_id, exercise_id)
    )
  `);

  // Insérer des données de démonstration si la base est vide
  const subjectCount = db.prepare('SELECT COUNT(*) as count FROM subjects').get().count;
  
  if (subjectCount === 0) {
    console.log('📚 Initialisation des données de démonstration...');
    
    // Matières
    const subjects = [
      { name: 'Français', icon: '📖', color: '#e74c3c' },
      { name: 'Mathématiques', icon: '🔢', color: '#3498db' },
      { name: 'Découverte du monde', icon: '🌍', color: '#2ecc71' }
    ];

    subjects.forEach((subject, index) => {
      db.prepare('INSERT INTO subjects (name, icon, color, order_index) VALUES (?, ?, ?, ?)').run(
        subject.name,
        subject.icon,
        subject.color,
        index
      );
    });

    // Chapitres pour Français (id: 1)
    const frenchChapters = [
      { subject_id: 1, name: 'Les voyelles', description: 'Apprendre les voyelles A, E, I, O, U, Y' },
      { subject_id: 1, name: 'Les consonnes', description: 'Découvrir les consonnes' },
      { subject_id: 1, name: 'Les syllabes', description: 'Former des syllabes simples' }
    ];

    frenchChapters.forEach((chapter, index) => {
      const result = db.prepare('INSERT INTO chapters (subject_id, name, description, order_index) VALUES (?, ?, ?, ?)').run(
        chapter.subject_id,
        chapter.name,
        chapter.description,
        index
      );

      // Exercices pour "Les voyelles"
      if (index === 0) {
        db.prepare('INSERT INTO exercises (chapter_id, title, type, difficulty, content, order_index) VALUES (?, ?, ?, ?, ?, ?)').run(
          result.lastInsertRowid,
          'Reconnaître la lettre A',
          'multiple-choice',
          1,
          JSON.stringify({
            question: 'Quelle est la bonne lettre A ?',
            options: ['B', 'A', 'D', 'P'],
            correct: 1
          }),
          0
        );

        db.prepare('INSERT INTO exercises (chapter_id, title, type, difficulty, content, order_index) VALUES (?, ?, ?, ?, ?, ?)').run(
          result.lastInsertRowid,
          'Compter les lettres A',
          'count',
          1,
          JSON.stringify({
            question: 'Combien y a-t-il de lettres A ?',
            text: 'A B A C A D A',
            answer: '4'
          }),
          1
        );
      }
    });

    // Chapitres pour Mathématiques (id: 2)
    const mathChapters = [
      { subject_id: 2, name: 'Les nombres de 0 à 10', description: 'Compter jusqu\'à 10' },
      { subject_id: 2, name: 'Addition simple', description: 'Additionner deux nombres' }
    ];

    mathChapters.forEach((chapter, index) => {
      const result = db.prepare('INSERT INTO chapters (subject_id, name, description, order_index) VALUES (?, ?, ?, ?)').run(
        chapter.subject_id,
        chapter.name,
        chapter.description,
        index
      );

      // Exercices pour "Les nombres de 0 à 10"
      if (index === 0) {
        db.prepare('INSERT INTO exercises (chapter_id, title, type, difficulty, content, order_index) VALUES (?, ?, ?, ?, ?, ?)').run(
          result.lastInsertRowid,
          'Compter les pommes',
          'count',
          1,
          JSON.stringify({
            question: 'Combien y a-t-il de pommes ?',
            image: '🍎🍎🍎',
            answer: '3'
          }),
          0
        );

        db.prepare('INSERT INTO exercises (chapter_id, title, type, difficulty, content, order_index) VALUES (?, ?, ?, ?, ?, ?)').run(
          result.lastInsertRowid,
          'Addition simple',
          'math',
          1,
          JSON.stringify({
            question: 'Combien font 2 + 3 ?',
            answer: '5'
          }),
          1
        );
      }
    });

    // Chapitres pour Découverte du monde (id: 3)
    const worldChapters = [
      { subject_id: 3, name: 'Les animaux', description: 'Découvrir les animaux de la ferme' },
      { subject_id: 3, name: 'Les saisons', description: 'Comprendre les 4 saisons' }
    ];

    worldChapters.forEach((chapter, index) => {
      const result = db.prepare('INSERT INTO chapters (subject_id, name, description, order_index) VALUES (?, ?, ?, ?)').run(
        chapter.subject_id,
        chapter.name,
        chapter.description,
        index
      );

      // Exercices pour "Les animaux"
      if (index === 0) {
        db.prepare('INSERT INTO exercises (chapter_id, title, type, difficulty, content, order_index) VALUES (?, ?, ?, ?, ?, ?)').run(
          result.lastInsertRowid,
          'Reconnaître les animaux de la ferme',
          'multiple-choice',
          1,
          JSON.stringify({
            question: 'Quel animal fait "Meuh" ?',
            options: ['Le chat', 'La vache', 'Le chien', 'Le mouton'],
            correct: 1
          }),
          0
        );
      }
    });

    console.log('✅ Données de démonstration initialisées !');
  }
};

// Initialiser la base de données
initDatabase();

console.log(`💾 Base de données initialisée: ${dbPath}`);

module.exports = db;
