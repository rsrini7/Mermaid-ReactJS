import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './App.css';
import templates from './utils/mermaidTemplates.js';
import { SaltProvider } from '@salt-ds/core';
import InputSection from './components/inputsection';
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
  
  const outputDivRef = useRef(null);
  const diagramPreviewRef = useRef(null);

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
      setError(null);
      outputDivRef.current.innerHTML = '';
      
      const { svg } = await mermaid.render('mermaid-diagram', mermaidCode);
      outputDivRef.current.innerHTML = svg;
    } catch (err) {
      console.error('Mermaid rendering error:', err);
      setError(`Error rendering diagram: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditor = () => {
    setShowEditorPopup(true);
  };

  const handleCloseEditor = () => {
    setShowEditorPopup(false);
  };

  const handleSaveEditor = (code) => {
    setMermaidCode(code);
    setShowEditorPopup(false);
  };

  const handleOpenDiagram = () => {
    if (diagramPreviewRef.current && outputDivRef.current) {
      diagramPreviewRef.current.innerHTML = outputDivRef.current.innerHTML;
      setShowDiagramPopup(true);
    }
  };

  const handleCloseDiagram = () => {
    setShowDiagramPopup(false);
  };

  const handleExportSvg = () => {
    if (!outputDivRef.current) return;
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
    if (!outputDivRef.current) return;
    const svg = outputDivRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = imageWidth * imageScale;
    canvas.height = imageHeight * imageScale;
    
    const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const link = document.createElement('a');
      link.download = 'diagram.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  const handleCopyImage = async () => {
    if (!outputDivRef.current) return;
    const svg = outputDivRef.current.querySelector('svg');
    if (!svg) return;

    try {
      const svgString = new XMLSerializer().serializeToString(svg);
      await navigator.clipboard.writeText(svgString);
    } catch (err) {
      console.error('Failed to copy image:', err);
    }
  };

  return (
    <SaltProvider mode={mode}>
      <div className="app-container">
        <header className="app-header">
          <div className="app-header-content">
            <h1>Mermaid Diagram Editor</h1>
          </div>
        </header>
        
        <main className="container">
          <InputSection 
            mermaidCode={mermaidCode}
            setMermaidCode={setMermaidCode}
            loading={loading}
            error={error}
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
          />
        </main>
        
        {showDiagramPopup && (
          <DiagramPopup 
            diagramPreviewRef={diagramPreviewRef}
            handleClose={handleCloseDiagram}
            handleCopyImage={handleCopyImage}
          />
        )}
        
        {showEditorPopup && (
          <EditorPopup 
            mermaidCode={mermaidCode}
            handleSave={handleSaveEditor}
            handleClose={handleCloseEditor}
          />
        )}
      </div>
    </SaltProvider>
  );
};

export default App;
