import React from 'react';

const OutputSection = ({ 
  outputDivRef, 
  handleExportSvg, 
  handleExportPng, 
  handleOpenDiagram, 
  handleCopyImage,
  isLoading // Receive loading state
}) => {
  return (
    <div className="output-section">
      <div className="output-header">
        <h2>Output Diagram</h2>
        <div className="output-controls">
          {/* Disable buttons while loading */}
          <button onClick={handleOpenDiagram} disabled={isLoading}>Open Diagram</button>
          <button onClick={handleCopyImage} disabled={isLoading}>Copy Image</button>
          <button onClick={handleExportSvg} disabled={isLoading}>Export SVG</button>
          <button onClick={handleExportPng} disabled={isLoading}>Export PNG</button>
        </div>
      </div>
      {/* Show loading indicator */}
      {isLoading && <div className="loading-indicator">Rendering Diagram...</div>}
      {/* Diagram container */}
      <div 
        ref={outputDivRef} 
        className={`mermaid-output-container ${isLoading ? 'loading' : ''}`}
      >
        {/* Content will be rendered here by mermaid */}
      </div>
    </div>
  );
};

export default OutputSection;
