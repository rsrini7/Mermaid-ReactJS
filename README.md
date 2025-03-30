# Mermaid Diagram Generator & Editor

An interactive web application for creating, editing, and managing Mermaid diagrams with real-time preview and extensive template support.

## Features

### Core Functionality
- **Live Diagram Preview**: Real-time rendering as you type
- **Multiple Editing Modes**:
  - Quick edit in main interface
  - Full-screen editor mode
  - Syntax highlighting
- **Auto-save**: Preserves work between sessions
- **Keyboard Shortcuts**:
  - Escape key for closing popups
  - Quick access to common functions

### Export & Sharing
- **Multiple Export Formats**:
  - SVG export for vector graphics
  - PNG export with customizable settings
  - Configurable dimensions and scale
- **Clipboard Operations**:
  - Direct copy to clipboard (SVG/PNG)
  - Success notifications via toast messages

### User Interface
- **Theme Support**:
  - Light/Dark mode toggle
  - Theme persistence
  - Automatic diagram theme switching
- **Responsive Design**:
  - Mobile-friendly interface
  - Adaptive layout
- **Interactive Preview**:
  - Zoom slider control
  - Pan functionality
  - Reset view option

### Available Templates

#### Flow Diagrams
- **Flowcharts**:
  - Top-Down Flow (TD)
  - Left-Right Flow (LR)
  - Complex Flow with Subgraphs
  - Decision Trees
  - Process Flows

#### UML Diagrams
- **Sequence Diagrams**:
  - Basic Message Flow
  - Participant Groups
  - Notes and Comments
  - Loops and Alternative Paths
- **Class Diagrams**:
  - Class Relationships
  - Inheritance Structures
  - Interface Implementations
- **State Diagrams**:
  - State Transitions
  - Composite States
  - Entry/Exit Points

#### Business & Planning
- **Entity Relationship**:
  - Database Schemas
  - Relationship Types
- **Gantt Charts**:
  - Project Timelines
  - Task Dependencies
- **User Journey**:
  - Customer Flows
  - Experience Mapping
- **Pie Charts**:
  - Data Distribution
  - Statistics

#### Development & Organization
- **Git Graphs**:
  - Branch Management
  - Merge Visualization
- **Mind Maps**:
  - Hierarchical Structure
  - Concept Mapping
- **Timeline**:
  - Event Sequences
  - Historical Data
- **Quadrant Charts**:
  - Decision Matrices
  - Priority Mapping

## Technical Stack

### Core Dependencies
- React & React DOM
- Mermaid.js - Diagram generation library
- TanStack Router & Router DevTools - Routing solution

### Development Dependencies
- **Build System**:
  - Webpack
  - Webpack CLI
  - Webpack Dev Server
  - HTML Webpack Plugin
  - Babel Core & Presets
  - Various Loaders (CSS, File, URL)

- **Testing**:
  - Vitest
  - Jest
  - React Testing Library
  - JSDOM
  - Testing Library DOM
  - Testing Library User Event

- **TypeScript Support**:
  - TypeScript
  - React Type Definitions

- **Development Tools**:
  - fs-extra
  - serve
  - web-vitals

## Build Process

### Development
```bash
npm start
```
