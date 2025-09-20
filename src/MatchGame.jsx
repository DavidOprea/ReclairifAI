import React, { useState, useEffect, useRef } from 'react';
import './MatchGame.css';

// Import sound effects (make sure these files are in public/sounds/)
const selectSound = new Audio('/sounds/select.mp3');
const correctSound = new Audio('/sounds/correct.mp3');
const incorrectSound = new Audio('/sounds/incorrect.mp3');

const MatchGame = ({ importedPairs = null }) => {
  const defaultPairs = [
    { word1: 'Sex hormone glands', word2: 'Gonad' },
    { word1: 'Brain areas involved in sleep', word2: 'Pons, pituitary gland, pineal gland, thalamus, hypothalamus, SCN' },
    { word1: 'Stimulants', word2: 'Boosts dopamine, increases alertness examples: Cocaine, Amphetamine, MDMA' },
    { word1: 'Ivan Pavlov & Classical Conditioning', word2: 'An individual learns to associate two stimuli which leads to a learned automatic response' },
    { word1: 'Client Centered Therapy', word2: 'Listen to clients and make sure they are not judged' },
    { word1: 'Theories', word2: 'Ideas that propose an explanation for observed phenomena' }
  ];

  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [bestTime, setBestTime] = useState(Infinity);
  const [isInitialized, setIsInitialized] = useState(false);
  const gameRef = useRef(null);

  // Load imported pairs or use default
  const pairsToUse = importedPairs || defaultPairs;

  useEffect(() => {
    if (!isInitialized) {
      initializeGame(pairsToUse);
      setIsInitialized(true);
    }
    
    // Load best time from localStorage
    const savedBestTime = localStorage.getItem('matchGameBestTime');
    if (savedBestTime) {
      setBestTime(parseFloat(savedBestTime));
    }
  }, [pairsToUse, isInitialized]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((Date.now() - startTime) / 1000);
      }, 10);
    }
    return () => clearInterval(timer);
  }, [isRunning, startTime]);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      // Right click to deselect
      if (selectedCards.length > 0) {
        setSelectedCards([]);
      }
    };

    const handleSelection = (e) => {
      if (e.target.closest('.card')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelection);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelection);
    };
  }, [selectedCards]);

  const initializeGame = (pairs) => {
    const allCards = [];
    
    pairs.forEach((pair, index) => {
      allCards.push({
        id: `card-${index}-1`,
        content: pair.word1,
        pairId: index,
        matched: false
      });
      
      allCards.push({
        id: `card-${index}-2`,
        content: pair.word2,
        pairId: index,
        matched: false
      });
    });

    const shuffledCards = allCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setSelectedCards([]);
    setMatchedPairs([]);
    setTime(0);
    setStartTime(Date.now());
    setIsRunning(true);
    setGameCompleted(false);
  };

  const handleCardClick = (cardId) => {
    if (!isRunning || matchedPairs.includes(cardId) || selectedCards.includes(cardId)) {
      return;
    }

    if (selectedCards.length >= 2) {
      return;
    }

    // Play select sound
    selectSound.currentTime = 0;
    selectSound.play().catch(() => {}); // Ignore errors if audio fails

    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      checkForMatch(newSelectedCards);
    }
  };

  const checkForMatch = (cardIds) => {
    const [firstId, secondId] = cardIds;
    const firstCard = cards.find(card => card.id === firstId);
    const secondCard = cards.find(card => card.id === secondId);

    if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
      // Correct match
      correctSound.currentTime = 0;
      correctSound.play().catch(() => {});
      
      setMatchedPairs(prev => [...prev, firstId, secondId]);
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === firstId || card.id === secondId 
            ? { ...card, matched: true }
            : card
        )
      );
      
      setSelectedCards([]);
      
      // Check if game is completed
      if (matchedPairs.length + 2 === cards.length) {
        setIsRunning(false);
        setGameCompleted(true);
        // Save best time
        const finalTime = (Date.now() - startTime) / 1000;
        if (finalTime < bestTime) {
          setBestTime(finalTime);
          localStorage.setItem('matchGameBestTime', finalTime.toString());
        }
      }
    } else {
      // Incorrect match
      incorrectSound.currentTime = 0;
      incorrectSound.play().catch(() => {});
      
      setTimeout(() => {
        setSelectedCards([]);
      }, 300); // Short delay for visual feedback
    }
  };

  const formatTime = (seconds) => {
    return seconds.toFixed(2);
  };

  const isCardSelected = (cardId) => selectedCards.includes(cardId);
  const isCardMatched = (cardId) => matchedPairs.includes(cardId);

  const handleMainMenu = () => {
    // This would navigate to main menu - functionality to be implemented
    console.log("Going to main menu");
  };

  const handleNewGame = () => {
    initializeGame(pairsToUse);
  };

  return (
    <div className="match-game" ref={gameRef}>
      {/* Top Controls */}
      <div className="top-controls">
        <div className="menu-icon" onClick={handleMainMenu}>
          <span>☰</span>
        </div>
        <div className="timer-display">
          {formatTime(time)}s
        </div>
        <button 
          onClick={handleNewGame} 
          className="new-game-btn"
        >
          New Game
        </button>
      </div>

      {/* Completion Message */}
      {gameCompleted && (
        <div className="completion-message">
          <div className="completion-content">
            <h2>Game Completed!</h2>
            <p className="final-time">Time: {formatTime(time)} seconds</p>
            {bestTime < Infinity && (
              <p className="best-time">Best Time: {formatTime(bestTime)} seconds</p>
            )}
            <div className="completion-buttons">
              <button 
                onClick={handleNewGame}
                className="play-again-btn"
              >
                Play Again
              </button>
              <button 
                onClick={handleMainMenu}
                className="main-menu-btn"
              >
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid - Fixed 4x3 layout */}
      <div className="cards-container">
        <div className="cards-grid">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card ${isCardSelected(card.id) ? 'selected' : ''} ${
                isCardMatched(card.id) ? 'matched' : ''
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="card-content">
                {card.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchGame;