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
    // Ensure mermaid is ready before rendering
    mermaid.initialize({
      startOnLoad: false, // We control rendering manually
      theme: document.body.classList.contains('dark') ? 'dark' : 'default', // Example theme check
      securityLevel: 'loose', // Important for allowing complex rendering
    });

    mermaid.render('mermaid-svg', code).then(result => {
      if (outputDivRef.current) {
        outputDivRef.current.innerHTML = result.svg;
      }
      setLoading(false);
    }).catch(error => {
      console.error("Mermaid Render Error:", error);
      setErrorMessage(`Error: ${error.message || 'Invalid Mermaid syntax'}`);
      setLoading(false);
    });
  } catch (error) {
    console.error("Mermaid Init/Render Error:", error);
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
  const svgElement = outputDivRef.current?.querySelector('svg');

  if (!svgElement) {
    setErrorMessage('No diagram to export. Please render a diagram first.');
    return;
  }
  setErrorMessage(''); // Clear previous errors

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  downloadFile(blob, 'mermaid-diagram.svg');
};

/**
 * Basic SVG Sanitizer: Removes foreignObject elements
 * @param {string} svgString - The SVG string to sanitize
 * @returns {string} - Sanitized SVG string
 */
const sanitizeSvgString = (svgString) => {
  // Remove <foreignObject>...</foreignObject> tags and their content
  // This is a common cause of canvas tainting
  return svgString.replace(/<foreignObject[\s\S]*?<\/foreignObject>/g, '');
};

/**
 * Exports the diagram as PNG
 * @param {Object} params - Parameters for export
 * @param {Object} params.outputDivRef - Reference to output div
 * @param {Function} params.setErrorMessage - Function to set error message
 * @param {number} params.imageWidth - Desired width (used if SVG has no width)
 * @param {number} params.imageHeight - Desired height (used if SVG has no height)
 * @param {number} params.imageScale - Scale factor for the image
 * @returns {void}
 */
export const exportPng = ({ outputDivRef, setErrorMessage, imageWidth, imageHeight, imageScale }) => {
  const svgElement = outputDivRef.current?.querySelector('svg');

  if (!svgElement) {
    setErrorMessage('No diagram to export. Please render a diagram first.');
    return;
  }
  setErrorMessage(''); // Clear previous errors

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Get dimensions from SVG, fallback to state, apply scale
    const svgRect = svgElement.getBoundingClientRect();
    const svgNaturalWidth = svgElement.width?.baseVal?.value || svgRect.width || imageWidth;
    const svgNaturalHeight = svgElement.height?.baseVal?.value || svgRect.height || imageHeight;

    const targetWidth = svgNaturalWidth * imageScale;
    const targetHeight = svgNaturalHeight * imageScale;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Serialize and sanitize SVG
    let svgData = new XMLSerializer().serializeToString(svgElement);
    svgData = sanitizeSvgString(svgData); // *** ADDED SANITIZATION STEP ***

     // Ensure necessary namespaces for rendering in image/canvas
    if (!svgData.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    // Add width/height attributes if missing, using calculated natural size
    if (!svgElement.hasAttribute('width') && !svgData.includes('width=')) {
       svgData = svgData.replace('<svg', `<svg width="${svgNaturalWidth}"`);
    }
     if (!svgElement.hasAttribute('height') && !svgData.includes('height=')) {
       svgData = svgData.replace('<svg', `<svg height="${svgNaturalHeight}"`);
    }

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Draw white background first
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw the potentially sanitized SVG image onto the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url); // Clean up blob URL

      // Convert canvas to PNG Blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          downloadFile(blob, 'mermaid-diagram.png');
        } else {
          setErrorMessage('Failed to create PNG blob. The diagram might be too complex or browser issue.');
        }
      }, 'image/png');
    };

    img.onerror = (error) => {
      console.error("Image load error for PNG export:", error);
      setErrorMessage('Error loading sanitized SVG image for PNG conversion. Check console.');
      URL.revokeObjectURL(url); // Clean up blob URL
    };

    img.src = url;

  } catch (error) {
    console.error("PNG Export Error:", error);
    setErrorMessage(`Error exporting PNG: ${error.message}`);
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
  // Revoke URL after a short delay to ensure download starts
  setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);
};

/**
 * Copies the diagram image to clipboard as PNG
 * @param {Object} params - Parameters
 * @param {Object} params.outputDivRef - Reference to output div
 * @param {Function} params.setErrorMessage - Function to set error message
 * @returns {Promise<void>}
 */
export const copyImageToClipboard = async ({ outputDivRef, setErrorMessage }) => {
  const svgElement = outputDivRef.current?.querySelector('svg');

  if (!svgElement) {
    setErrorMessage('No diagram to copy. Please render a diagram first.');
    return;
  }
  setErrorMessage(''); // Clear previous errors

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Use higher resolution for copy
    const scaleFactor = 2;
    const svgRect = svgElement.getBoundingClientRect();
    const svgNaturalWidth = svgElement.width?.baseVal?.value || svgRect.width || 800; // Default fallback width
    const svgNaturalHeight = svgElement.height?.baseVal?.value || svgRect.height || 600; // Default fallback height

    canvas.width = svgNaturalWidth * scaleFactor;
    canvas.height = svgNaturalHeight * scaleFactor;

    // Serialize and sanitize SVG
    let svgData = new XMLSerializer().serializeToString(svgElement);
    svgData = sanitizeSvgString(svgData); // *** ADDED SANITIZATION STEP ***

    // Ensure necessary namespaces
    if (!svgData.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    // Add width/height attributes if missing
    if (!svgElement.hasAttribute('width') && !svgData.includes('width=')) {
       svgData = svgData.replace('<svg', `<svg width="${svgNaturalWidth}"`);
    }
     if (!svgElement.hasAttribute('height') && !svgData.includes('height=')) {
       svgData = svgData.replace('<svg', `<svg height="${svgNaturalHeight}"`);
    }

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    await new Promise((resolve, reject) => {
      img.onload = () => {
        // Draw white background and scaled image
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url); // Clean up blob URL

        // Convert canvas to blob for clipboard
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob for clipboard.'));
            return;
          }
          try {
            // Use Clipboard API to write the blob
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            console.log('Diagram image copied to clipboard.');
            // Optionally show a success message to the user via state update if needed
            resolve();
          } catch (clipboardError) {
            console.error('Clipboard API error:', clipboardError);
            reject(new Error('Failed to copy image to clipboard. Check browser permissions or support.'));
          }
        }, 'image/png'); // Specify PNG format
      };

      img.onerror = (error) => {
        console.error("Image load error for clipboard copy:", error);
        URL.revokeObjectURL(url); // Clean up blob URL
        reject(new Error('Error loading sanitized SVG image for copying.'));
      };
      img.crossOrigin = "anonymous";
      img.src = url;
    });

  } catch (error) {
    console.error("Copy Image Error:", error);
    setErrorMessage(error.message || 'Failed to copy image.');

    // Fallback: Try copying SVG text if image copy fails
    try {
        let svgString = new XMLSerializer().serializeToString(svgElement);
        svgString = sanitizeSvgString(svgString); // Sanitize fallback text too
        await navigator.clipboard.writeText(svgString);
        console.log('Sanitized SVG code copied to clipboard as fallback.');
        setErrorMessage('Failed to copy as image, copied sanitized SVG code instead.');
    } catch (textErr) {
        console.error('Failed to copy SVG text as fallback:', textErr);
        setErrorMessage('Failed to copy image or SVG text.'); // Keep the more specific error if available
    }
  }
};
