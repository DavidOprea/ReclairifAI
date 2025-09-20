import React, { useState, useEffect, useRef } from 'react';
import './MatchGame.css';

// Import sound effects
const selectSound = new Audio('/sounds/select.mp3');
const correctSound = new Audio('/sounds/correct.mp3');
const incorrectSound = new Audio('/sounds/incorrect.mp3');
const finishedSound = new Audio('/sounds/finished.mp3');
const confettiSound = new Audio('/sounds/confetti.mp3');

const MatchGame = ({ importedJson = null }) => {
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
  const [sessionBestTime, setSessionBestTime] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const gameRef = useRef(null);

  // Convert JSON format to pairs format
  const convertJsonToPairs = (jsonData) => {
    return jsonData.map(item => ({
      word1: item.word,
      word2: item.definition
    }));
  };

  // Get pairs to use - either from imported JSON or default
  const getPairsToUse = () => {
    if (importedJson) {
      return convertJsonToPairs(importedJson);
    }
    return defaultPairs;
  };

  const pairsToUse = getPairsToUse();

  useEffect(() => {
    if (!isInitialized) {
      initializeGame(pairsToUse);
      setIsInitialized(true);
    }

    // Load mute setting from localStorage
    const savedMuteSetting = localStorage.getItem('matchGameMuted');
    if (savedMuteSetting !== null) {
      setIsMuted(savedMuteSetting === 'true');
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

  const playSound = (sound) => {
    if (!isMuted) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('matchGameMuted', newMutedState.toString());
  };

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
    setShowConfetti(false);
  };

  const handleCardClick = (cardId) => {
    if (!isRunning || matchedPairs.includes(cardId) || selectedCards.includes(cardId)) {
      return;
    }

    if (selectedCards.length >= 2) {
      return;
    }

    playSound(selectSound);

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
      playSound(correctSound);
      
      const newMatchedPairs = [...matchedPairs, firstId, secondId];
      setMatchedPairs(newMatchedPairs);
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === firstId || card.id === secondId 
            ? { ...card, matched: true }
            : card
        )
      );
      
      setSelectedCards([]);
      
      // Check if game is completed
      if (newMatchedPairs.length === cards.length) {
        const finalTime = (Date.now() - startTime) / 1000;
        setIsRunning(false);
        
        // Check for new session best time
        const isNewBest = sessionBestTime === null || finalTime < sessionBestTime;
        
        if (isNewBest) {
          setSessionBestTime(finalTime);
          setShowConfetti(true);
          
          // Play sounds in sequence
          playSound(finishedSound);
          finishedSound.onended = () => {
            playSound(confettiSound);
            // Keep confetti visible for 5 seconds
            setTimeout(() => setShowConfetti(false), 5000);
          };
        } else {
          playSound(finishedSound);
        }
        
        setGameCompleted(true);
      }
    } else {
      // Incorrect match
      playSound(incorrectSound);
      
      setTimeout(() => {
        setSelectedCards([]);
      }, 300);
    }
  };

  const formatTime = (seconds) => {
    return seconds.toFixed(2);
  };

  const isCardSelected = (cardId) => selectedCards.includes(cardId);
  const isCardMatched = (cardId) => matchedPairs.includes(cardId);

  const handleMainMenu = () => {
    console.log("Going to main menu");
  };

  const handleNewGame = () => {
    initializeGame(pairsToUse);
  };

  return (
    <div className="match-game" ref={gameRef}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: `hsl(${Math.random() * 720}, 100%, 100%)`
              }}
            />
          ))}
        </div>
      )}

      {/* Top Controls */}
      <div className="top-controls">
        <div className="menu-icon" onClick={handleMainMenu}>
          <span>☰</span>
        </div>
        <div className="timer-display">
          {formatTime(time)}s
        </div>
        <div className="right-controls">
          <button onClick={toggleMute} className="mute-btn">
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button onClick={handleNewGame} className="new-game-btn">
            New Game
          </button>
        </div>
      </div>

      {/* Completion Message */}
      {gameCompleted && (
        <div className="completion-message">
          <div className="completion-content">
            <h2>Game Completed!</h2>
            <p className="final-time">Time: {formatTime(time)} seconds</p>
            {sessionBestTime !== null && (
              <p className="best-time">Session Best: {formatTime(sessionBestTime)} seconds</p>
            )}
            {showConfetti && <p className="new-best">🎉 New Session Best! 🎉</p>}
            <div className="completion-buttons">
              <button onClick={handleNewGame} className="play-again-btn">
                Play Again
              </button>
              <button onClick={handleMainMenu} className="main-menu-btn">
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
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