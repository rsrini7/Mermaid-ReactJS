import React from 'react';
import ExportSettings from './ExportSettings';

const InputSection = ({ 
  mermaidCode, 
  setMermaidCode, 
  renderDiagram, 
  handleOpenPopup, 
  loading, 
  errorMessage,
  imageWidth,
  setImageWidth,
  imageHeight,
  setImageHeight,
  imageScale,
  setImageScale
}) => {
  return (
    <div className="input-section">
      <div className="input-header">
        <h2>Mermaid Syntax</h2>
        <div>
          <button onClick={renderDiagram}>Render Diagram</button>
          <button onClick={handleOpenPopup}>Open Editor</button>
        </div>
      </div>
      <textarea
        className="mermaid-textarea"
        value={mermaidCode}
        onChange={(e) => setMermaidCode(e.target.value)}
        placeholder="Enter your Mermaid diagram syntax here..."
      />
      <div>
        {loading && <span className="loading">Rendering...</span>}
        <div className="error-message">{errorMessage}</div>
      </div>

      <ExportSettings
        imageWidth={imageWidth}
        setImageWidth={setImageWidth}
        imageHeight={imageHeight}
        setImageHeight={setImageHeight}
        imageScale={imageScale}
        setImageScale={setImageScale}
      />
    </div>
  );
};

export default InputSection;