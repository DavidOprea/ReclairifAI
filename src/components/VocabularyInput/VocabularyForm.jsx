import React from 'react';

const VocabularyForm = ({ word, definition, onSubmit, onClear, isEditing, onInputChange }) => {
    return (
        <div className="form-container">
            <form className="vocab-form" onSubmit={onSubmit}>
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="word">Vocabulary Word</label>
                        <input
                            type="text"
                            id="word"
                            value={word}
                            onChange={(e) => onInputChange('word', e.target.value)}
                            placeholder="Enter a word or term"
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="definition">Definition</label>
                        <textarea
                            id="definition"
                            value={definition}
                            onChange={(e) => onInputChange('definition', e.target.value)}
                            placeholder="Enter the definition"
                        ></textarea>
                    </div>
                </div>
                
                <div className="button-group">
                    <button type="submit" className="btn-primary">
                        {isEditing ? 'Update Item' : 'Add to List'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={onClear}>
                        Clear Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VocabularyForm;