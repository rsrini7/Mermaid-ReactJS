import React, { useEffect, useRef, useState } from 'react';

const DiagramPopup = ({ svgContent, handleZoomIn, handleZoomOut, closeDiagramPopup, handleCopyImage, zoomLevel }) => {
  const previewDivRef = useRef(null); // Local ref for the preview div
  
  // Add state to track slider value
  const [sliderValue, setSliderValue] = useState(zoomLevel * 100);

  // Effect to update the preview content when svgContent changes or component mounts
  useEffect(() => {
    if (previewDivRef.current && svgContent) {
      previewDivRef.current.innerHTML = svgContent;
    }
  }, [svgContent]); // Dependency array ensures this runs when svgContent changes

  // Effect to update slider when zoomLevel changes from outside
  useEffect(() => {
    setSliderValue(zoomLevel * 100);
  }, [zoomLevel]);

  // Add event listener for Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDiagramPopup();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDiagramPopup]);

  // Handle slider change
  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
    // Calculate the new zoom level (between 0.1 and 3)
    const newZoomLevel = newValue / 100;
    // Update the diagram with the new zoom level
    previewDivRef.current.style.transform = `scale(${newZoomLevel})`;
  };

  return (
    <div className="popup diagram-popup">
      <div className="popup-content">
        <div className="diagram-controls">
          <h2>Diagram Preview</h2>
          <div className="diagram-control-buttons">
            {/* Replace + and - buttons with a slider */}
            <div className="zoom-slider-container">
              <span className="zoom-label">Zoom: {sliderValue}%</span>
              <input
                type="range"
                min="10"
                max="300"
                value={sliderValue}
                onChange={handleSliderChange}
                className="zoom-slider"
              />
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
