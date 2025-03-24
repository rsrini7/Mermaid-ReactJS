import React from 'react';
import { 
  Button, 
  FlexLayout, 
  FlexItem, 
  H2, 
  Panel 
} from '@salt-ds/core';

const OutputSection = ({ 
  outputDivRef, 
  exportSvg, 
  exportPng, 
  openDiagramWindow, 
  handleCopyImage 
}) => {
  return (
    <div className="output-section">
      <FlexLayout direction="column" gap={2}>
        <FlexItem>
          <FlexLayout align="center" justify="space-between">
            <H2>Rendered Diagram</H2>
            <FlexLayout gap={1}>
              <Button onClick={handleCopyImage}>Copy Image</Button>
              <Button onClick={exportSvg}>Export as SVG</Button>
              <Button onClick={exportPng}>Export as PNG</Button>
              <Button onClick={openDiagramWindow} variant="primary">Open Diagram</Button>
            </FlexLayout>
          </FlexLayout>
        </FlexItem>
        
        <FlexItem>
          <Panel className="mermaid-output" ref={outputDivRef}></Panel>
        </FlexItem>
      </FlexLayout>
    </div>
  );
};

export default OutputSection;