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
    <div className="dia-output-section">
      <div className="dia-output-header">
        <h2>Output Diagram</h2>
        <div className="dia-output-controls">
          <button className="dia-btn" onClick={handleOpenDiagram} disabled={isLoading}>Open Diagram</button>
          <button className="dia-btn" onClick={handleCopyImage} disabled={isLoading}>Copy Image</button>
          <button className="dia-btn" onClick={handleExportSvg} disabled={isLoading}>Export SVG</button>
          <button className="dia-btn" onClick={handleExportPng} disabled={isLoading}>Export PNG</button>
        </div>
      </div>
      {isLoading && <div className="dia-loading-indicator">Rendering Diagram...</div>}
      <div 
        ref={outputDivRef} 
        className={`dia-mermaid-output-container ${isLoading ? 'loading' : ''}`}
      >
      </div>
    </div>
  );
};

export default OutputSection;
