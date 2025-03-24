import React from 'react';
import { 
  Button, 
  FlexLayout, 
  FlexItem, 
  Text,
  MultilineInput,
  H2
} from '@salt-ds/core';
import ExportSettings from './ExportSettings';

const InputSection = ({ 
  mermaidCode, 
  setMermaidCode, 
  renderDiagram, 
  handleOpenPopup, 
  loading, 
  errorMessage,
  imageWidth,
  setImageWidth,
  imageHeight,
  setImageHeight,
  imageScale,
  setImageScale
}) => {
  return (
    <div className="input-section">
      <FlexLayout direction="column" gap={2}>
        <FlexItem>
          <FlexLayout align="center" justify="space-between">
            <H2>Mermaid Syntax</H2>
            <FlexLayout gap={1}>
              <Button onClick={renderDiagram} variant="primary">Render Diagram</Button>
              <Button onClick={handleOpenPopup}>Open Editor</Button>
            </FlexLayout>
          </FlexLayout>
        </FlexItem>
        
        <FlexItem>
          <MultilineInput
            className="mermaid-textarea"
            value={mermaidCode}
            onChange={(e) => setMermaidCode(e.target.value)}
            placeholder="Enter your Mermaid diagram syntax here..."
            multiline
            rows={10}
          />
        </FlexItem>
        
        <FlexItem>
          {loading && <Text emphasis="strong">Rendering...</Text>}
          {errorMessage && <Text styleAs="error">{errorMessage}</Text>}
        </FlexItem>
        
        <FlexItem>
          <ExportSettings
            imageWidth={imageWidth}
            setImageWidth={setImageWidth}
            imageHeight={imageHeight}
            setImageHeight={setImageHeight}
            imageScale={imageScale}
            setImageScale={setImageScale}
          />
        </FlexItem>
      </FlexLayout>
    </div>
  );
};

export default InputSection;