import React, { useState, useEffect } from 'react';
import VocabularyForm from './VocabularyForm';
import VocabularyList from './VocabularyList';
import Notification from './Notification';
import { useNavigate } from 'react-router-dom';
import "./VocabularyInput.css";

const VocabularyInput = () => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [vocabularyList, setVocabularyList] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [notification, setNotification] = useState('');
  const [deckName, setDeckName] = useState('');
  const [decks, setDecks] = useState([]);
  
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };
  
  const handleInputChange = (field, value) => {
    if (field === 'word') setWord(value);
    if (field === 'definition') setDefinition(value);
  };
  
  const navigate = useNavigate();

  //add a back button handler
  const handleBack = () => {
    navigate(-1); //go back to previous page
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!word.trim() || !definition.trim()) {
      showNotification('Please enter both a word and a definition');
      return;
    }
    
    if (editIndex === -1) {
      //add new item
      setVocabularyList([...vocabularyList, { word, definition }]);
      showNotification('Vocabulary item added successfully!');
    } else {
      //update existing item
      const updatedList = [...vocabularyList];
      updatedList[editIndex] = { word, definition };
      setVocabularyList(updatedList);
      setEditIndex(-1);
      showNotification('Vocabulary item updated successfully!');
    }
    
    //reset form
    setWord('');
    setDefinition('');
  };
  
  const handleClearForm = () => {
    setWord('');
    setDefinition('');
    setEditIndex(-1);
  };
  
  const handleEdit = (index) => {
    setWord(vocabularyList[index].word);
    setDefinition(vocabularyList[index].definition);
    setEditIndex(index);
  };
  
  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this vocabulary item?')) {
      const updatedList = vocabularyList.filter((_, i) => i !== index);
      setVocabularyList(updatedList);
      
      if (editIndex === index) {
        handleClearForm();
      }
      
      showNotification('Vocabulary item deleted successfully!');
    }
  };
  
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all vocabulary items?')) {
      setVocabularyList([]);
      handleClearForm();
      showNotification('All vocabulary items cleared!');
    }
  };
  
  useEffect(() => {
    const savedDecks = localStorage.getItem('vocabularyDecks');
    if (savedDecks) {
        setDecks(JSON.parse(savedDecks));
    }
  }, []);

  const handleExport = () => {
    if (vocabularyList.length === 0) {
      showNotification('No vocabulary items to export!');
      return;
    }
    
    let name = deckName.trim();
    if (!name) {
      const date = new Date().toLocaleDateString();
      const firstWord = vocabularyList[0]?.word || 'vocabulary';
      name = firstWord + " - " + date;
    }

    const deck = {
      id: Date.now(),
      name: name,
      createdAt: new Date().toISOString(),
      vocabulary: [...vocabularyList]
    };

    const updatedDecks = [...decks, deck];
    setDecks(updatedDecks);

    //convert to JSON
    localStorage.setItem('vocabularyDecks', JSON.stringify(updatedDecks));

    showNotification(`Deck "${name}" exported successfully!`);
    setDeckName('');
  };

  const loadDeck = (deckId) => {
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
        setVocabularyList(deck.vocabulary);
        setEditIndex(-1);
        setWord('');
        setDefinition('');
        showNotification(`Loaded deck "${deck.name}"`);
    }};

    const deleteDeck = (deckId) => {
    if (window.confirm('Are you sure you want to delete this deck?')) {
        const updatedDecks = decks.filter(d => d.id !== deckId);
        setDecks(updatedDecks);
        localStorage.setItem('vocabularyDecks', JSON.stringify(updatedDecks));
        showNotification('Deck deleted successfully!');
    }};

    const clearAllDecks = () => {
    if (window.confirm('Are you sure you want to delete ALL decks? This cannot be undone.')) {
        setDecks([]);
        localStorage.removeItem('vocabularyDecks');
        showNotification('All decks cleared!');
    }};
  
  return (
    <div className="container">
      <Notification message={notification} />
      
      <header>
        <button onClick={handleBack} className="back-button">
          <i className="fas fa-arrow-left"></i>
          &nbsp;
        </button>
        <h1>Deck Creator</h1>
        <p className="subheading">Create your vocabulary list for enhanced matching</p>
      </header>
      
      <div className="app-content">
        <div className="instructions">
          <h3>How to use this tool</h3>
          <ul>
            <li>Enter a vocabulary word and its definition in the form below.</li>
            <li>Click "Add to List" to save the word to your vocabulary list.</li>
            <li>Edit or delete items using the action buttons.</li>
            <li>When your list is complete, click the export button!</li>
          </ul>
        </div>
        
        <VocabularyForm 
          word={word}
          definition={definition}
          onSubmit={handleSubmit}
          onClear={handleClearForm}
          isEditing={editIndex !== -1}
          onInputChange={handleInputChange}
        />

  <div className="deck-management">
    <h3>Save Your Deck</h3>
    <div className="deck-save-form">
        <div className="input-group">
            <label htmlFor="deckName">Deck Name (optional)</label>
            <input
                type="text"
                id="deckName"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="Enter a name for your deck"
            />
        </div>
        <button className="btn-primary" onClick={handleExport}>
            <i className="fas fa-save"></i> Save Deck
        </button>
      </div>
    </div>

        <div className="vocab-list">
          <h3>Your Vocabulary List ({vocabularyList.length} items)</h3>
          
          <VocabularyList 
            items={vocabularyList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClearAll={handleClearAll}
            onExport={handleExport}
          />
        </div>
      </div>
      {decks.length > 0 && (
    <div className="saved-decks">
        <h3>Your Saved Decks ({decks.length})</h3>
        <div className="decks-list">
            {decks.map(deck => (
                <div key={deck.id} className="deck-item">
                    <div className="deck-info">
                        <h4>{deck.name}</h4>
                        <p>{deck.vocabulary.length} terms • {new Date(deck.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="deck-actions">
                        <button 
                            className="btn-icon" 
                            onClick={() => loadDeck(deck.id)}
                            title="Load this deck"
                        >
                            <i className="fas fa-folder-open"></i>
                        </button>
                        <button 
                            className="btn-icon" 
                            onClick={() => deleteDeck(deck.id)}
                            title="Delete this deck"
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
        <div className="button-group">
            <button className="btn-secondary" onClick={clearAllDecks}>
                <i className="fas fa-trash"></i> Clear All Decks
            </button>
        </div>
    </div>
)}
    </div>
  );
};

export default VocabularyInput;