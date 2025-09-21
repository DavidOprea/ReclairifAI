import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './MatchGame.css';

//import sfx
import selectSoundFile from '../assets/sounds/select.mp3';
import correctSoundFile from '../assets/sounds/correct.mp3';
import incorrectSoundFile from '../assets/sounds/incorrect.mp3';
import finishedSoundFile from '../assets/sounds/finished.mp3';
import confettiSoundFile from '../assets/sounds/confetti.mp3';

const selectSound = new Audio(selectSoundFile);
const correctSound = new Audio(correctSoundFile);
const incorrectSound = new Audio(incorrectSoundFile);
const finishedSound = new Audio(finishedSoundFile);
const confettiSound = new Audio(confettiSoundFile);

const MatchGame = () => {
  const { deckId } = useParams(); //get deck id from url
  const location = useLocation(); //get location to access passed state
  const navigate = useNavigate();
  
  //get the deck data passed from DeckSelection
  const deckFromState = location.state?.deck;
  
  //if no deck was passed, try to get it from localStorage
  const getDeckFromStorage = () => {
    try {
      const savedDecks = localStorage.getItem('vocabularyDecks');
      if (savedDecks) {
        const decks = JSON.parse(savedDecks);
        return decks.find(deck => deck.id === parseInt(deckId)) || null;
      }
    } catch (error) {
      console.error('Error loading deck from storage:', error);
    }
    return null;
  };

  const currentDeck = deckFromState || getDeckFromStorage();

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

  //add a back button handler
  const handleBack = () => {
    navigate('/decks'); //go back to deck selection
  };

  //get a random subset of vocabulary items (5-10 items)
  const getRandomVocabularySubset = (vocabulary) => {
    return vocabulary; // always return all items
  };

  //convert deck data to pairs format
  const convertDeckToPairs = (vocabulary) => {
    return vocabulary.map(item => ({
      word1: item.word,
      word2: item.definition
    }));
  };

  useEffect(() => {
    if (!isInitialized && currentDeck) {
      //get random subset of vocabulary
      const randomVocabulary = getRandomVocabularySubset(currentDeck.vocabulary);
      const pairs = convertDeckToPairs(randomVocabulary);
      initializeGame(pairs);
      setIsInitialized(true);
    }

    //load mute setting from localStorage
    const savedMuteSetting = localStorage.getItem('matchGameMuted');
    if (savedMuteSetting !== null) {
      setIsMuted(savedMuteSetting === 'true');
    }
  }, [currentDeck, isInitialized]);

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
      //right click to deselect
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
      //correct match!
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
      
      //check if game is completed
      if (newMatchedPairs.length === cards.length) {
        const finalTime = (Date.now() - startTime) / 1000;
        setIsRunning(false);
        
        //check for new session best time
        const isNewBest = sessionBestTime === null || finalTime < sessionBestTime;
        
        if (isNewBest) {
          setSessionBestTime(finalTime);
          setShowConfetti(true);
          
          //play sounds in sequence
          playSound(finishedSound);
          finishedSound.onended = () => {
            playSound(confettiSound);
            //keep confetti visible for 5 seconds
            setTimeout(() => setShowConfetti(false), 5000);
          };
        } else {
          playSound(finishedSound);
        }
        
        setGameCompleted(true);
      }
    } else {
      //incorrect match
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
    navigate('/'); //navigate to home page
  };

  const handleNewGame = () => {
    if (currentDeck) {
      const maxPairs = 12; // limit to 12 pairs
      let vocabularyToUse = currentDeck.vocabulary;

      // pick random 12 if needed
      if (vocabularyToUse.length > maxPairs) {
        vocabularyToUse = [...vocabularyToUse].sort(() => Math.random() - 0.5).slice(0, maxPairs);
      }

      const pairs = convertDeckToPairs(vocabularyToUse);
      initializeGame(pairs);
    }
  };

  //show loading state if deck is not available
  if (!currentDeck) {
    return (
      <div className="match-game">
        <div className="top-controls">
          <button className="back-button" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
            &nbsp;
          </button>
        </div>
        <div className="loading-message">
          <h2>Loading deck...</h2>
          <p>If this takes too long, the deck may not exist.</p>
          <button onClick={handleBack} className="back-button">
            Go Back to Deck Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="match-game" ref={gameRef}>
      {/*Confetti Effect*/}
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

      {/*Top Controls*/}
      <div className="top-controls">
        <button className="back-button" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i>
          &nbsp;
        </button>
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
      
      {/*Completion Message*/}
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

      {/*Cards Grid*/}
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