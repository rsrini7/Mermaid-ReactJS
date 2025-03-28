import React from 'react';

const DiagramPopup = ({ diagramPreviewRef, handleZoomIn, handleZoomOut, closeDiagramPopup, handleCopyImage, zoomLevel }) => { // Add zoomLevel prop
  return (
    <div className="popup diagram-popup">
      <div className="popup-content">
        <div className="diagram-controls">
          <h2>Diagram Preview</h2>
          <div className="diagram-control-buttons">
            <div className="tooltip-wrapper">
              <button className="icon-button" onClick={handleZoomIn}>+</button>
              <span className="tooltip-text">Zoom In</span>
            </div>
            <div className="tooltip-wrapper">
              <button className="icon-button" onClick={handleZoomOut}>−</button>
              <span className="tooltip-text">Zoom Out</span>
            </div>
            <div className="tooltip-wrapper">
              <button onClick={handleCopyImage}>Copy Image</button>
              <span className="tooltip-text">Copy to Clipboard</span>
            </div>
            <div className="tooltip-wrapper">
              <button onClick={closeDiagramPopup}>Close</button>
              <span className="tooltip-text">Close Preview</span>
            </div>
          </div>
        </div>
        {/* Apply zoom level using inline style */}
        <div 
          className="diagram-preview" 
          ref={diagramPreviewRef} 
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        ></div>
      </div>
    </div>
  );
};

export default DiagramPopup;
