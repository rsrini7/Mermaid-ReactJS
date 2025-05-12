/**
 * Utility functions for diagram operations
 */

interface RenderDiagramParams {
  code: string;
  outputDivRef: React.RefObject<HTMLDivElement>;
  setLoading: (loading: boolean) => void;
  setErrorMessage: (message: string) => void;
  mermaid: typeof import('mermaid');
}

/**
 * Renders a diagram with the provided mermaid code
 */
export const renderDiagramWithCode = ({ code, outputDivRef, setLoading, setErrorMessage, mermaid }: RenderDiagramParams) => {
  setLoading(true);
  setErrorMessage('');

  try {
    // Ensure mermaid is ready before rendering
    mermaid.default.initialize({
      startOnLoad: false, // We control rendering manually
      theme: document.body.classList.contains('dark') ? 'dark' : 'default', // Example theme check
      securityLevel: 'loose', // Important for allowing complex rendering
    });

    new Promise<void>((resolve) => {
      mermaid.default.render('mermaid-svg', code).then(result => {
        if (outputDivRef.current) {
          outputDivRef.current.innerHTML = result.svg;
        }
        setLoading(false);
        resolve();
      }).catch((error: unknown) => {
        console.error("Mermaid Render Error:", error);
        setErrorMessage(`Error: ${error instanceof Error ? error.message : 'Invalid Mermaid syntax'}`);
        setLoading(false);
        resolve();
      });
    });
  } catch (error: unknown) {
    console.error("Mermaid Init/Render Error:", error);
    setErrorMessage(`Error: ${error instanceof Error ? error.message : 'Invalid Mermaid syntax'}`);
    setLoading(false);
  }
};

interface ExportSvgParams {
  outputDivRef: React.RefObject<HTMLDivElement>;
  setErrorMessage: (message: string) => void;
}

/**
 * Exports the diagram as SVG
 */
export const exportSvg = ({ outputDivRef, setErrorMessage }: ExportSvgParams) => {
  const svgElement = outputDivRef.current?.querySelector('svg') as SVGSVGElement | null;

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
 */
const sanitizeSvgString = (svgString: string): string => {
  // Remove <foreignObject>...</foreignObject> tags and their content
  // This is a common cause of canvas tainting
  return svgString.replace(/<foreignObject[\s\S]*?<\/foreignObject>/g, '');
};

interface ExportPngParams {
  outputDivRef: React.RefObject<HTMLDivElement>;
  setErrorMessage: (message: string) => void;
  imageWidth?: number;
  imageHeight?: number;
  imageScale?: number;
}

/**
 * Exports the diagram as PNG
 */
export const exportPng = ({ outputDivRef, setErrorMessage, imageWidth, imageHeight, imageScale }: ExportPngParams) => {
  if (!outputDivRef.current || !outputDivRef.current.querySelector('svg')) {
    setErrorMessage("Please render the diagram first before exporting.");
    return;
  }
  
  try {
    setErrorMessage('');
    const svg = outputDivRef.current.querySelector('svg') as SVGSVGElement | null;
    if (!svg) {
      setErrorMessage('Failed to access SVG element for export');
      return;
    }
    // Create a deep clone of the SVG to avoid modifying the original
    const svgClone = svg.cloneNode(true) as HTMLElement;
    
    // Apply computed styles to all elements in the SVG clone
    const allElements = (svgClone as HTMLElement).querySelectorAll('*') as NodeListOf<HTMLElement>;
    allElements.forEach((element: HTMLElement) => {
      if (element.nodeType === 1) { // Check if it's an element node
        const htmlElement = element as HTMLElement;
        const computedStyle = window.getComputedStyle(svg.querySelector(`[id="${element.id}"]`) || element as HTMLElement);
        const importantStyles = [
          'font-family', 'font-size', 'font-weight', 'fill', 'stroke', 
          'stroke-width', 'stroke-dasharray', 'opacity', 'text-anchor'
        ];
        
        importantStyles.forEach(style => {
          const value = computedStyle.getPropertyValue(style);
          if (value && value !== '') {
            htmlElement.style[style as any] = value;
          }
        });
      }
    });
    
    // Specifically handle text elements to ensure they render correctly
    (svgClone as HTMLElement).querySelectorAll('text').forEach((textEl: SVGTextElement) => {
      // Ensure text elements have font attributes
      if (!textEl.style.fontFamily && !textEl.getAttribute('font-family')) {
        textEl.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      }
      if (!textEl.style.fontSize && !textEl.getAttribute('font-size')) {
        textEl.setAttribute('font-size', '12px');
      }
      if (!textEl.style.fontWeight && !textEl.getAttribute('font-weight')) {
        textEl.setAttribute('font-weight', 'normal');
      }
      if (!textEl.style.fill && !textEl.getAttribute('fill')) {
        textEl.setAttribute('fill', '#000000');
      }
    });
    
    // Get the modified SVG data
    let svgData = new XMLSerializer().serializeToString(svgClone);
    
    // Ensure SVG has proper namespaces
    if (!svgData.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!svgData.includes('xmlns:xlink')) {
      svgData = svgData.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    
    // Add XML declaration for better rendering
    svgData = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgData;
    
    // Calculate dimensions - use the provided export settings
    // If SVG has dimensions, use them as a base, otherwise use the provided settings
    let svgWidth, svgHeight;
    if (!svg) {
      setErrorMessage('Failed to access SVG element for export');
      return;
    }
    const viewBox = svg.getAttribute('viewBox');
    if (viewBox) {
      const [, , vbWidth, vbHeight] = viewBox.split(' ').map(parseFloat);
      svgWidth = svg.getAttribute('width') || vbWidth;
      svgHeight = svg.getAttribute('height') || vbHeight;
    } else {
      svgWidth = svg.getAttribute('width') || svg.getBoundingClientRect().width;
      svgHeight = svg.getAttribute('height') || svg.getBoundingClientRect().height;
    }
    
    // Use the provided settings if available, otherwise use SVG dimensions
    const safeImageScale = imageScale || 1; // Default scale if undefined
    const svgWidthNum = typeof svgWidth === 'string' ? parseFloat(svgWidth) : svgWidth;
    const svgHeightNum = typeof svgHeight === 'string' ? parseFloat(svgHeight) : svgHeight;
    const targetWidth = Math.round((imageWidth || svgWidthNum) * safeImageScale);
    const targetHeight = Math.round((imageHeight || svgHeightNum) * safeImageScale);
    
    // Ensure numeric values are converted to strings for SVG attributes
    const svgWidthStr = svgWidth ? svgWidth.toString() : '';
    const svgHeightStr = svgHeight ? svgHeight.toString() : '';
    
    // Explicitly set width/height in the SVG with proper type conversion
    const widthValue = imageWidth !== undefined ? String(imageWidth) : svgWidthStr;
    const heightValue = imageHeight !== undefined ? String(imageHeight) : svgHeightStr;
    
    if (svgData.includes('width=')) {
      svgData = svgData.replace(/width="[^"]*"/, `width="${widthValue}"`);
    } else {
      svgData = svgData.replace('<svg', `<svg width="${widthValue}"`);
    }
    
    if (svgData.includes('height=')) {
      svgData = svgData.replace(/height="[^"]*"/, `height="${heightValue}"`);
    } else {
      svgData = svgData.replace('<svg', `<svg height="${heightValue}"`);
    }
    
    // Use a data URL approach with proper encoding
    const svgUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    
    // Create image
    const img = new Image();
    
    img.onload = () => {
      // Create canvas with the right dimensions
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { alpha: true })!;
      
      // Draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text rendering options for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.textRendering = 'optimizeLegibility';
      
      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      try {
        // Use toDataURL for better compatibility
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'diagram.png';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (exportErr: unknown) {
        console.error('PNG export error:', exportErr);
        setErrorMessage("Failed to export PNG: " + (exportErr instanceof Error ? exportErr.message : 'Unknown error'));
      }
    };
    
    img.onerror = (err: unknown) => {
      console.error("Error loading SVG for PNG export:", err);
      setErrorMessage("Error exporting PNG. Could not load SVG image.");
    };
    
    img.src = svgUrl;
  } catch (err: any) {
    console.error('Failed to export PNG:', err);
    setErrorMessage('Failed to export PNG: ' + (err.message || 'Unknown error'));
  }
};

/**
 * Downloads a file
 * @param {Blob} blob - The blob to download
 * @param {string} filename - The name of the file
 */
export const downloadFile = (blob: Blob, filename: string) => {
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
export const copyImageToClipboard = async ({ outputDivRef, setErrorMessage }: { outputDivRef: React.RefObject<HTMLDivElement>, setErrorMessage: (message: string) => void }) => {
  const svgElement = outputDivRef.current?.querySelector('svg') as SVGSVGElement | null;

  if (!svgElement) {
    setErrorMessage('No diagram to copy. Please render a diagram first.');
    return;
  }
  setErrorMessage(''); // Clear previous errors

  try {
    // Create a deep clone of the SVG to avoid modifying the original
    const svgClone = svgElement.cloneNode(true);
    
    // Apply computed styles to all elements in the SVG clone
    const allElements = (svgClone as HTMLElement).querySelectorAll('*') as NodeListOf<HTMLElement>;
    allElements.forEach((element: HTMLElement) => {
      if (element.nodeType === 1) { // Check if it's an element node
        const htmlElement = element as HTMLElement;
        const computedStyle = window.getComputedStyle(svgElement.querySelector(`[id="${element.id}"]`) || element as HTMLElement);
        const importantStyles = [
          'font-family', 'font-size', 'font-weight', 'fill', 'stroke', 
          'stroke-width', 'stroke-dasharray', 'opacity', 'text-anchor'
        ];
        
        importantStyles.forEach(style => {
          const value = computedStyle.getPropertyValue(style);
          if (value && value !== '') {
            htmlElement.style[style as any] = value;
          }
        });
      }
    });
    
    // Specifically handle text elements to ensure they render correctly
    (svgClone as HTMLElement).querySelectorAll('text').forEach((textEl: SVGTextElement) => {
      // Ensure text elements have font attributes
      if (!textEl.style.fontFamily && !textEl.getAttribute('font-family')) {
        textEl.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      }
      if (!textEl.style.fontSize && !textEl.getAttribute('font-size')) {
        textEl.setAttribute('font-size', '12px');
      }
      if (!textEl.style.fontWeight && !textEl.getAttribute('font-weight')) {
        textEl.setAttribute('font-weight', 'normal');
      }
      if (!textEl.style.fill && !textEl.getAttribute('fill')) {
        textEl.setAttribute('fill', '#000000');
      }
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true })!;
    const img = new Image();

    // Use higher resolution for copy
    const scaleFactor = 2;
    const svgRect = svgElement.getBoundingClientRect();
    const svgNaturalWidth = svgElement.width?.baseVal?.value || svgRect.width || 800; // Default fallback width
    const svgNaturalHeight = svgElement.height?.baseVal?.value || svgRect.height || 600; // Default fallback height

    canvas.width = svgNaturalWidth * scaleFactor;
    canvas.height = svgNaturalHeight * scaleFactor;

    // Serialize SVG with proper styling
    let svgData = new XMLSerializer().serializeToString(svgClone);
    
    // Ensure SVG has proper namespaces
    if (!svgData.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!svgData.includes('xmlns:xlink')) {
      svgData = svgData.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    
    // Add XML declaration for better rendering
    svgData = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgData;
    
    // Explicitly set width/height in the SVG
    if (svgData.includes('width=')) {
      svgData = svgData.replace(/width="[^"]*"/, `width="${svgNaturalWidth}"`);
    } else {
      svgData = svgData.replace('<svg', `<svg width="${svgNaturalWidth}"`);
    }
    
    if (svgData.includes('height=')) {
      svgData = svgData.replace(/height="[^"]*"/, `height="${svgNaturalHeight}"`);
    } else {
      svgData = svgData.replace('<svg', `<svg height="${svgNaturalHeight}"`);
    }

    // Use a data URL approach with proper encoding
    const svgUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        // Draw white background and scaled image
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text rendering options for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.textRendering = 'optimizeLegibility';
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(svgUrl); // Clean up blob URL

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
        }, 'image/png', 1.0); // Specify PNG format with highest quality
      };

      img.onerror = (error) => {
        console.error("Image load error for clipboard copy:", error);
        URL.revokeObjectURL(svgUrl);
        reject(new Error('Failed to load SVG for clipboard copy.'));
      };

      img.src = svgUrl;
    });
  } catch (error: unknown) {
    console.error('Copy to clipboard error:', error);
    setErrorMessage(`Failed to copy diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
