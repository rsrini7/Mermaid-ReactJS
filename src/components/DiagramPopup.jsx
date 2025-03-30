import React, { useEffect, useRef, useState } from 'react';

const DiagramPopup = ({ svgContent, handleZoomIn, handleZoomOut, closeDiagramPopup, handleCopyImage, zoomLevel }) => {
  const previewDivRef = useRef(null); // Local ref for the preview div
  const previewContainerRef = useRef(null); // Ref for the inner container that will be scaled
  
  // Add state to track slider value
  const [sliderValue, setSliderValue] = useState(zoomLevel * 100);

  // Effect to update the preview content when svgContent changes or component mounts
  useEffect(() => {
    if (previewContainerRef.current && svgContent) {
      previewContainerRef.current.innerHTML = svgContent;
    }
  }, [svgContent]); // Dependency array ensures this runs when svgContent changes

  // Effect to update slider when zoomLevel changes from outside
  useEffect(() => {
    setSliderValue(zoomLevel * 100);
  }, [zoomLevel]);

  // Effect to apply zoom level and center the content in the viewport
  useEffect(() => {
    if (previewContainerRef.current && previewDivRef.current) {
      // Apply zoom transformation to the container
      previewContainerRef.current.style.transform = `scale(${zoomLevel})`;
      previewContainerRef.current.style.transformOrigin = 'top left';
      
      // Center the zoomed content in the viewport if it's smaller than the viewport
      const containerRect = previewContainerRef.current.getBoundingClientRect();
      const previewRect = previewDivRef.current.getBoundingClientRect();
      
      // If the zoomed content is smaller than the viewport, center it
      if (containerRect.width * zoomLevel < previewRect.width) {
        previewDivRef.current.scrollLeft = 0;
      }
      
      if (containerRect.height * zoomLevel < previewRect.height) {
        previewDivRef.current.scrollTop = 0;
      }
    }
  }, [zoomLevel, svgContent]);

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
    
    // Update the container with the new zoom level
    if (previewContainerRef.current) {
      previewContainerRef.current.style.transform = `scale(${newZoomLevel})`;
    }
  };

  return (
    <div className="popup diagram-popup">
      <div className="popup-content">
        <div className="diagram-controls">
          <h2>Diagram Preview</h2>
          <div className="diagram-control-buttons">
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
        {/* The outer div handles scrolling */}
        <div className="diagram-preview" ref={previewDivRef}>
          {/* The inner container handles zoom transformation */}
          <div className="diagram-preview-container" ref={previewContainerRef}>
            {/* Content is set via useEffect */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramPopup;
