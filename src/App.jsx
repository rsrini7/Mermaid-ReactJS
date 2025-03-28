import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './App.css';
import templates from './utils/mermaidTemplates.js';
import { SaltProvider } from '@salt-ds/core';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import DiagramPopup from './components/DiagramPopup';
import EditorPopup from './components/EditorPopup';
// Import utility functions
import { exportSvg, exportPng, copyImageToClipboard } from './utils/diagramUtils';

const App = () => {
  const [mermaidCode, setMermaidCode] = useState(templates.flowchart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Use null for no error, string for error message
  const [showDiagramPopup, setShowDiagramPopup] = useState(false);
  const [showEditorPopup, setShowEditorPopup] = useState(false);
  const [imageWidth, setImageWidth] = useState(800); // Default width
  const [imageHeight, setImageHeight] = useState(600); // Default height
  const [imageScale, setImageScale] = useState(1.5); // Default scale for PNG export
  const [mode, setMode] = useState('light');
  const [diagramZoom, setDiagramZoom] = useState(1);
  const [tempMermaidCode, setTempMermaidCode] = useState(mermaidCode);
  const [previewSvgContent, setPreviewSvgContent] = useState(''); // State for SVG content in popup

  const outputDivRef = useRef(null);

  // Initialize Mermaid on mode change
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false, // We'll render manually
      theme: mode === 'light' ? 'default' : 'dark',
      securityLevel: 'loose', // Allow scripts if needed, adjust as necessary
    });
    // Re-render diagram if code exists and theme changes
    if (mermaidCode && outputDivRef.current) {
       renderDiagram();
    }
     // Add class to body for potential global dark mode styling
    document.body.classList.toggle('dark', mode === 'dark');
    document.body.classList.toggle('light', mode === 'light');

  }, [mode]); // Rerun effect when mode changes

  // Render diagram function using mermaid API
  const renderDiagram = async () => {
    if (!outputDivRef.current || !mermaidCode) return;

    setLoading(true);
    setError(null); // Clear previous errors
    outputDivRef.current.innerHTML = ''; // Clear previous diagram

    try {
      // Ensure mermaid is initialized (might be redundant but safe)
       mermaid.initialize({
         startOnLoad: false,
         theme: mode === 'light' ? 'default' : 'dark',
         securityLevel: 'loose',
       });
      const { svg } = await mermaid.render('mermaid-diagram', mermaidCode);
      outputDivRef.current.innerHTML = svg;
    } catch (err) {
      console.error('Mermaid rendering error:', err);
      const errorMessage = `Error rendering diagram: ${err.message || 'Invalid Mermaid syntax'}`;
      setError(errorMessage);
      // Display error message directly in the output area
      if (outputDivRef.current) {
         outputDivRef.current.innerHTML = `<div class="error-message">${errorMessage}</div>`;
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Editor Popup Handlers ---
  const handleOpenEditor = () => {
    setTempMermaidCode(mermaidCode); // Load current code into temp state
    setShowEditorPopup(true);
  };

  const handleCloseEditorPopup = () => {
    setShowEditorPopup(false);
  };

  const handleSaveEditorPopup = () => {
    setMermaidCode(tempMermaidCode); // Save code from temp state
    setShowEditorPopup(false);
    renderDiagram(); // Re-render the diagram with the updated code
  };

  // --- Diagram Popup (Preview) Handlers ---
   const handleOpenDiagram = async () => {
    setError(null); // Clear previous errors

    // Ensure the diagram exists in the main output area
    if (!outputDivRef.current?.querySelector('svg')) {
       // If not rendered yet, try rendering it first
       await renderDiagram();
       // Check again after attempting render
       if (!outputDivRef.current?.querySelector('svg')) {
         setError("Failed to generate diagram for preview. Render it first.");
         return; // Exit if still no SVG
       }
    }

    // Get the SVG content from the main output
    const svgContent = outputDivRef.current.innerHTML;
    setPreviewSvgContent(svgContent); // Set content for the popup
    setShowDiagramPopup(true); // Show the popup
  };

  const handleCloseDiagram = () => {
    setShowDiagramPopup(false);
    setDiagramZoom(1); // Reset zoom on close
  };

  // --- Zoom Handlers for Diagram Popup ---
  const handleZoomIn = () => {
    setDiagramZoom(prevZoom => Math.min(prevZoom + 0.1, 3)); // Max zoom 3x
  };

  const handleZoomOut = () => {
    setDiagramZoom(prevZoom => Math.max(prevZoom - 0.1, 0.1)); // Min zoom 0.1x
  };

  // --- Export and Copy Handlers (Using Utility Functions) ---
  const handleExportSvgClick = () => {
    exportSvg({ outputDivRef, setErrorMessage: setError });
  };

  const handleExportPngClick = () => {
    exportPng({
      outputDivRef,
      setErrorMessage: setError,
      imageWidth,  // Pass state values
      imageHeight, // Pass state values
      imageScale   // Pass state values
    });
  };

  const handleCopyImageClick = () => {
    copyImageToClipboard({ outputDivRef, setErrorMessage: setError });
  };


  return (
    <SaltProvider mode={mode}>
      <div className={`app-container ${mode}`}> {/* Apply mode class */}
        <header className="app-header">
          <div className="app-header-content">
            <h1>Mermaid Diagram Editor</h1>
            <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
              Toggle Theme ({mode})
            </button>
          </div>
        </header>

        <main className="container">
          <InputSection
            mermaidCode={mermaidCode}
            setMermaidCode={setMermaidCode}
            loading={loading}
            errorMessage={error} // Pass error state
            handleOpenEditor={handleOpenEditor}
            imageWidth={imageWidth}
            setImageWidth={setImageWidth}
            imageHeight={imageHeight}
            setImageHeight={setImageHeight}
            imageScale={imageScale}
            setImageScale={setImageScale}
            renderDiagram={renderDiagram} // Pass render function
          />

          <OutputSection
            outputDivRef={outputDivRef}
            handleExportSvg={handleExportSvgClick} // Use updated handler
            handleExportPng={handleExportPngClick} // Use updated handler
            handleOpenDiagram={handleOpenDiagram}
            handleCopyImage={handleCopyImageClick} // Use updated handler
            isLoading={loading} // Pass loading state
          />
        </main>

        {/* Diagram Preview Popup */}
        {showDiagramPopup && (
          <DiagramPopup
            svgContent={previewSvgContent} // Pass SVG content
            closeDiagramPopup={handleCloseDiagram}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleCopyImage={handleCopyImageClick} // Can reuse the main copy handler
            zoomLevel={diagramZoom}
          />
        )}

        {/* Mermaid Code Editor Popup */}
        {showEditorPopup && (
          <EditorPopup
            mermaidCode={tempMermaidCode}
            setMermaidCode={setTempMermaidCode} // Update temp code
            handleSavePopup={handleSaveEditorPopup}
            handleClosePopup={handleCloseEditorPopup}
          />
        )}
      </div>
    </SaltProvider>
  );
};

export default App;
