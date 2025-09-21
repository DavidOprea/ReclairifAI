import { useNavigate } from 'react-router-dom'
import HelpButton from './HelpButton'
import { useEffect, useState } from 'react'

function DeckSelection() {
  const navigate = useNavigate()
  const [decks, setDecks] = useState([])

  useEffect(() => {
    const savedDecks = localStorage.getItem('vocabularyDecks')
    if (savedDecks) {
      try {
        const parsedDecks = JSON.parse(savedDecks)
        setDecks(parsedDecks)
      } catch (error) {
        console.error('Error parsing saved decks:', error)
        setDecks([])
      }
    }
  }, [])

  const handleDeckSelect = (deck) => {
    navigate(`/match/${deck.id}`)
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleDeleteDeck = (deckId, event) => {
    event.stopPropagation() // Prevent triggering the deck selection
    if (window.confirm('Are you sure you want to delete this deck?')) {
      const updatedDecks = decks.filter(deck => deck.id !== deckId)
      setDecks(updatedDecks)
      localStorage.setItem('vocabularyDecks', JSON.stringify(updatedDecks))
    }
  }

if (decks.length === 0) {
    return (
      <div className="app-container">
        <div className="main-content">
          <div className="deck-selection-header">
            <button className="back-button" onClick={handleBack}>
              <i className="fas fa-arrow-left"></i>
              &nbsp; Back
            </button>
            <h2 className="title">Your Flashcard Decks</h2>
            <div style={{width: "100px"}}></div>
          </div>
          
          <div className="no-decks-message">
            <p>No decks found. Please create some decks first!</p>
            <button className="back-button" onClick={handleBack}>
              <i className="fas fa-arrow-left"></i>
              &nbsp; Back to Creator
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="deck-selection-header">
          <button className="back-button" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
            &nbsp; Back
          </button>
          <h2 className="title">Your Flashcard Decks</h2>
          <div style={{width: "100px"}}></div>
        </div>
        
        <div className="decks-list">
          {decks.map(deck => (
            <div key={deck.id} className="deck-row">
              <button
                className="deck-button"
                onClick={() => handleDeckSelect(deck)}
              >
                <span className="deck-name">{deck.name}</span>
                <span className="deck-cards">{deck.vocabulary?.length || 0} cards</span>
              </button>
              <button
                className="delete-deck-button"
                onClick={(e) => handleDeleteDeck(deck.id, e)}
                title="Delete deck"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DeckSelection