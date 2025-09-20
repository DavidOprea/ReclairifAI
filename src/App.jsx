import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import DeckSelection from './components/DeckSelection'
import MatchGame from './components/MatchGame' // Import MatchGame directly
import VocabularyInput from './components/VocabularyInput'
import './App.css'

function App() {
  return (
    <div className="app" style={{ minHeight: '100vh', overflow: 'auto' }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/decks" element={<DeckSelection />} />
        <Route path="/match/:deckId" element={<MatchGame />} /> {/* Direct to MatchGame */}
        <Route path="/create" element={<VocabularyInput />} />
      </Routes>
    </div>
  )
}

export default App