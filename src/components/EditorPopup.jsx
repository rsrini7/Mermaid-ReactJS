import React from 'react';

const EditorPopup = ({ mermaidCode, setMermaidCode, handleSavePopup, handleClosePopup }) => {
  return (
    <div className="popup editor-popup">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Edit Mermaid Syntax</h2>
          <div className="popup-header-buttons">
            <button onClick={handleSavePopup}>Save and Close</button>
            <button onClick={handleClosePopup}>Close Without Saving</button> {/* This button uses handleClosePopup */}
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
