import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './App.css';
import templates from './utils/mermaidTemplates.js';

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
  const [imageWidth, setImageWidth] = useState(1100);
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

  const handleTemplateChange = (e) => {
    const selectedTemplate = e.target.value;
    if (selectedTemplate && templates[selectedTemplate]) {
      if (outputDivRef.current) {
        outputDivRef.current.innerHTML = '';
      }
      
      const templateCode = templates[selectedTemplate];
      setMermaidCode(templateCode);
      
      setTimeout(() => {
        renderDiagramWithCode(templateCode);
      }, 50);
    }
  };

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
    setIsDiagramPopupOpen(true);
    
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
  
  const handleCopyImage = (svgElement) => {
    if (!svgElement) return;

    // Create a canvas element to draw the SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions with higher resolution
    const svgRect = svgElement.getBoundingClientRect();
    const scaleFactor = 2; // Increase resolution by 2x
    canvas.width = svgRect.width * scaleFactor;
    canvas.height = svgRect.height * scaleFactor;
    
    // Create an image from the SVG with proper namespaces
    const img = new Image();
    let svgData = new XMLSerializer().serializeToString(svgElement);
    
    // Ensure SVG has proper namespaces
    if (!svgData.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!svgData.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
      svgData = svgData.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    
    // Add width and height if not present
    if (!svgElement.hasAttribute('width')) {
      svgData = svgData.replace('<svg', `<svg width="${svgRect.width}"`);
    }
    if (!svgElement.hasAttribute('height')) {
      svgData = svgData.replace('<svg', `<svg height="${svgRect.height}"`);
    }
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Draw white background and the image with higher resolution
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scaleFactor, scaleFactor);
      ctx.drawImage(img, 0, 0);
      
      // Convert to blob with higher quality
      canvas.toBlob(blob => {
        try {
          // Create a ClipboardItem and write to clipboard
          const item = new ClipboardItem({ 'image/png': blob });
          navigator.clipboard.write([item])
            .then(() => {
              alert('High-resolution diagram copied to clipboard!');
            })
            .catch(err => {
              console.error('Failed to copy: ', err);
              alert('Failed to copy diagram. See console for details.');
            });
        } catch (err) {
          console.error('Clipboard API error: ', err);
          alert('Your browser may not support copying images to clipboard.');
        }
      }, 'image/png', 1.0); // Use maximum quality (1.0)
      
      // Clean up
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  const handleDiagramCopy = () => {
    const svgElement = diagramPreviewRef.current.querySelector('svg');
    handleCopyImage(svgElement);
  };

  const handleOutputCopy = () => {
    const svgElement = outputDivRef.current.querySelector('svg');
    if (!svgElement) {
      setErrorMessage('No diagram to copy. Please render a diagram first.');
      return;
    }
    handleCopyImage(svgElement);
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
          exportSvg={exportSvg}
          exportPng={exportPng}
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
  );
};

export default App;