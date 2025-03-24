import React from 'react';
import { 
  Button, 
  FlexLayout, 
  FlexItem, 
  H2, 
  Input, 
  MultilineInput, 
  Dialog
} from '@salt-ds/core';

const EditorPopup = ({ 
  mermaidCode, 
  setMermaidCode, 
  handleSavePopup, 
  handleClosePopup 
}) => {
  return (
    <Dialog open onClose={handleClosePopup}>
      <FlexLayout direction="column" gap={2}>
        <FlexItem>
          <H2>Edit Mermaid Syntax</H2>
        </FlexItem>
        
        <FlexItem>
          <MultilineInput
            className="editor-textarea"
            value={mermaidCode}
            onChange={(e) => setMermaidCode(e.target.value)}
            multiline
            rows={20}
          />
        </FlexItem>
        
        <FlexItem>
          <FlexLayout justify="flex-end" gap={1}>
            <Button onClick={handleClosePopup} variant="secondary">Close Without Saving</Button>
            <Button onClick={handleSavePopup} variant="primary">Save & Render</Button>
          </FlexLayout>
        </FlexItem>
      </FlexLayout>
    </Dialog>
  );
};

export default EditorPopup;