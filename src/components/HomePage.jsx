import { useNavigate } from 'react-router-dom'
import HelpButton from './HelpButton'

function HomePage() {
  const navigate = useNavigate()

  const handleMatchClick = () => {
    navigate('/decks')
  }

  const handleCreateClick = () => {
    navigate('/create') // Navigate to VocabularyInput page
  }

  return (
    <div className="app-container">
      <div className="help-button-container">
        <HelpButton />
      </div>

      <div className="main-content">
        <h1 className="title">ReclarifAI</h1>
        <p className="subtitle">Create, match, and learn new vocabulary words with ease</p>
        
        <div className="logo-container">
          <img 
            src="https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
            alt="App Logo"
            className="app-logo"
          />
        </div>
        
        <div className="button-group">
          <button className="main-button create" onClick={handleCreateClick}>
            <i className="fas fa-plus-circle"></i>
            Create New Deck
          </button>
          <button className="main-button match" onClick={handleMatchClick}>
            <i className="fas fa-link"></i>
            Match With Deck
          </button>
        </div>
        
        <div className="features">
          <div className="feature">
            <i className="fas fa-shield-alt"></i>
            <span>Create</span>
          </div>
          <div className="feature">
            <i className="fas fa-bolt"></i>
            <span>Match</span>
          </div>
          <div className="feature">
            <i className="fas fa-cloud"></i>
            <span>Learn</span>
          </div>
        </div>
      </div>
      
      <footer>
        &copy; 2025 Rogue Cite • v1.0.0
      </footer>
    </div>
  )
}

export default HomePage