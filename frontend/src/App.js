import React, { useState, useEffect } from 'react';
import './App.css';
import MapExercise from './MapExercise';

// Configuration de l'API - Change automatiquement selon l'environnement
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '' });
  const [isGuest, setIsGuest] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    if (token) {
      fetchUser();
    }
    fetchSubjects();
  }, [token]);

  // Fonctions API
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ username: 'Utilisateur' }); // Simplifié
      } else {
        logout();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${API_URL}/subjects`);
      const data = await res.json();
      setSubjects(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchSubjectDetails = async (id) => {
    try {
      const res = await fetch(`${API_URL}/subjects/${id}`);
      const data = await res.json();
      setSelectedSubject(data);
      setCurrentView('subject');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchChapterDetails = async (id) => {
    try {
      const res = await fetch(`${API_URL}/chapters/${id}`);
      const data = await res.json();
      setSelectedChapter(data);
      setCurrentView('chapter');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchExerciseDetails = async (id) => {
    try {
      const res = await fetch(`${API_URL}/exercises/${id}`);
      const data = await res.json();
      setSelectedExercise(data);
      setFeedback(null);
      setAnswer('');
      setCurrentView('exercise');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const submitAnswer = async () => {
    if (!selectedExercise) return;

    try {
      const res = await fetch(`${API_URL}/exercises/${selectedExercise.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          answer: selectedExercise.type === 'multiple-choice' ? parseInt(answer) : answer,
          isGuest: isGuest
        })
      });

      const data = await res.json();
      setFeedback(data);

      if (data.correct) {
        setTimeout(() => {
          setFeedback(null);
          setAnswer('');
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setCurrentView('home');
        setLoginForm({ username: '', password: '' });
      } else {
        alert(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setCurrentView('home');
        setRegisterForm({ username: '', password: '' });
      } else {
        alert(data.error || 'Erreur d\'inscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur d\'inscription');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setCurrentView('home');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setCurrentView('home');
  };

  const fetchProgress = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProgress(data);
      setCurrentView('progress');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Vue d'authentification
  if (!user && !isGuest) {
    return (
      <div className="app">
        <div className="auth-container">
          <div className="auth-header">
            <h1>🎓 École CP</h1>
            <p>Apprendre en s'amusant !</p>
          </div>

          <div className="auth-tabs">
            <button
              className={currentView === 'login' ? 'active' : ''}
              onClick={() => setCurrentView('login')}
            >
              Connexion
            </button>
            <button
              className={currentView === 'register' ? 'active' : ''}
              onClick={() => setCurrentView('register')}
            >
              Inscription
            </button>
          </div>

          {currentView === 'login' ? (
            <form onSubmit={login} className="auth-form">
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
              <button type="submit">Se connecter</button>
            </form>
          ) : (
            <form onSubmit={register} className="auth-form">
              <input
                type="text"
                placeholder="Nom d'utilisateur (min. 3 caractères)"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                required
                minLength="3"
              />
              <input
                type="password"
                placeholder="Mot de passe (min. 6 caractères)"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
                minLength="6"
              />
              <button type="submit">S'inscrire</button>
            </form>
          )}

          <button onClick={continueAsGuest} className="guest-button">
            Continuer en tant qu'invité
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 École CP</h1>
        <nav>
          <button onClick={() => setCurrentView('home')}>Accueil</button>
          {user && (
            <>
              <button onClick={fetchProgress}>Ma progression</button>
              <button onClick={logout}>Déconnexion</button>
            </>
          )}
          {isGuest && (
            <button onClick={() => { setIsGuest(false); setCurrentView('login'); }}>
              Se connecter
            </button>
          )}
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'home' && (
          <div className="subjects-grid">
            <h2>Choisissez une matière</h2>
            <div className="grid">
              {subjects.map(subject => (
                <div
                  key={subject.id}
                  className="subject-card"
                  style={{ borderColor: subject.color }}
                  onClick={() => fetchSubjectDetails(subject.id)}
                >
                  <div className="subject-icon" style={{ backgroundColor: subject.color }}>
                    {subject.icon}
                  </div>
                  <h3>{subject.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'subject' && selectedSubject && (
          <div className="chapters-list">
            <button className="back-button" onClick={() => setCurrentView('home')}>
              ← Retour aux matières
            </button>
            <h2>{selectedSubject.icon} {selectedSubject.name}</h2>
            <div className="chapters">
              {selectedSubject.chapters.map(chapter => (
                <div
                  key={chapter.id}
                  className="chapter-card"
                  onClick={() => fetchChapterDetails(chapter.id)}
                >
                  <h3>{chapter.name}</h3>
                  <p>{chapter.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'chapter' && selectedChapter && (
          <div className="exercises-list">
            <button className="back-button" onClick={() => fetchSubjectDetails(selectedChapter.subject_id || 1)}>
              ← Retour aux chapitres
            </button>
            <h2>{selectedChapter.name}</h2>
            <p>{selectedChapter.description}</p>
            <div className="exercises">
              {selectedChapter.exercises.map(exercise => (
                <div
                  key={exercise.id}
                  className="exercise-card"
                  onClick={() => fetchExerciseDetails(exercise.id)}
                >
                  <h3>{exercise.title}</h3>
                  <span className={`difficulty difficulty-${exercise.difficulty}`}>
                    {'⭐'.repeat(exercise.difficulty)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'exercise' && selectedExercise && (
          <div className="exercise-view">
            <button className="back-button" onClick={() => fetchChapterDetails(selectedExercise.chapter_id)}>
              ← Retour aux exercices
            </button>
            
            {/* Carte interactive */}
            {selectedExercise.type === 'map-interactive' ? (
              <MapExercise 
                exercise={selectedExercise}
                onSubmit={(answer, isCorrect) => {
                  setAnswer(answer);
                  submitAnswer();
                }}
              />
            ) : (
              /* Exercices traditionnels */
              <div className="exercise-content">
                <h2>{selectedExercise.title}</h2>
                <div className="question">
                  <p>{selectedExercise.content.question}</p>
                  {selectedExercise.content.text && (
                    <div className="exercise-text">{selectedExercise.content.text}</div>
                  )}
                  {selectedExercise.content.image && (
                    <div className="exercise-image">{selectedExercise.content.image}</div>
                  )}
                </div>

                {selectedExercise.type === 'multiple-choice' && (
                  <div className="options">
                    {selectedExercise.content.options.map((option, index) => (
                      <button
                        key={index}
                        className={`option ${answer === index.toString() ? 'selected' : ''}`}
                        onClick={() => setAnswer(index.toString())}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {['fill-blank', 'math', 'count'].includes(selectedExercise.type) && (
                  <input
                    type="text"
                    className="answer-input"
                    placeholder="Votre réponse..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                  />
                )}

                <button
                  className="submit-button"
                  onClick={submitAnswer}
                  disabled={!answer}
                >
                  Valider
                </button>

                {feedback && (
                  <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
                    {feedback.correct ? '✅ Bravo ! Bonne réponse !' : '❌ Essaie encore !'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentView === 'progress' && (
          <div className="progress-view">
            <button className="back-button" onClick={() => setCurrentView('home')}>
              ← Retour à l'accueil
            </button>
            <h2>Ma progression</h2>
            {progress.length === 0 ? (
              <p>Commence des exercices pour voir ta progression !</p>
            ) : (
              <div className="progress-list">
                {progress.map(item => (
                  <div key={item.id} className="progress-item">
                    <h3>{item.exercise_title}</h3>
                    <p>{item.subject_name} - {item.chapter_name}</p>
                    <div className="progress-stats">
                      <span>Score: {item.score}%</span>
                      <span>Tentatives: {item.attempts}</span>
                      <span className={item.completed ? 'completed' : 'incomplete'}>
                        {item.completed ? '✅ Complété' : '⏳ En cours'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
