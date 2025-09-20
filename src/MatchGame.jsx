import React, { useState, useEffect } from 'react';
import './MatchGame.css';

const MatchGame = () => {
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
  const [isChecking, setIsChecking] = useState(false);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    initializeGame(defaultPairs);
  }, []);

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
  }, []);

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
    setIsChecking(false);
  };

  const handleCardClick = (cardId) => {
    if (!isRunning || isChecking || matchedPairs.includes(cardId) || selectedCards.includes(cardId)) {
      return;
    }

    if (selectedCards.length >= 2) {
      return;
    }

    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      setIsChecking(true);
      setTimeout(() => {
        checkForMatch(newSelectedCards);
        setIsChecking(false);
      }, 500);
    }
  };

  const checkForMatch = (cardIds) => {
    const [firstId, secondId] = cardIds;
    const firstCard = cards.find(card => card.id === firstId);
    const secondCard = cards.find(card => card.id === secondId);

    if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
      setMatchedPairs([...matchedPairs, firstId, secondId]);
      
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === firstId || card.id === secondId 
            ? { ...card, matched: true }
            : card
        )
      );
      
      setSelectedCards([]);
      
      if (matchedPairs.length + 2 === cards.length) {
        setIsRunning(false);
        setGameCompleted(true);
      }
    } else {
      setTimeout(() => {
        setSelectedCards([]);
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    return seconds.toFixed(2);
  };

  const isCardSelected = (cardId) => selectedCards.includes(cardId);
  const isCardMatched = (cardId) => matchedPairs.includes(cardId);

  return (
    <div className="match-game">
      {/* Top Controls */}
      <div className="top-controls">
        <div className="menu-icon">
          <span>☰</span>
        </div>
        <div className="timer-display">
          {formatTime(time)}s
        </div>
        <button 
          onClick={() => initializeGame(defaultPairs)} 
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
            <p>Time: {formatTime(time)} seconds</p>
            <button 
              onClick={() => initializeGame(defaultPairs)}
              className="play-again-btn"
            >
              Play Again
            </button>
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