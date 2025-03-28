import React, { useEffect, useRef } from 'react';

const DiagramPopup = ({ svgContent, handleZoomIn, handleZoomOut, closeDiagramPopup, handleCopyImage, zoomLevel }) => {
  const previewDivRef = useRef(null); // Local ref for the preview div

  // Effect to update the preview content when svgContent changes or component mounts
  useEffect(() => {
    if (previewDivRef.current && svgContent) {
      previewDivRef.current.innerHTML = svgContent;
    }
  }, [svgContent]); // Dependency array ensures this runs when svgContent changes

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
          ref={previewDivRef} // Use the local ref
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          {/* Content is now set via useEffect */}
        </div>
      </div>
    </div>
  );
};

export default DiagramPopup;
