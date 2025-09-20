import { useParams, useNavigate } from 'react-router-dom'
import HelpButton from './HelpButton'

function GamePage() {
  const { deckId } = useParams()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/decks')
  }

  return (
    <div className="app-container">
      <div className="help-button-container">
        <HelpButton />
      </div>

      <div className="main-content">
        <div className="deck-selection-header">
          <button className="back-button" onClick={handleBack}>
            <i className="fas fa-arrow-left"></i>
            Back to Decks
          </button>
          <h2 className="title">Game Session</h2>
          <div style={{width: "100px"}}></div>
        </div>
        
        <div className="game-content">
          <p>Playing with deck ID: {deckId}</p>
          {/* Your game content will go here */}
        </div>
      </div>
    </div>
  )
}

export default GamePage