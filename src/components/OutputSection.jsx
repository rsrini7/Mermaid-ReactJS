import React from 'react';

const OutputSection = ({ outputDivRef, exportSvg, exportPng, openDiagramWindow, handleCopyImage }) => {
  return (
    <div className="output-section">
      <div className="output-header">
        <h2>Rendered Diagram</h2>
        <div>
          <button onClick={handleCopyImage}>Copy Image</button>
          <button onClick={exportSvg}>Export as SVG</button>
          <button onClick={exportPng}>Export as PNG</button>
          <button onClick={openDiagramWindow}>Open Diagram</button>
        </div>
      </div>
      <div className="mermaid-output" ref={outputDivRef}></div>
    </div>
  );
};

export default OutputSection;