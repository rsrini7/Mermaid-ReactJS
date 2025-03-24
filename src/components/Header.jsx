import React from 'react';
import { 
  FlexLayout, 
  FlexItem, 
  Text, 
  H1, 
  Switch,
  FormField,
  StackLayout
} from '@salt-ds/core';

const Header = ({ theme, handleThemeToggle, handleTemplateChange }) => {
  return (
    <header className="app-header" style={{ padding: '16px 0', borderBottom: '1px solid var(--salt-separable-borderColor)' }}>
      <FlexLayout align="center" justify="space-between">
        <FlexItem>
          <H1 styleAs="h2">Mermaid Diagram Generator</H1>
        </FlexItem>
        <FlexItem>
          <FlexLayout align="center" gap={3}>
            <FlexItem>
              <FormField label="Select Template:" labelPlacement="left">
                <select 
                  className="template-select" 
                  onChange={handleTemplateChange}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '4px', 
                    border: '1px solid var(--salt-container-borderColor)',
                    backgroundColor: 'var(--salt-container-primary-background)',
                    color: 'var(--salt-text-primary-foreground)',
                    height: '36px',
                    minWidth: '180px'
                  }}
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
              </FormField>
            </FlexItem>
            <FlexItem>
              <StackLayout direction="horizontal" gap={1} align="center">
                <Text styleAs="label">Light</Text>
                <Switch
                  checked={theme === 'dark'}
                  onChange={handleThemeToggle}
                  label="Theme toggle"
                  hideLabel
                />
                <Text styleAs="label">Dark</Text>
              </StackLayout>
            </FlexItem>
          </FlexLayout>
        </FlexItem>
      </FlexLayout>
    </header>
  );
};

export default Header;