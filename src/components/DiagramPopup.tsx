import React, { useEffect, useRef, useState } from 'react';

interface DiagramPopupProps {
  svgContent: string;
  handleZoomChange: (newZoomLevel: number) => void;
  closeDiagramPopup: () => void;
  handleCopyImage: () => void;
  zoomLevel: number;
}

const DiagramPopup: React.FC<DiagramPopupProps> = ({ svgContent, closeDiagramPopup, handleCopyImage, zoomLevel }) => {
  const previewDivRef = useRef<HTMLDivElement>(null); // Local ref for the preview div
  const previewContainerRef = useRef<HTMLDivElement>(null); // Ref for the inner container that will be scaled
  
  // Add state to track slider value
  const [sliderValue, setSliderValue] = useState<number>(zoomLevel * 100);

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDiagramPopup();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDiagramPopup]);

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
    const newZoomLevel = newValue / 100;
    if (previewContainerRef.current) {
      previewContainerRef.current.style.transform = `scale(${newZoomLevel})`;
    }
  };

  return (
    <div className="dia-popup dia-diagram-popup">
      <div className="dia-popup-content">
        <div className="dia-diagram-controls">
          <h2>Diagram Preview</h2>
          <div className="dia-diagram-control-buttons">
            <div className="dia-zoom-slider-container">
              <span className="dia-zoom-label">Zoom: {sliderValue}%</span>
              <input
                type="range"
                min="10"
                max="400"
                value={sliderValue}
                onChange={handleSliderChange}
                className="dia-zoom-slider"
              />
            </div>
            <div className="dia-tooltip-wrapper">
              <button onClick={handleCopyImage} className="dia-btn dia-copy-image-btn">Copy Image</button>
              <span className="dia-tooltip-text">Copy to Clipboard</span>
            </div>
            <div className="dia-tooltip-wrapper">
              <button className="dia-btn" onClick={closeDiagramPopup}>Close</button>
              <span className="dia-tooltip-text">Close Preview</span>
            </div>
          </div>
        </div>
        <div className="dia-diagram-preview" ref={previewDivRef}>
          <div className="dia-diagram-preview-container" ref={previewContainerRef}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramPopup;
