import { useState } from "react";
import "./App.css";

function HelpButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button className="help-button" onClick={handleClick}>
        <i className="fas fa-question"></i>
      </button>
      
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">About Rogue Cite</h2>
              <button className="close-button" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-section">
                <p>Rogue Cite helps you create and manage your own flashcards with AI-powered learning.</p>
              </div>
              <div className="modal-section">
                <h3 className="modal-section-title">
                  <i className="fas fa-plus-circle"></i>
                  Create New Deck
                </h3>
                <p className="modal-section-content">Build a new vocabulary study deck from scratch with our intuitive editor.</p>
              </div>
              <div className="modal-section">
                <h3 className="modal-section-title">
                  <i className="fas fa-link"></i>
                  Match With Deck
                </h3>
                <p className="modal-section-content">Study your vocab words, with A.I generating new definitions for you every time so you REALLY remember what you're learning.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CreateButton() {
  return (
    <button className="main-button create">
      <i className="fas fa-plus-circle"></i>
      Create New Deck
    </button>
  );
}

function MatchButton() {
  return (
    <button className="main-button match">
      <i className="fas fa-link"></i>
      Match With Deck
    </button>
  );
}

// The main App component that renders the entire page.
export default function App() {
  return (
    <div className="app-container">
      <div className="help-button-container">
        <HelpButton />
      </div>

      {/* Container for the main content to center everything */}
      <div className="main-content">
        {/* The main title of the page */}
        <h1 className="title">Rogue Cite</h1>
        <p className="subtitle">Create, match, and learn new vocabulary words with ease</p>
        
        {/* Placeholder for the logo */}
        <div className="logo-container">
          <img 
            src="https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
            alt="App Logo"
            className="app-logo"
          />
        </div>
        
        {/* Container for the two buttons */}
        <div className="button-group">
          <CreateButton />
          <MatchButton />
        </div>
        
        {/* Features section */}
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
  );
}