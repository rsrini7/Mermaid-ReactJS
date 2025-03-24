import React from 'react';
import { 
  FlexLayout, 
  FlexItem, 
  Text, 
  H3, 
  Input, 
  FormField 
} from '@salt-ds/core';

const ExportSettings = ({ 
  imageWidth,
  setImageWidth,
  imageHeight,
  setImageHeight,
  imageScale,
  setImageScale
}) => {
  return (
    <div className="resolution-settings">
      <H3>Export Settings</H3>
      <FlexLayout gap={2}>
        <FlexItem>
          <FormField label="Width:">
            <Input 
              type="number" 
              value={imageWidth} 
              onChange={(e) => setImageWidth(parseInt(e.target.value, 10))} 
              min={100} 
            />
          </FormField>
        </FlexItem>
        <FlexItem>
          <FormField label="Height:">
            <Input 
              type="number" 
              value={imageHeight} 
              onChange={(e) => setImageHeight(parseInt(e.target.value, 10))} 
              min={100} 
            />
          </FormField>
        </FlexItem>
        <FlexItem>
          <FormField label="Scale:">
            <Input 
              type="number" 
              value={imageScale} 
              onChange={(e) => setImageScale(parseFloat(e.target.value))} 
              min={1} 
              max={5} 
              step={0.5} 
            />
          </FormField>
        </FlexItem>
      </FlexLayout>
    </div>
  );
};

export default ExportSettings;