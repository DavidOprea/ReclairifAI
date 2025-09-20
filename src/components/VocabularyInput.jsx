import React, { useState } from 'react';
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
  
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };
  
  const handleInputChange = (field, value) => {
    if (field === 'word') setWord(value);
    if (field === 'definition') setDefinition(value);
  };
  
  const navigate = useNavigate();

  // Add a back button handler
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!word.trim() || !definition.trim()) {
      showNotification('Please enter both a word and a definition');
      return;
    }
    
    if (editIndex === -1) {
      // Add new item
      setVocabularyList([...vocabularyList, { word, definition }]);
      showNotification('Vocabulary item added successfully!');
    } else {
      // Update existing item
      const updatedList = [...vocabularyList];
      updatedList[editIndex] = { word, definition };
      setVocabularyList(updatedList);
      setEditIndex(-1);
      showNotification('Vocabulary item updated successfully!');
    }
    
    // Reset form
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
  
  const handleExport = () => {
    if (vocabularyList.length === 0) {
      showNotification('No vocabulary items to export!');
      return;
    }
    
    // Convert to JSON
    const dataStr = JSON.stringify(vocabularyList, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Create export element
    const exportFileDefaultName = 'vocabulary-list.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Vocabulary list exported successfully!');
  };
  
  return (
    <div className="container">
      <Notification message={notification} />
      
      <header>
        <button onClick={handleBack} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Back
        </button>
        <h1>Deck Creator</h1>
        <p className="subtitle">Create your vocabulary list for enhanced matching</p>
      </header>
      
      <div className="app-content">
        <div className="instructions">
          <h3>How to use this tool</h3>
          <ul>
            <li>Enter a vocabulary word and its definition in the form below</li>
            <li>Click "Add to List" to save the word to your vocabulary list</li>
            <li>Edit or delete items using the action buttons</li>
            <li>When your list is complete, export it for use in your vocabulary matching game</li>
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
      
      <footer>
        <p>ReclairifAI &copy; 2025 | Part of the Enhanced Quizlet Matching Project</p>
      </footer>
    </div>
  );
};

export default VocabularyInput;