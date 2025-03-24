import React from 'react';
import { 
  Button, 
  FlexLayout, 
  FlexItem, 
  Text, 
  H1, 
  Switch
} from '@salt-ds/core';

const Header = ({ theme, handleThemeToggle, handleTemplateChange }) => {
  return (
    <header className="app-header">
      <FlexLayout align="center" justify="space-between">
        <FlexItem>
          <H1>Mermaid Diagram Generator</H1>
        </FlexItem>
        <FlexItem>
          <FlexLayout align="center" gap={2}>
            <FlexItem>
              <Text>Select Template:</Text>
              <select 
                className="template-select" 
                onChange={handleTemplateChange}
                style={{ padding: '8px', borderRadius: '4px', marginLeft: '8px' }}
              >
                <option value="flowchart">Flowchart</option>
                <option value="sequenceDiagram">Sequence Diagram</option>
                <option value="classDiagram">Class Diagram</option>
                <option value="stateDiagram">State Diagram</option>
                <option value="entityRelationshipDiagram">Entity Relationship</option>
                <option value="gantt">Gantt Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="gitGraph">Git Graph</option>
              </select>
            </FlexItem>
            <FlexItem>
              <FlexLayout align="center" gap={1}>
                <Text>Light</Text>
                <Switch
                  checked={theme === 'dark'}
                  onChange={handleThemeToggle}
                  label="Theme"
                  hideLabel
                />
                <Text>Dark</Text>
              </FlexLayout>
            </FlexItem>
          </FlexLayout>
        </FlexItem>
      </FlexLayout>
    </header>
  );
};

export default Header;