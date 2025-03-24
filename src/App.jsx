import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './App.css';
import templates from './utils/mermaidTemplates.js';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [mermaidCode, setMermaidCode] = useState(templates.flowchart);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagramScale, setDiagramScale] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDiagramPopupOpen, setIsDiagramPopupOpen] = useState(false);
  const [imageWidth, setImageWidth] = useState(1200);
  const [imageHeight, setImageHeight] = useState(800);
  const [imageScale, setImageScale] = useState(2);

  const outputDivRef = useRef(null);
  const diagramPreviewRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose'
    });
    
    // Only render on theme change if we already have a diagram rendered
    if (outputDivRef.current && outputDivRef.current.innerHTML) {
      renderDiagram();
    }
  }, [theme]);

  // Separate useEffect for initial render
  useEffect(() => {
    // Initialize mermaid with the current theme
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose'
    });
    
    // Render the diagram after a short delay to ensure initialization is complete
    const timer = setTimeout(() => {
      renderDiagram();
    }, 100);
    
    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount
  
  // Separate useEffect just for theme changes
  useEffect(() => {
    // Re-initialize mermaid when theme changes
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose'
    });
    
    // Only re-render if we're not in the initial render
    if (outputDivRef.current && outputDivRef.current.querySelector('svg')) {
      renderDiagram();
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleTemplateChange = (e) => {
    const selectedTemplate = e.target.value;
    if (selectedTemplate && templates[selectedTemplate]) {
      // Clear the current diagram immediately
      if (outputDivRef.current) {
        outputDivRef.current.innerHTML = '';
      }
      
      // Get the template code directly
      const templateCode = templates[selectedTemplate];
      
      // Update state
      setMermaidCode(templateCode);
      
      // Render using the template code directly instead of waiting for state update
      setTimeout(() => {
        renderDiagramWithCode(templateCode);
      }, 50);
    }
  };

  // Add a new function that takes code as a parameter
  const renderDiagramWithCode = (code) => {
    setLoading(true);
    setErrorMessage('');

    try {
      mermaid.render('mermaid-svg', code).then(result => {
        if (outputDivRef.current) {
          outputDivRef.current.innerHTML = result.svg;
        }
        setLoading(false);
      }).catch(error => {
        setErrorMessage(`Error: ${error.message || 'Invalid Mermaid syntax'}`);
        setLoading(false);
      });
    } catch (error) {
      setErrorMessage(`Error: ${error.message || 'Invalid Mermaid syntax'}`);
      setLoading(false);
    }
  };

  const renderDiagram = () => {
    renderDiagramWithCode(mermaidCode);
  };

  const exportSvg = () => {
    const svgElement = outputDivRef.current.querySelector('svg');

    if (!svgElement) {
      setErrorMessage('No diagram to export. Please render a diagram first.');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    downloadFile(blob, 'mermaid-diagram.svg');
  };

  const exportPng = () => {
    const svgElement = outputDivRef.current.querySelector('svg');

    if (!svgElement) {
      setErrorMessage('No diagram to export. Please render a diagram first.');
      return;
    }

    const width = imageWidth;
    const height = imageHeight;
    const scale = imageScale;

    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      let sourceSVG = svgData;
      if (!sourceSVG.includes('xmlns="http://www.w3.org/2000/svg"')) {
        sourceSVG = sourceSVG.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!sourceSVG.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
        sourceSVG = sourceSVG.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }
      if (!svgElement.hasAttribute('width')) {
        sourceSVG = sourceSVG.replace('<svg', `<svg width="${width}"`);
      }
      if (!svgElement.hasAttribute('height')) {
        sourceSVG = sourceSVG.replace('<svg', `<svg height="${height}"`);
      }

      const base64Data = btoa(unescape(encodeURIComponent(sourceSVG)));
      const dataUrl = `data:image/svg+xml;base64,${base64Data}`;

      const img = new Image();
      img.width = width;
      img.height = height;

      img.onerror = () => {
        setErrorMessage('Error loading SVG for PNG conversion.');
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width * scale;
          canvas.height = height * scale;

          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              downloadFile(blob, 'mermaid-diagram.png');
            } else {
              setErrorMessage('Failed to create PNG. The diagram might be too complex.');
            }
          }, 'image/png');
        } catch (error) {
          setErrorMessage(`Error creating PNG: ${error.message}`);
        }
      };

      img.src = dataUrl;
    } catch (error) {
      setErrorMessage(`SVG processing error: ${error.message}`);
    }
  };

  const downloadFile = (blob, filename) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);
  };

  const openDiagramWindow = () => {
    // First set the popup to open, which will render the ref element
    setIsDiagramPopupOpen(true);
    
    // Use setTimeout to ensure the ref is available after the component has rendered
    setTimeout(() => {
      if (diagramPreviewRef.current) {
        const currentDiagram = outputDivRef.current.innerHTML;
        diagramPreviewRef.current.innerHTML = `<div class="diagram-container">${currentDiagram}</div>`;
        setDiagramScale(1);
      }
    }, 0);
  };

  const updateDiagramWindowScale = () => {
    const container = diagramPreviewRef.current.querySelector('.diagram-container');
    if (container) {
      container.style.transform = `scale(${diagramScale})`;
    }
  };

  const handleZoomIn = () => {
    setDiagramScale(diagramScale + 0.1);
    updateDiagramWindowScale();
  };

  const handleZoomOut = () => {
    setDiagramScale(Math.max(0.1, diagramScale - 0.1));
    updateDiagramWindowScale();
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleSavePopup = () => {
    setIsPopupOpen(false);
    renderDiagram();
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Add this useEffect to handle escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isPopupOpen) {
          handleClosePopup();
        }
        if (isDiagramPopupOpen) {
          setIsDiagramPopupOpen(false);
        }
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
  
    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPopupOpen, isDiagramPopupOpen]); // Dependencies array

  return (
    <div className="app-container" data-theme={theme}>
      <h1>Mermaid Diagram Generator</h1>

      <div className="controls">
        <div className="template-section">
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
        
        <div className="theme-toggle">
          <span className="theme-icon">☀️</span>
          <label className="switch">
            <input type="checkbox" checked={theme === 'dark'} onChange={handleThemeToggle} />
            <span className="slider"></span>
          </label>
          <span className="theme-icon">🌙</span>
        </div>
      </div>

      <div className="container">
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

        <div className="output-section">
          <div className="output-header">
            <h2>Rendered Diagram</h2>
            <div>
              <button onClick={exportSvg}>Export as SVG</button>
              <button onClick={exportPng}>Export as PNG</button>
              <button onClick={openDiagramWindow}>Open Diagram</button>
            </div>
          </div>
          <div className="mermaid-output" ref={outputDivRef}></div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup editor-popup">
          <div className="popup-content">
            <div className="popup-header">
              <h2>Edit Mermaid Syntax</h2>
              <div className="popup-header-buttons">
                <button onClick={handleSavePopup}>Save and Close</button>
                <button onClick={handleClosePopup}>Close Without Saving</button>
              </div>
            </div>
            <textarea
              className="popup-textarea"
              value={mermaidCode}
              onChange={(e) => setMermaidCode(e.target.value)}
            />
          </div>
        </div>
      )}

      {isDiagramPopupOpen && (
        <div className="popup diagram-popup">
          <div className="popup-content">
            <div className="diagram-controls">
              <h2>Diagram Preview</h2>
              <div className="diagram-control-buttons">
                <div className="tooltip-wrapper">
                  <button className="icon-button" onClick={handleZoomIn}>+</button>
                  <span className="tooltip-text">Zoom In</span>
                </div>
                <div className="tooltip-wrapper">
                  <button className="icon-button" onClick={handleZoomOut}>−</button>
                  <span className="tooltip-text">Zoom Out</span>
                </div>
                <div className="tooltip-wrapper">
                  <button onClick={() => setIsDiagramPopupOpen(false)}>Close</button>
                  <span className="tooltip-text">Close Preview</span>
                </div>
              </div>
            </div>
            <div className="diagram-preview" ref={diagramPreviewRef}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;