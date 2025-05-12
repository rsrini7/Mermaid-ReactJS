import React from 'react';

interface HeaderProps {
  theme: string;
  handleThemeToggle: () => void;
  handleTemplateChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ theme, handleThemeToggle, handleTemplateChange }) => {
  return (
    <>
      <h1>Mermaid Diagram Generator</h1>
      <div className="dia-controls">
        <div className="dia-template-section">
          <label htmlFor="template-select">Select Template: </label>
          <select id="template-select" name="template-select" onChange={handleTemplateChange} defaultValue="flowchart">
            <option value="">-- Select a diagram type --</option>
            <optgroup label="Flow Charts">
              <option value="flowchart">Flowchart (TD - Top Down)</option>
              <option value="flowchart-lr">Flowchart (LR - Left to Right)</option>
              <option value="flowchart-complex">Complex Flowchart with Subgraphs</option>
            </optgroup>
            <optgroup label="Sequence Diagrams">
              <option value="sequence">Basic Sequence Diagram</option>
              <option value="sequence-advanced">Advanced Sequence Diagram</option>
            </optgroup>
            <optgroup label="Class Diagrams">
              <option value="class">Class Diagram</option>
            </optgroup>
            <optgroup label="State Diagrams">
              <option value="state">State Diagram</option>
            </optgroup>
            <optgroup label="Entity Relationship">
              <option value="er">Entity Relationship Diagram</option>
            </optgroup>
            <optgroup label="User Journey">
              <option value="journey">User Journey</option>
            </optgroup>
            <optgroup label="Gantt Charts">
              <option value="gantt">Gantt Chart</option>
            </optgroup>
            <optgroup label="Pie Charts">
              <option value="pie">Pie Chart</option>
            </optgroup>
            <optgroup label="Requirement Diagrams">
              <option value="requirement">Requirement Diagram</option>
            </optgroup>
            <optgroup label="Git Graphs">
              <option value="git">Git Graph</option>
            </optgroup>
            <optgroup label="C4 Diagrams">
              <option value="c4">C4 Context Diagram</option>
            </optgroup>
            <optgroup label="Mind Maps">
              <option value="mindmap">Mind Map</option>
            </optgroup>
            <optgroup label="Timeline">
              <option value="timeline">Timeline</option>
            </optgroup>
            <optgroup label="Quadrant Charts">
              <option value="quadrant">Quadrant Chart</option>
            </optgroup>
          </select>
        </div>
        <div className="dia-theme-toggle">
          <span className="dia-theme-icon">☀️</span>
          <label className="dia-switch">
            <input type="checkbox" checked={theme === 'dark'} onChange={handleThemeToggle} />
            <span className="dia-slider"></span>
          </label>
          <span className="dia-theme-icon">🌙</span>
        </div>
      </div>
    </>
  );
};

export default Header;
