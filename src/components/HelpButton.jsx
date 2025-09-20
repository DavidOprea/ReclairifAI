import { useState } from "react";

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
              <h2 className="modal-title">About ReclarifAI</h2>
              <button className="close-button" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-section">
                <p>ReclarifAI helps you create and manage your own flashcards with AI-powered learning.</p>
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

export default HelpButton;