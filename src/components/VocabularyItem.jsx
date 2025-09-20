import React from 'react';

const VocabularyItem = ({ item, index, onEdit, onDelete }) => {
    return (
        <div className="vocab-item">
            <div className="vocab-content">
                <div className="vocab-word">{item.word}</div>
                <div className="vocab-def">{item.definition}</div>
            </div>
            <div className="vocab-actions">
                <button className="btn-icon" onClick={() => onEdit(index)} title="Edit">
                    <i className="fas fa-edit"></i>
                </button>
                <button className="btn-icon" onClick={() => onDelete(index)} title="Delete">
                    <i className="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    );
};

export default VocabularyItem;