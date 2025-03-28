import React from 'react';

// Correct the destructured prop names
const OutputSection = ({ outputDivRef, handleExportSvg, handleExportPng, handleOpenDiagram, handleCopyImage }) => {
  return (
    <div className="output-section">
      <div className="output-header">
        <h2>Rendered Diagram</h2>
        <div>
          <button onClick={handleCopyImage}>Copy Image</button>
          {/* Use correct prop names in onClick handlers */}
          <button onClick={handleExportSvg}>Export as SVG</button>
          <button onClick={handleExportPng}>Export as PNG</button>
          <button onClick={handleOpenDiagram}>Open Diagram</button>
        </div>
      </div>
      <div className="mermaid-output" ref={outputDivRef}></div>
    </div>
  );
};

export default OutputSection;
