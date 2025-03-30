import React from 'react';
import ExportSettings from './ExportSettings';
import { Dropdown } from '@salt-ds/core';

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
  setImageScale,
  templates,
  selectedTemplate,
  onTemplateChange
}) => {
  // Create template options for dropdown
  const templateOptions = Object.keys(templates).map(key => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
    value: key
  }));

  // Find the selected option object based on the selectedTemplate value
  const selectedOption = templateOptions.find(option => option.value === selectedTemplate);

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
      
      <div className="template-selector">
        <label htmlFor="template-dropdown">Template:</label>
        <select
          id="template-dropdown"
          value={selectedTemplate}
          onChange={(e) => onTemplateChange(e.target.value)}
          disabled={loading}
        >
          {templateOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

      <div className="export-settings">
        <h3>Export Settings</h3>
        <div className="export-settings-container">
          <div className="export-settings-row">
            <div className="export-setting-item">
              <label htmlFor="image-width">Width:</label>
              <input
                id="image-width"
                type="number"
                value={imageWidth}
                onChange={(e) => setImageWidth(parseInt(e.target.value))}
                min="100"
                max="3000"
              />
            </div>
            <div className="export-setting-item">
              <label htmlFor="image-height">Height:</label>
              <input
                id="image-height"
                type="number"
                value={imageHeight}
                onChange={(e) => setImageHeight(parseInt(e.target.value))}
                min="100"
                max="3000"
              />
            </div>
            <div className="export-setting-item">
              <label htmlFor="image-scale">Scale:</label>
              <input
                id="image-scale"
                type="number"
                value={imageScale}
                onChange={(e) => setImageScale(parseFloat(e.target.value))}
                min="0.1"
                max="5"
                step="0.1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
