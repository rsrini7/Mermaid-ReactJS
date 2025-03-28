
import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './App.css';
import templates from './utils/mermaidTemplates.js';
import { SaltProvider } from '@salt-ds/core';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import DiagramPopup from './components/DiagramPopup';
import EditorPopup from './components/EditorPopup';

const App = () => {
  const [mermaidCode, setMermaidCode] = useState(templates.flowchart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDiagramPopup, setShowDiagramPopup] = useState(false);
  const [showEditorPopup, setShowEditorPopup] = useState(false);
  const [imageWidth, setImageWidth] = useState(800);
  const [imageHeight, setImageHeight] = useState(600);
  const [imageScale, setImageScale] = useState(1);
  const [mode, setMode] = useState('light');
  const [diagramZoom, setDiagramZoom] = useState(1);
  const [tempMermaidCode, setTempMermaidCode] = useState(mermaidCode);
  const [previewSvgContent, setPreviewSvgContent] = useState(''); // State for SVG content

  const outputDivRef = useRef(null);
  // diagramPreviewRef is now managed within DiagramPopup

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: mode === 'light' ? 'default' : 'dark',
      securityLevel: 'loose',
    });
  }, [mode]);

  const renderDiagram = async () => {
    if (!outputDivRef.current) return;
    
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      outputDivRef.current.innerHTML = ''; // Clear previous diagram
      
      const { svg } = await mermaid.render('mermaid-diagram', mermaidCode);
      outputDivRef.current.innerHTML = svg;
    } catch (err) {
      console.error('Mermaid rendering error:', err);
      setError(`Error rendering diagram: ${err.message}`);
      outputDivRef.current.innerHTML = `<div class="error-message">Error rendering diagram: ${err.message}</div>`; // Show error in output
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditor = () => {
    setTempMermaidCode(mermaidCode);
    setShowEditorPopup(true);
  };

  const handleCloseEditorPopup = () => {
    setShowEditorPopup(false);
  };

  const handleSaveEditorPopup = () => {
    setMermaidCode(tempMermaidCode);
    setShowEditorPopup(false);
    // Optionally, re-render the diagram after saving changes from the editor
    // renderDiagram(); 
  };

  const handleOpenDiagram = async () => {
    setError(null); // Clear previous errors

    // Ensure the diagram is rendered in the main output area first
    if (!outputDivRef.current?.querySelector('svg')) {
      await renderDiagram(); // Render if not present
      // Check again after attempting to render
      if (!outputDivRef.current?.querySelector('svg')) {
        setError("Failed to generate diagram for preview.");
        return;
      }
    }

    // Get the SVG content from the main output
    const svgContent = outputDivRef.current.innerHTML;

    // Set the SVG content for the popup and show it
    setPreviewSvgContent(svgContent);
    setShowDiagramPopup(true);
  };

  const handleCloseDiagram = () => {
    setShowDiagramPopup(false);
    setDiagramZoom(1);
  };

  const handleZoomIn = () => {
    setDiagramZoom(prevZoom => Math.min(prevZoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    setDiagramZoom(prevZoom => Math.max(prevZoom - 0.1, 0.1));
  };

  const handleExportSvg = () => {
    if (!outputDivRef.current || !outputDivRef.current.querySelector('svg')) {
      setError("Please render the diagram first before exporting.");
      return;
    }
    setError(null);
    const svgContent = outputDivRef.current.innerHTML;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPng = async () => {
    if (!outputDivRef.current || !outputDivRef.current.querySelector('svg')) {
      setError("Please render the diagram first before exporting.");
      return;
    }
    setError(null);
    const svg = outputDivRef.current.querySelector('svg');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Use the dimensions from the SVG if available, otherwise fallback
    const svgWidth = svg.getAttribute('width');
    const svgHeight = svg.getAttribute('height');
    const targetWidth = (svgWidth ? parseFloat(svgWidth) : imageWidth) * imageScale;
    const targetHeight = (svgHeight ? parseFloat(svgHeight) : imageHeight) * imageScale;

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const link = document.createElement('a');
      link.download = 'diagram.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(url);
    };

    img.onerror = (err) => {
      console.error("Error loading SVG image for PNG export:", err);
      setError("Error exporting PNG. Could not load SVG image.");
      URL.revokeObjectURL(url);
    }
    
    img.src = url;
  };

  const handleCopyImage = async () => {
     if (!outputDivRef.current || !outputDivRef.current.querySelector('svg')) {
      setError("Please render the diagram first before copying.");
      return;
    }
    setError(null);
    const svg = outputDivRef.current.querySelector('svg');

    try {
      // For copying as image (bitmap) to clipboard
      const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = async () => {
          const canvas = document.createElement('canvas');
          // Use SVG dimensions if available for better quality
          const svgWidth = svg.getAttribute('width');
          const svgHeight = svg.getAttribute('height');
          canvas.width = svgWidth ? parseFloat(svgWidth) : img.width;
          canvas.height = svgHeight ? parseFloat(svgHeight) : img.height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob) => {
              try {
                  await navigator.clipboard.write([
                      new ClipboardItem({ 'image/png': blob })
                  ]);
                  console.log('Image copied to clipboard.');
              } catch (copyError) {
                  console.error('Failed to copy image blob:', copyError);
                  setError('Failed to copy image to clipboard.');
              } finally {
                  URL.revokeObjectURL(url); // Clean up object URL
              }
          }, 'image/png');
      };
      img.onerror = (err) => {
          console.error("Error loading SVG for copying:", err);
          setError("Error preparing image for copying.");
          URL.revokeObjectURL(url);
      }
      img.src = url;

    } catch (err) {
      console.error('Failed to copy image:', err);
      setError('Failed to copy image. Browser might not support Clipboard API for images.');
       // Fallback: copy SVG text
       try {
           const svgString = new XMLSerializer().serializeToString(svg);
           await navigator.clipboard.writeText(svgString);
           console.log('SVG code copied to clipboard as fallback.');
           // Optionally notify user that SVG code was copied instead
           // setError('Copied SVG code instead (image copy failed).'); 
       } catch (textErr) {
           console.error('Failed to copy SVG text:', textErr);
           setError('Failed to copy image or SVG text.');
       }
    }
  };

  return (
    <SaltProvider mode={mode}>
      <div className="app-container">
        <header className="app-header">
          <div className="app-header-content">
            <h1>Mermaid Diagram Editor</h1>
            {/* Basic theme toggle example */}
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
            errorMessage={error} // Pass error message to InputSection
            handleOpenEditor={handleOpenEditor}
            imageWidth={imageWidth}
            setImageWidth={setImageWidth}
            imageHeight={imageHeight}
            setImageHeight={setImageHeight}
            imageScale={imageScale}
            setImageScale={setImageScale}
            renderDiagram={renderDiagram}
          />
          
          <OutputSection 
            outputDivRef={outputDivRef}
            handleExportSvg={handleExportSvg}
            handleExportPng={handleExportPng}
            handleOpenDiagram={handleOpenDiagram}
            handleCopyImage={handleCopyImage}
            isLoading={loading} // Pass loading state
          />
        </main>
        
        {showDiagramPopup && (
          <DiagramPopup
            svgContent={previewSvgContent} // Pass SVG content as prop
            closeDiagramPopup={handleCloseDiagram}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleCopyImage={handleCopyImage} // Pass copy handler
            zoomLevel={diagramZoom}
          />
        )}
        
        {showEditorPopup && (
          <EditorPopup 
            mermaidCode={tempMermaidCode}
            setMermaidCode={setTempMermaidCode}
            handleSavePopup={handleSaveEditorPopup}
            handleClosePopup={handleCloseEditorPopup}
          />
        )}
      </div>
    </SaltProvider>
  );
};

export default App;
