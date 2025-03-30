import React, { useEffect } from 'react';

const EditorPopup = ({ mermaidCode, setMermaidCode, onSave, onClose }) => {
  // Add event listener for Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="popup editor-popup">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Edit Mermaid Syntax</h2>
          <div className="popup-header-buttons">
            <button onClick={onSave}>Save and Close</button>
            <button onClick={onClose}>Close Without Saving</button> {/* This button uses onClose */}
          </div>
        </div>
        <textarea
          className="popup-textarea"
          value={mermaidCode}
          onChange={(e) => setMermaidCode(e.target.value)}
        />
      </div>
    </div>
  );
};

export default EditorPopup;
