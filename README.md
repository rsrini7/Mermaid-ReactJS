# Mermaid Diagram Generator & Editor

A modern React-based web application for creating, editing, and managing Mermaid diagrams with a rich set of features and an intuitive user interface.

## Features

### Core Diagram Functionality
- **Live Preview Rendering**: Real-time diagram rendering as you type
- **Template System**: Pre-built templates for various diagram types
- **Error Handling**: Clear error messages for invalid syntax
- **Responsive Design**: Works seamlessly across different screen sizes

### Available Templates
- **Flowcharts**:
  - Top-Down Flowchart
  - Left-Right Flowchart
  - Complex Flowchart with Subgraphs
- **Sequence Diagrams**:
  - Basic Sequence
  - Advanced Sequence with Notes
  - Sequence with Loops and Alt
- **Class Diagrams**:
  - Basic Class Relationships
  - Inheritance Examples
- **State Diagrams**:
  - Simple State Transitions
  - Composite States
- **Entity Relationship (ER) Diagrams**:
  - Database Schema Example
- **User Journey**:
  - Customer Experience Flow
- **Gantt Charts**:
  - Project Timeline Example
- **Pie Charts**:
  - Data Distribution
- **Git Graphs**:
  - Branch and Merge Visualization
- **Mind Maps**:
  - Hierarchical Structure
- **Timeline**:
  - Event Sequence
- **Quadrant Charts**:
  - Decision Matrix

### Editor Features
- **Dual Editing Modes**:
  - Quick edit in the main interface
  - Full-screen editor mode for detailed work
- **Syntax Highlighting**: Clear visualization of Mermaid syntax
- **Auto-save**: Preserves your work between sessions
- **Keyboard Shortcuts**: 
  - Escape key to close popups
  - Quick access to common functions

### Diagram Preview & Interaction
- **Interactive Preview Window**:
  - Zoom control with slider
  - Pan functionality for large diagrams
  - Reset zoom option
- **Full-screen Preview Mode**:
  - Enhanced viewing experience
  - Detailed examination of complex diagrams

### Export Capabilities
- **Multiple Export Formats**:
  - SVG export for vector graphics
  - PNG export with customizable settings
- **PNG Export Configuration**:
  - Adjustable dimensions (width/height)
  - Custom scale factor for high-resolution exports
  - Background color options

### Clipboard Operations
- **Copy Functions**:
  - Copy as SVG
  - Copy as PNG
- **Success Notifications**: Toast messages confirming successful operations

### Theme Support
- **Dynamic Theming**:
  - Light/Dark mode toggle
  - Theme persistence across sessions
- **Mermaid Theme Integration**:
  - Automatic diagram theme switching
  - Consistent UI experience

### User Experience
- **Loading States**: Visual feedback during operations
- **Error Handling**: 
  - Syntax error detection
  - Export error handling
  - Clear error messages
- **Accessibility Features**:
  - Keyboard navigation
  - Screen reader support
- **Responsive Layout**:
  - Adaptive design for all screen sizes
  - Mobile-friendly interface

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Technical Stack & Dependencies

### Core Dependencies
- **React** - Frontend framework
- **Mermaid.js** - Diagram generation library
- **Salt Design System** - UI component library
  - Core components
  - Theming support
  - Icon system
  - Lab components
- **TanStack Router** - React routing solution

### Development Dependencies
- **Build Tools**:
  - Webpack
  - Webpack CLI
  - Webpack Dev Server
- **Babel Configuration**:
  - Babel core and presets
  - React and environment presets
- **Testing Framework**:
  - Vitest
  - Jest
  - React Testing Library
  - JSDOM
- **Style Processing**:
  - CSS loaders and processors
- **TypeScript Support**:
  - TypeScript compiler
  - React type definitions
- **Asset Management**:
  - File and URL loaders

## Build Process

The project uses Webpack for bundling and building. Here's how the build process works:

### Development
```bash
npm start
```