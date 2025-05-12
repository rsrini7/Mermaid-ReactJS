import React from 'react';

interface InputSectionProps {
  mermaidCode: string;
  setMermaidCode: (code: string) => void;
  renderDiagram: () => void;
  handleOpenEditor: () => void;
  loading: boolean;
  errorMessage?: string;
  imageWidth: number;
  setImageWidth: (width: number) => void;
  imageHeight: number;
  setImageHeight: (height: number) => void;
  imageScale: number;
  setImageScale: (scale: number) => void;
  templates: Record<string, unknown>;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  mermaidCode,
  setMermaidCode,
  renderDiagram,
  handleOpenEditor,
  loading,
  errorMessage,
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
    <div className="dia-input-section">
      <div className="dia-input-header">
        <h2>Mermaid Syntax</h2>
        <div>
          <button className="dia-btn" onClick={renderDiagram} disabled={loading}>
            {loading ? 'Rendering...' : 'Render Diagram'}
          </button>
          <button className="dia-btn" onClick={handleOpenEditor} disabled={loading}>Open Editor</button>
        </div>
      </div>
      
      <div className="dia-template-selector">
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
        className="dia-mermaid-textarea"
        value={mermaidCode}
        onChange={(e) => setMermaidCode(e.target.value)}
        placeholder="Enter your Mermaid diagram syntax here..."
        readOnly={loading} // Prevent editing while rendering
      />
      {/* Display error message below textarea */}
      {errorMessage && <div className="dia-error-message">{errorMessage}</div>}

      <div className="dia-export-settings">
        <h3>Export Settings</h3>
        <div className="dia-export-settings-container">
          <div className="dia-export-settings-row">
            <div className="dia-export-setting-item">
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
            <div className="dia-export-setting-item">
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
            <div className="dia-export-setting-item">
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
