import React from 'react';
import VocabularyItem from './VocabularyItem';

const VocabularyList = ({ items, onEdit, onDelete, onClearAll, onExport }) => {
    if (items.length === 0) {
        return (
            <div className="empty-state">
                <i className="fas fa-clipboard-list"></i>
                <p>Your vocabulary list is empty. Add some words to get started!</p>
            </div>
        );
    }
    
    return (
        <>
            {items.map((item, index) => (
                <VocabularyItem 
                    key={index} 
                    item={item} 
                    index={index} 
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
            
            <div className="button-group" style={{marginTop: '20px'}}>
                <button className="btn-primary" onClick={onExport}>
                    <i className="fas fa-download"></i> Export List
                </button>
                <button className="btn-secondary" onClick={onClearAll}>
                    <i className="fas fa-trash"></i> Clear All
                </button>
            </div>
        </>
    );
};

export default VocabularyList;