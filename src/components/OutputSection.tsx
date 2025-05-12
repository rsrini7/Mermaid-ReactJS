import React, { RefObject } from 'react';

interface OutputSectionProps {
  outputDivRef: RefObject<HTMLDivElement>;
  handleExportSvg: () => void;
  handleExportPng: () => void;
  handleOpenDiagram: () => void;
  handleCopyImage: () => void;
  isLoading: boolean;
}

const OutputSection: React.FC<OutputSectionProps> = ({ 
  outputDivRef, 
  handleExportSvg, 
  handleExportPng, 
  handleOpenDiagram, 
  handleCopyImage,
  isLoading
}) => {
  return (
    <div className="output-section">
      <div className="output-header">
        <h2>Output Diagram</h2>
        <div className="output-controls">
          <button onClick={handleOpenDiagram} disabled={isLoading}>Open Diagram</button>
          <button onClick={handleCopyImage} disabled={isLoading}>Copy Image</button>
          <button onClick={handleExportSvg} disabled={isLoading}>Export SVG</button>
          <button onClick={handleExportPng} disabled={isLoading}>Export PNG</button>
        </div>
      </div>
      {isLoading && <div className="loading-indicator">Rendering Diagram...</div>}
      <div 
        ref={outputDivRef} 
        className={`mermaid-output-container ${isLoading ? 'loading' : ''}`}
      >
      </div>
    </div>
  );
};

export default OutputSection;
