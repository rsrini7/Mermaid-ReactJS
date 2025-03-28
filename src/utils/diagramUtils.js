/**
 * Utility functions for diagram operations
 */

/**
 * Renders a diagram with the provided mermaid code
 * @param {Object} params - Parameters for rendering
 * @param {string} params.code - Mermaid syntax code
 * @param {Object} params.outputDivRef - Reference to output div
 * @param {Function} params.setLoading - Function to set loading state
 * @param {Function} params.setErrorMessage - Function to set error message
 * @param {Object} params.mermaid - Mermaid library instance
 */
export const renderDiagramWithCode = ({ code, outputDivRef, setLoading, setErrorMessage, mermaid }) => {
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

/**
 * Exports the diagram as SVG
 * @param {Object} params - Parameters for export
 * @param {Object} params.outputDivRef - Reference to output div
 * @param {Function} params.setErrorMessage - Function to set error message
 * @returns {void}
 */
export const exportSvg = ({ outputDivRef, setErrorMessage }) => {
  const svgElement = outputDivRef.current.querySelector('svg');

  if (!svgElement) {
    setErrorMessage('No diagram to export. Please render a diagram first.');
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  downloadFile(blob, 'mermaid-diagram.svg');
};

/**
 * Exports the diagram as PNG
 * @param {Object} params - Parameters for export
 * @param {Object} params.outputDivRef - Reference to output div
 * @param {Function} params.setErrorMessage - Function to set error message
 * @param {number} params.imageWidth - Width of the image
 * @param {number} params.imageHeight - Height of the image
 * @param {number} params.imageScale - Scale factor for the image
 * @returns {void}
 */
export const exportPng = ({ outputDivRef, setErrorMessage, imageWidth, imageHeight, imageScale }) => {
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

/**
 * Downloads a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The name of the file
 */
export const downloadFile = (blob, filename) => {
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);
};

/**
 * Copies the diagram to clipboard
 * @param {SVGElement} svgElement - The SVG element to copy
 * @returns {void}
 */
export const copyImageToClipboard = (svgElement) => {
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
