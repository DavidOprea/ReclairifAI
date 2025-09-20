import { useNavigate } from 'react-router-dom'
import HelpButton from './HelpButton'

function DeckSelection() {
  const navigate = useNavigate()
  const decks = [
    { id: 1, name: "Spanish Vocabulary", cardCount: 42 },
    { id: 2, name: "Biology Terms", cardCount: 28 },
    { id: 3, name: "History Dates", cardCount: 35 },
    { id: 4, name: "Math Formulas", cardCount: 19 },
  ]

  const handleDeckSelect = (deck) => {
    navigate(`/match/${deck.id}`)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="app-container">

      <div className="main-content">
        <div className="deck-selection-header">
          <button className="back-button" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <h2 className="title">Your Flashcard Decks</h2>
          <div style={{width: "100px"}}></div>
        </div>
        
        <div className="decks-list">
          {decks.map(deck => (
            <button
              key={deck.id}
              className="deck-button"
              onClick={() => handleDeckSelect(deck)}
            >
              <span className="deck-name">{deck.name}</span>
              <span className="deck-cards">{deck.cardCount} cards</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DeckSelection