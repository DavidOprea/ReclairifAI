import {useNavigate} from 'react-router-dom'
import HelpButton from './HelpButton'
import {useEffect, useState} from 'react'

function DeckSelection() {
  const navigate = useNavigate()
  const [decks, setDecks] = useState([])
  const [processingDeck, setProcessingDeck] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

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

  const processVocabularyWithAI = async (deck) => {
    setIsProcessing(true)
    setProcessingDeck(deck.id)
    
    try {
      //add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) //10s
      
      const response = await fetch('http://localhost:5000/api/process-vocabulary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vocabulary: deck.vocabulary,
          sessionId: `session_${Date.now()}`,
          deckId: deck.id
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const result = await response.json()
        console.log('AI processing result:', result)
        
        //store processed deck id
        localStorage.setItem('lastProcessedDeckId', result.deckId)
        
        //navigate to the game with the processed deck
        navigate(`/match/${deck.id}`, { 
          state: { 
            deck: {
              ...deck,
              vocabulary: deck.vocabulary.map(item => ({
                ...item,
                definition: result.reworded?.[item.word] || item.definition
              }))
            }
          } 
        })
      } else {
        console.error('AI processing failed:', response.status)
        //fallback: navigate without AI processing
        navigate(`/match/${deck.id}`, { state: { deck } })
      }
    } catch (error) {
      console.error('Error processing vocabulary:', error)
      //fallback: navigate without AI processing
      navigate(`/match/${deck.id}`, { state: { deck } })
    } finally {
      setIsProcessing(false)
      setProcessingDeck(null)
    }
  }

  const handleDeckSelect = async (deck) => {
    //check if we should use AI processing
    const useAIProcessing = true;
    
    if (useAIProcessing && deck.vocabulary && deck.vocabulary.length > 0) {
      await processVocabularyWithAI(deck)
    } else {
      //navigate directly without AI processing
      navigate(`/match/${deck.id}`, { state: { deck } })
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleDeleteDeck = (deckId, event) => {
    event.stopPropagation() //prevent triggering the deck selection
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
                disabled={isProcessing && processingDeck === deck.id}
              >
                <span className="deck-name">{deck.name}</span>
                <span className="deck-cards">{deck.vocabulary?.length || 0} cards</span>
                {isProcessing && processingDeck === deck.id && (
                  <span className="processing-indicator">&nbsp; 🔄 Processing with AI...</span>
                )}
              </button>
              <button
                className="delete-deck-button"
                onClick={(e) => handleDeleteDeck(deck.id, e)}
                title="Delete deck"
                disabled={isProcessing}
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