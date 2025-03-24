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
    <Dialog open onClose={closeDiagramPopup}>
      <FlexLayout direction="column" gap={2}>
        <FlexItem>
          <FlexLayout justify="space-between" align="center">
            <H2>Diagram Preview</H2>
            <FlexLayout gap={1}>
              <Button onClick={handleZoomIn} variant="secondary">+</Button>
              <Button onClick={handleZoomOut} variant="secondary">−</Button>
              <Button onClick={handleCopyImage} variant="secondary">Copy Image</Button>
              <Button onClick={closeDiagramPopup} variant="secondary">Close</Button>
            </FlexLayout>
          </FlexLayout>
        </FlexItem>
        
        <FlexItem>
          <div className="diagram-container-wrapper">
            <Panel 
              className="diagram-preview" 
              ref={diagramPreviewRef}
              style={{ 
                minHeight: '400px', 
                overflow: 'auto', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            ></Panel>
          </div>
        </FlexItem>
      </FlexLayout>
    </Dialog>
  );
};

export default DiagramPopup;