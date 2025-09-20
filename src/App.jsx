import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import DeckSelection from './components/DeckSelection'
import GamePage from './components/GamePage'
import VocabularyInput from './components/VocabularyInput'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/decks" element={<DeckSelection />} />
        <Route path="/match/:deckId" element={<GamePage />} />
        <Route path="/create" element={<VocabularyInput />} />
      </Routes>
    </div>
  )
}

export default App