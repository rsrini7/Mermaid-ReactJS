import React, { useEffect } from 'react';
import { 
  Button, 
  FlexLayout, 
  FlexItem, 
  H2, 
  Panel, 
  Dialog
} from '@salt-ds/core';

const DiagramPopup = ({ 
  diagramPreviewRef, 
  handleZoomIn, 
  handleZoomOut, 
  closeDiagramPopup, 
  handleCopyImage 
}) => {
  // Make sure the diagram is properly displayed when the component mounts
  useEffect(() => {
    if (diagramPreviewRef.current) {
      // Force a repaint of the SVG content
      const svgContent = diagramPreviewRef.current.innerHTML;
      diagramPreviewRef.current.innerHTML = svgContent;
    }
  }, [diagramPreviewRef]);

  return (
    <Dialog 
      open 
      onClose={closeDiagramPopup}
      className="diagram-popup"
    >
      <FlexLayout direction="column" gap={2} className="diagram-popup-content">
        <FlexItem>
          <FlexLayout justify="space-between" align="center" style={{ marginBottom: '16px' }}>
            <H2>Diagram Preview</H2>
            <FlexLayout gap={2}>
              <Button onClick={handleZoomIn} appearance="solid" sentiment="positive">+</Button>
              <Button onClick={handleZoomOut} appearance="solid" sentiment="negative">−</Button>
              <Button onClick={handleCopyImage} appearance="solid" sentiment="neutral">Copy Image</Button>
              <Button onClick={closeDiagramPopup} appearance="solid" sentiment="neutral">Close</Button>
            </FlexLayout>
          </FlexLayout>
        </FlexItem>
        
        <FlexItem>
          <div className="diagram-container-wrapper">
            <Panel 
              className="diagram-preview" 
              ref={diagramPreviewRef}
            ></Panel>
          </div>
        </FlexItem>
      </FlexLayout>
    </Dialog>
  );
};

export default DiagramPopup;