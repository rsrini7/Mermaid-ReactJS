// Type definitions for diagramUtils module
declare module 'diagramUtils' {
  interface ExportSvgParams {
    outputDivRef: React.RefObject<HTMLDivElement>;
    setErrorMessage: (message: string) => void;
  }

  interface ExportPngParams {
    outputDivRef: React.RefObject<HTMLDivElement>;
    setErrorMessage: (message: string) => void;
    imageWidth?: number;
    imageHeight?: number;
    imageScale?: number;
  }

  export function exportSvg(params: ExportSvgParams): void;
  export function exportPng(params: ExportPngParams): void;
  export function copyImageToClipboard(params: ExportSvgParams): Promise<void>;
  
}