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
    img.crossOrigin = 'anonymous'; // Add this to handle CORS

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

        // Use a different approach to avoid the tainted canvas issue
        canvas.toDataURL('image/png', 1.0);
        
        // Convert data URL to blob
        const pngDataUrl = canvas.toDataURL('image/png');
        fetch(pngDataUrl)
          .then(res => res.blob())
          .then(blob => {
            downloadFile(blob, 'mermaid-diagram.png');
          })
          .catch(err => {
            setErrorMessage(`Error creating PNG: ${err.message}`);
          });
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
  
  try {
    // Get SVG data with proper namespaces
    let svgData = new XMLSerializer().serializeToString(svgElement);
    
    // Ensure SVG has proper namespaces
    if (!svgData.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    // Create a Blob from the SVG data
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    
    // Use the Clipboard API to write the SVG as an image
    if (navigator.clipboard && navigator.clipboard.write) {
      const clipboardItem = new ClipboardItem({
        'image/svg+xml': svgBlob
      });
      
      navigator.clipboard.write([clipboardItem])
        .then(() => {
          alert('Diagram copied to clipboard!');
        })
        .catch(err => {
          console.error('Clipboard API error: ', err);
          fallbackCopyMethod(svgData);
        });
    } else {
      fallbackCopyMethod(svgData);
    }
  } catch (err) {
    console.error('Copy error: ', err);
    alert('Failed to copy diagram to clipboard.');
  }
};

/**
 * Fallback method for copying SVG when Clipboard API is not available
 * @param {string} svgData - SVG data as string
 */
const fallbackCopyMethod = (svgData) => {
  try {
    // Create a textarea element to hold the SVG data
    const textarea = document.createElement('textarea');
    textarea.value = svgData;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    
    // Select the text and copy
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (successful) {
      alert('SVG code copied to clipboard! You can paste it into an SVG editor.');
    } else {
      alert('Failed to copy diagram to clipboard.');
    }
  } catch (err) {
    console.error('Fallback copy error: ', err);
    alert('Your browser does not support copying to clipboard.');
  }
};