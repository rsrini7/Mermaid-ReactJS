import React from 'react';

const DiagramPopup = ({ diagramPreviewRef, handleZoomIn, handleZoomOut, closeDiagramPopup }) => {
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
              <button onClick={closeDiagramPopup}>Close</button>
              <span className="tooltip-text">Close Preview</span>
            </div>
          </div>
        </div>
        <div className="diagram-preview" ref={diagramPreviewRef}></div>
      </div>
    </div>
  );
};

export default DiagramPopup;