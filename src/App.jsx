import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './App.css';
import templates from './utils/mermaidTemplates.js';
import { 
  renderDiagramWithCode, 
  exportSvg, 
  exportPng, 
  copyImageToClipboard 
} from './utils/diagramUtils.js';

// Import Salt Design System
import { SaltProvider } from '@salt-ds/core';
import { Button } from '@salt-ds/core';

// Import components
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import EditorPopup from './components/EditorPopup';
import DiagramPopup from './components/DiagramPopup';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [mermaidCode, setMermaidCode] = useState(templates.flowchart);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagramScale, setDiagramScale] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDiagramPopupOpen, setIsDiagramPopupOpen] = useState(false);
  const [imageWidth, setImageWidth] = useState(1200);
  const [imageHeight, setImageHeight] = useState(1000);
  const [imageScale, setImageScale] = useState(1);

  const outputDivRef = useRef(null);
  const diagramPreviewRef = useRef(null);

  // Initialize mermaid and handle theme changes
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

  // Initial render
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose'
    });
    
    const timer = setTimeout(() => {
      renderDiagram();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // In the handleTemplateChange function
  const handleTemplateChange = (e) => {
    const selectedTemplate = e.target.value;
    if (selectedTemplate && templates[selectedTemplate]) {
      if (outputDivRef.current) {
        outputDivRef.current.innerHTML = '';
      }
      
      const templateCode = templates[selectedTemplate];
      setMermaidCode(templateCode);
      
      // Add a small delay to ensure state is updated before rendering
      setTimeout(() => {
        renderDiagramWithCode({
          code: templateCode,
          outputDivRef,
          setLoading,
          setErrorMessage,
          mermaid
        });
      }, 100); // Increased timeout for more complex diagrams
    }
  };

  const renderDiagram = () => {
    renderDiagramWithCode({
      code: mermaidCode,
      outputDivRef,
      setLoading,
      setErrorMessage,
      mermaid
    });
  };

  const handleExportSvg = () => {
    exportSvg({
      outputDivRef,
      setErrorMessage
    });
  };

  const handleExportPng = () => {
    exportPng({
      outputDivRef,
      setErrorMessage,
      imageWidth,
      imageHeight,
      imageScale
    });
  };

  const openDiagramWindow = () => {
    setIsDiagramPopupOpen(true);
    
    // Use a slightly longer timeout to ensure the component is mounted
    setTimeout(() => {
      if (diagramPreviewRef.current && outputDivRef.current) {
        const currentDiagram = outputDivRef.current.innerHTML;
        if (currentDiagram) {
          diagramPreviewRef.current.innerHTML = `<div class="diagram-container" style="transform: scale(${diagramScale}); transform-origin: center top;">${currentDiagram}</div>`;
        } else {
          console.error("No diagram content found to display");
        }
      } else {
        console.error("Reference to diagram preview or output div is null");
      }
    }, 100);
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

  const handleDiagramCopy = () => {
    const svgElement = diagramPreviewRef.current.querySelector('svg');
    copyImageToClipboard(svgElement);
  };

  const handleOutputCopy = () => {
    const svgElement = outputDivRef.current.querySelector('svg');
    if (!svgElement) {
      setErrorMessage('No diagram to copy. Please render a diagram first.');
      return;
    }
    copyImageToClipboard(svgElement);
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

  const closeDiagramPopup = () => {
    setIsDiagramPopupOpen(false);
  };

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (isPopupOpen) {
          handleClosePopup();
        }
        if (isDiagramPopupOpen) {
          closeDiagramPopup();
        }
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPopupOpen, isDiagramPopupOpen]);

  return (
    <SaltProvider mode={theme}>
      <div className="app-container" data-theme={theme}>
        <Header 
          theme={theme} 
          handleThemeToggle={handleThemeToggle} 
          handleTemplateChange={handleTemplateChange} 
        />

        <div className="container">
          <InputSection 
            mermaidCode={mermaidCode}
            setMermaidCode={setMermaidCode}
            renderDiagram={renderDiagram}
            handleOpenPopup={handleOpenPopup}
            loading={loading}
            errorMessage={errorMessage}
            imageWidth={imageWidth}
            setImageWidth={setImageWidth}
            imageHeight={imageHeight}
            setImageHeight={setImageHeight}
            imageScale={imageScale}
            setImageScale={setImageScale}
          />

          <OutputSection 
            outputDivRef={outputDivRef}
            exportSvg={handleExportSvg}
            exportPng={handleExportPng}
            openDiagramWindow={openDiagramWindow}
            handleCopyImage={handleOutputCopy}
          />
        </div>

        {isPopupOpen && (
          <EditorPopup 
            mermaidCode={mermaidCode}
            setMermaidCode={setMermaidCode}
            handleSavePopup={handleSavePopup}
            handleClosePopup={handleClosePopup}
          />
        )}

        {isDiagramPopupOpen && (
          <DiagramPopup 
            diagramPreviewRef={diagramPreviewRef}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            closeDiagramPopup={closeDiagramPopup}
            handleCopyImage={handleDiagramCopy}
          />
        )}
      </div>
    </SaltProvider>
  );
};

export default App;