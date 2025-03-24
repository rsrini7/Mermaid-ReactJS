import React from 'react';

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

      <div className="resolution-settings">
        <h3>Export Settings</h3>
        <div className="settings-inputs">
          <div>
            <label htmlFor="image-width">Width: </label>
            <input type="number" id="image-width" value={imageWidth} onChange={(e) => setImageWidth(parseInt(e.target.value, 10))} min="100" />
          </div>
          <div>
            <label htmlFor="image-height">Height: </label>
            <input type="number" id="image-height" value={imageHeight} onChange={(e) => setImageHeight(parseInt(e.target.value, 10))} min="100" />
          </div>
          <div>
            <label htmlFor="image-scale">Scale: </label>
            <input type="number" id="image-scale" value={imageScale} onChange={(e) => setImageScale(parseFloat(e.target.value))} min="1" max="5" step="0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;