import {useNavigate} from 'react-router-dom'
import HelpButton from './HelpButton'

function HomePage() {
  const navigate = useNavigate()

  const handleMatchClick = () => {
    navigate('/decks')
  }

  const handleCreateClick = () => {
    navigate('/create') //nav to VocabularyInput page
  }

  return (
    <div className="app-container">
      <div className="help-button-container">
        <HelpButton />
      </div>

      <div className="main-content">
         <img 
            src="https://media.discordapp.net/attachments/1418721726623256640/1419113748651704350/ReclarifAI.png?ex=68d0942b&is=68cf42ab&hm=50626b3b7e2de1e85ac10a9b867a80d199cca7b52986146b2b6b9e496a4d02e7&=&format=webp&quality=lossless&width=1369&height=249" 
            alt="Title Logo"
            className="title-logo"
          />
        <p className="subtitle">Create, match, and learn new vocabulary words with ease</p>
        
        <div className="logo-container">
          <img 
            src="https://media.discordapp.net/attachments/1418721726623256640/1419113748974534770/Group_2.png?ex=68d0942b&is=68cf42ab&hm=1201f62b34b5c38de0e8ddc52f7041074737a3c1dd960cfdc7c5cefec76cc1ef&=&format=webp&quality=lossless&width=455&height=395" 
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
            <i className="fas fa-pen"></i>
            <span>Create</span>
          </div>
          <div className="feature">
            <i className="fas fa-bolt"></i>
            <span>Match</span>
          </div>
          <div className="feature">
            <i className="fas fa-brain"></i>
            <span>Learn</span>
          </div>
        </div>
      </div>
      
      <footer>
        ReclarifAI &copy; 2025 • v1.0.0
      </footer>
    </div>
  )
}

export default HomePage