// Script pour ajouter des exercices de carte interactive
// À exécuter une seule fois pour créer les exercices

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'ecole-cp.db');
const db = new Database(dbPath);

console.log('🗺️  Ajout des exercices de carte interactive...');

// Trouver le chapitre "Les saisons" dans "Découverte du monde"
const chapter = db.prepare(`
  SELECT c.id, c.name, s.name as subject_name 
  FROM chapters c 
  JOIN subjects s ON c.subject_id = s.id 
  WHERE s.name = 'Découverte du monde' 
  AND c.name = 'Les saisons'
`).get();

if (!chapter) {
  console.log('❌ Chapitre "Les saisons" non trouvé. Création d\'un nouveau chapitre...');
  
  // Trouver la matière "Découverte du monde"
  const subject = db.prepare('SELECT id FROM subjects WHERE name = ?').get('Découverte du monde');
  
  if (!subject) {
    console.log('❌ Matière "Découverte du monde" non trouvée !');
    process.exit(1);
  }

  // Créer un nouveau chapitre "La France"
  const result = db.prepare(
    'INSERT INTO chapters (subject_id, name, description, order_index) VALUES (?, ?, ?, ?)'
  ).run(subject.id, 'La France', 'Découvrir les régions de France', 2);
  
  var chapterId = result.lastInsertRowid;
  console.log(`✅ Chapitre "La France" créé (ID: ${chapterId})`);
} else {
  var chapterId = chapter.id;
  console.log(`✅ Utilisation du chapitre: ${chapter.name} (ID: ${chapterId})`);
}

// Exercices de carte interactive
const mapExercises = [
  {
    title: 'Où se trouve la Bretagne ?',
    difficulty: 1,
    content: {
      question: 'Clique sur la région Bretagne sur la carte de France',
      correctRegion: 'Bretagne',
      hint: 'La Bretagne est à l\'ouest de la France, près de l\'océan Atlantique'
    }
  },
  {
    title: 'Trouve Paris !',
    difficulty: 1,
    content: {
      question: 'Clique sur la région où se trouve Paris (cherche l\'étoile ⭐)',
      correctRegion: 'Île-de-France',
      hint: 'Paris est la capitale de la France, au centre-nord du pays'
    }
  },
  {
    title: 'La région du Sud',
    difficulty: 2,
    content: {
      question: 'Clique sur la Provence, au sud de la France',
      correctRegion: 'Provence',
      hint: 'La Provence est au sud-est, près de la mer Méditerranée'
    }
  },
  {
    title: 'Où sont les châteaux de la Loire ?',
    difficulty: 2,
    content: {
      question: 'Trouve les Pays de la Loire',
      correctRegion: 'Pays de la Loire',
      hint: 'Cette région est à l\'ouest, près de l\'Atlantique'
    }
  },
  {
    title: 'La région du Mont Blanc',
    difficulty: 3,
    content: {
      question: 'Trouve la région Auvergne-Rhône-Alpes (appelée ici "Auvergne")',
      correctRegion: 'Auvergne',
      hint: 'C\'est au centre-est de la France, dans les montagnes'
    }
  }
];

let addedCount = 0;

mapExercises.forEach((exercise, index) => {
  try {
    db.prepare(
      'INSERT INTO exercises (chapter_id, title, type, difficulty, content, order_index) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      chapterId,
      exercise.title,
      'map-interactive',
      exercise.difficulty,
      JSON.stringify(exercise.content),
      index + 10 // Commencer à 10 pour ne pas écraser les exercices existants
    );
    
    console.log(`✅ Exercice ajouté: ${exercise.title}`);
    addedCount++;
  } catch (error) {
    console.error(`❌ Erreur pour "${exercise.title}":`, error.message);
  }
});

console.log('');
console.log('═══════════════════════════════════════');
console.log(`✨ ${addedCount} exercice(s) de carte ajouté(s) !`);
console.log('═══════════════════════════════════════');
console.log('');
console.log('🎯 Prochaines étapes:');
console.log('1. Redéployez le backend sur Render');
console.log('2. Mettez à jour le frontend avec le composant MapExercise');
console.log('3. Testez les nouveaux exercices !');

db.close();
