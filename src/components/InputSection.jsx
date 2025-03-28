import React from 'react';
import ExportSettings from './ExportSettings';

const InputSection = ({
  mermaidCode,
  setMermaidCode,
  renderDiagram,
  handleOpenEditor,
  loading,
  errorMessage, // Receive errorMessage prop
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
          <button onClick={renderDiagram} disabled={loading}>
            {loading ? 'Rendering...' : 'Render Diagram'}
          </button>
          <button onClick={handleOpenEditor} disabled={loading}>Open Editor</button>
        </div>
      </div>
      <textarea
        className="mermaid-textarea"
        value={mermaidCode}
        onChange={(e) => setMermaidCode(e.target.value)}
        placeholder="Enter your Mermaid diagram syntax here..."
        readOnly={loading} // Prevent editing while rendering
      />
      {/* Display error message below textarea */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

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
