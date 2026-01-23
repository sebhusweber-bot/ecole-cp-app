import React, { useState } from 'react';
import './App.css';
import './MapExercise.css';

// Composant Carte de France Interactive
function MapExercise({ exercise, onSubmit }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName);
  };

  const handleSubmit = () => {
    if (!selectedRegion) return;
    
    const isCorrect = selectedRegion === exercise.content.correctRegion;
    setFeedback({
      correct: isCorrect,
      message: isCorrect 
        ? `✅ Bravo ! C'est bien ${exercise.content.correctRegion} !`
        : `❌ Non, ce n'est pas ${selectedRegion}. Essaie encore !`
    });

    if (onSubmit) {
      onSubmit(selectedRegion, isCorrect);
    }

    if (isCorrect) {
      setTimeout(() => {
        setFeedback(null);
        setSelectedRegion(null);
      }, 2000);
    }
  };

  // Carte simplifiée de France avec régions principales
  const regions = [
    { name: 'Bretagne', x: 80, y: 180, color: '#FF6B6B' },
    { name: 'Normandie', x: 120, y: 120, color: '#4ECDC4' },
    { name: 'Île-de-France', x: 200, y: 140, color: '#45B7D1' },
    { name: 'Grand Est', x: 300, y: 140, color: '#96CEB4' },
    { name: 'Provence', x: 320, y: 320, color: '#FFEAA7' },
    { name: 'Occitanie', x: 220, y: 340, color: '#DFE6E9' },
    { name: 'Nouvelle-Aquitaine', x: 140, y: 280, color: '#74B9FF' },
    { name: 'Auvergne', x: 220, y: 240, color: '#A29BFE' },
    { name: 'Bourgogne', x: 260, y: 180, color: '#FD79A8' },
    { name: 'Pays de la Loire', x: 120, y: 220, color: '#FDCB6E' }
  ];

  return (
    <div className="map-exercise">
      <h3>{exercise.title}</h3>
      <p className="question">{exercise.content.question}</p>

      <svg width="450" height="450" className="france-map">
        {/* Contour France simplifié */}
        <path
          d="M 100 100 L 350 80 L 380 200 L 360 350 L 280 380 L 180 390 L 100 360 L 60 280 L 70 180 Z"
          fill="#E8F5E9"
          stroke="#2C3E50"
          strokeWidth="2"
        />

        {/* Régions cliquables */}
        {regions.map((region) => (
          <g key={region.name}>
            <circle
              cx={region.x}
              cy={region.y}
              r="30"
              fill={selectedRegion === region.name ? '#2ECC71' : region.color}
              opacity="0.7"
              stroke="#2C3E50"
              strokeWidth="2"
              onClick={() => handleRegionClick(region.name)}
              className="region-circle"
              style={{ cursor: 'pointer' }}
            />
            <text
              x={region.x}
              y={region.y + 5}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill="#2C3E50"
              pointerEvents="none"
            >
              {region.name}
            </text>
          </g>
        ))}

        {/* Étoile pour Paris */}
        <text x="200" y="145" fontSize="20" fill="#FFD700">⭐</text>
      </svg>

      <div className="selection-info">
        {selectedRegion ? (
          <p>Vous avez sélectionné : <strong>{selectedRegion}</strong></p>
        ) : (
          <p>Cliquez sur une région de la carte</p>
        )}
      </div>

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={!selectedRegion}
      >
        Valider
      </button>

      {feedback && (
        <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
          {feedback.message}
        </div>
      )}

      {exercise.content.hint && !feedback && (
        <div className="hint">
          💡 Indice : {exercise.content.hint}
        </div>
      )}
    </div>
  );
}

export default MapExercise;
