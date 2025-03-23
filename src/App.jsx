import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [mermaidCode, setMermaidCode] = useState(`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagramScale, setDiagramScale] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDiagramPopupOpen, setIsDiagramPopupOpen] = useState(false);
  const [imageWidth, setImageWidth] = useState(1200);
  const [imageHeight, setImageHeight] = useState(800);
  const [imageScale, setImageScale] = useState(2);

  const outputDivRef = useRef(null);
  const diagramPreviewRef = useRef(null);

  const templates = {
    flowchart: `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`,
    "flowchart-lr": `graph LR
    A[Start] --> B(Process)
    B --> C{Decision}
    C -->|Option 1| D[Result 1]
    C -->|Option 2| E[Result 2]`,
    "flowchart-complex": `graph TD
    subgraph One
    A[Start] --> B{Is it working?}
    end

    subgraph Two
    C[Continue] --> D{Problems?}
    end

    B -->|Yes| C
    B -->|No| E[Debug]
    D -->|Yes| E
    D -->|No| F[Complete]`,
    sequence: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,
    "sequence-advanced": `sequenceDiagram
    autonumber

    Alice->>John: Hello John, how are you?
    activate John
    John-->>Alice: Great!
    deactivate John

    Alice->>John: See you later!
    activate John
    John->>Jane: Hello Jane, how are you?
    activate Jane
    Jane-->>John: Great!
    deactivate Jane
    John-->>Alice: Bye!
    deactivate John`,
    class: `classDiagram
    class Animal {
        +name: string
        +age: int
        +makeSound(): void
    }

    class Dog {
        +breed: string
        +fetch(): void
    }

    class Cat {
        +color: string
        +climb(): void
    }

    Animal <|-- Dog
    Animal <|-- Cat

    note for Dog "Man's best friend"`,
    state: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
    er: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
    journey: `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`,
    gantt: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2024-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2024-01-12, 12d
    another task     :24d`,
    pie: `pie title Favorite Types of Pies
    "Apple" : 42.96
    "Blueberry" : 22.05
    "Cherry" : 34.99`,
    requirement: `requirementDiagram
    requirement test_req {
    id: 1
    text: The system shall test all requirements
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req`,
    git: `gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    checkout develop
    merge feature
    checkout main
    merge develop`,
    c4: `C4Context
    title System Context diagram for Internet Banking System
    
    Enterprise_Boundary(b0, "BankBoundary") {
      Person(customer, "Banking Customer", "A customer of the bank with personal bank accounts")
      System(banking_system, "Internet Banking System", "Allows customers to view information about their bank accounts and make payments")
    
      System_Ext(mail_system, "E-mail system", "The internal Microsoft Exchange e-mail system")
      System_Ext(mainframe, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")
    }
    
    BiRel(customer, banking_system, "Uses")
    Rel(banking_system, mail_system, "Sends e-mail using")
    Rel(banking_system, mainframe, "Uses")`,
    mindmap: `mindmap
    root((mindmap))
      Origins
        Long history
        Popularisation
          British popular psychology author Tony Buzan
      Research
        On effectiveness<br/>and features
        On Automatic creation
          Uses
            Creative techniques
            Strategic planning
            Argument mapping
      Tools
        Pen and paper
        Mermaid`,
    timeline: `timeline
    title History of Social Media
    section 2002
        LinkedIn: Founded
    section 2004
        Facebook: Founded by Mark Zuckerberg
    section 2005
        YouTube: Founded
    section 2006
        Twitter: Founded
    section 2010
        Instagram: Founded`,
    quadrant: `quadrantChart
    title Reach and Engagement of Social Media Platforms
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 High Reach, High Engagement
    quadrant-2 Low Reach, High Engagement
    quadrant-3 Low Reach, Low Engagement
    quadrant-4 High Reach, Low Engagement

    "Instagram": [0.76, 0.85]
    "TikTok": [0.83, 0.90]
    "YouTube": [0.91, 0.75]
    "LinkedIn": [0.52, 0.45]
    "Pinterest": [0.43, 0.61]
    "Twitter": [0.65, 0.56]`
  };

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose'
    });
    renderDiagram();
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleTemplateChange = (e) => {
    const selectedTemplate = e.target.value;
    if (selectedTemplate && templates[selectedTemplate]) {
      setMermaidCode(templates[selectedTemplate]);
    }
  };

  const renderDiagram = () => {
    setLoading(true);
    setErrorMessage('');

    try {
      mermaid.render('mermaid-svg', mermaidCode).then(result => {
        outputDivRef.current.innerHTML = result.svg;
        setLoading(false);
      }).catch(error => {
        setErrorMessage(`Error: ${error.message || 'Invalid Mermaid syntax'}`);
        setLoading(false);
      });
    } catch (error) {
      setErrorMessage(`Error: ${error.message || 'Invalid Mermaid syntax'}`);
      setLoading(false);
    }
  };

  const exportSvg = () => {
    const svgElement = outputDivRef.current.querySelector('svg');

    if (!svgElement) {
      setErrorMessage('No diagram to export. Please render a diagram first.');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    downloadFile(blob, 'mermaid-diagram.svg');
  };

  const exportPng = () => {
    const svgElement = outputDivRef.current.querySelector('svg');

    if (!svgElement) {
      setErrorMessage('No diagram to export. Please render a diagram first.');
      return;
    }

    const width = imageWidth;
    const height = imageHeight;
    const scale = imageScale;

    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      let sourceSVG = svgData;
      if (!sourceSVG.includes('xmlns="http://www.w3.org/2000/svg"')) {
        sourceSVG = sourceSVG.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!sourceSVG.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
        sourceSVG = sourceSVG.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }
      if (!svgElement.hasAttribute('width')) {
        sourceSVG = sourceSVG.replace('<svg', `<svg width="${width}"`);
      }
      if (!svgElement.hasAttribute('height')) {
        sourceSVG = sourceSVG.replace('<svg', `<svg height="${height}"`);
      }

      const base64Data = btoa(unescape(encodeURIComponent(sourceSVG)));
      const dataUrl = `data:image/svg+xml;base64,${base64Data}`;

      const img = new Image();
      img.width = width;
      img.height = height;

      img.onerror = () => {
        setErrorMessage('Error loading SVG for PNG conversion.');
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width * scale;
          canvas.height = height * scale;

          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              downloadFile(blob, 'mermaid-diagram.png');
            } else {
              setErrorMessage('Failed to create PNG. The diagram might be too complex.');
            }
          }, 'image/png');
        } catch (error) {
          setErrorMessage(`Error creating PNG: ${error.message}`);
        }
      };

      img.src = dataUrl;
    } catch (error) {
      setErrorMessage(`SVG processing error: ${error.message}`);
    }
  };

  const downloadFile = (blob, filename) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);
  };

  const openDiagramWindow = () => {
    // First set the popup to open, which will render the ref element
    setIsDiagramPopupOpen(true);
    
    // Use setTimeout to ensure the ref is available after the component has rendered
    setTimeout(() => {
      if (diagramPreviewRef.current) {
        const currentDiagram = outputDivRef.current.innerHTML;
        diagramPreviewRef.current.innerHTML = `<div class="diagram-container">${currentDiagram}</div>`;
        setDiagramScale(1);
      }
    }, 0);
  };

  const updateDiagramWindowScale = () => {
    const container = diagramPreviewRef.current.querySelector('.diagram-container');
    if (container) {
      container.style.transform = `scale(${diagramScale})`;
    }
  };

  const handleZoomIn = () => {
    setDiagramScale(diagramScale + 0.1);
    updateDiagramWindowScale();
  };

  const handleZoomOut = () => {
    setDiagramScale(Math.max(0.1, diagramScale - 0.1));
    updateDiagramWindowScale();
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleSavePopup = () => {
    setIsPopupOpen(false);
    renderDiagram();
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div data-theme={theme} style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: theme === 'dark' ? '#e0e0e0' : '#333333', backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff', transition: 'background-color 0.3s, color 0.3s' }}>
      <h1>Mermaid Diagram Generator</h1>

      <div className="template-section">
        <label htmlFor="template-select">Select Template: </label>
        <select id="template-select" onChange={handleTemplateChange}>
          <option value="">-- Select a diagram type --</option>
          <optgroup label="Flow Charts">
            <option value="flowchart" selected>Flowchart (TD - Top Down)</option>
            <option value="flowchart-lr">Flowchart (LR - Left to Right)</option>
            <option value="flowchart-complex">Complex Flowchart with Subgraphs</option>
          </optgroup>
          <optgroup label="Sequence Diagrams">
            <option value="sequence">Basic Sequence Diagram</option>
            <option value="sequence-advanced">Advanced Sequence Diagram</option>
          </optgroup>
          <optgroup label="Class Diagrams">
            <option value="class">Class Diagram</option>
          </optgroup>
          <optgroup label="State Diagrams">
            <option value="state">State Diagram</option>
          </optgroup>
          <optgroup label="Entity Relationship">
            <option value="er">Entity Relationship Diagram</option>
          </optgroup>
          <optgroup label="User Journey">
            <option value="journey">User Journey</option>
          </optgroup>
          <optgroup label="Gantt Charts">
            <option value="gantt">Gantt Chart</option>
          </optgroup>
          <optgroup label="Pie Charts">
            <option value="pie">Pie Chart</option>
          </optgroup>
          <optgroup label="Requirement Diagrams">
            <option value="requirement">Requirement Diagram</option>
          </optgroup>
          <optgroup label="Git Graphs">
            <option value="git">Git Graph</option>
          </optgroup>
          <optgroup label="C4 Diagrams">
            <option value="c4">C4 Context Diagram</option>
          </optgroup>
          <optgroup label="Mind Maps">
            <option value="mindmap">Mind Map</option>
          </optgroup>
          <optgroup label="Timeline">
            <option value="timeline">Timeline</option>
          </optgroup>
          <optgroup label="Quadrant Charts">
            <option value="quadrant">Quadrant Chart</option>
          </optgroup>
        </select>
      </div>

      <div className="controls" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
        <div className="theme-toggle">
          <span className="theme-icon">☀️</span>
          <label className="switch">
            <input type="checkbox" checked={theme === 'dark'} onChange={handleThemeToggle} />
            <span className="slider"></span>
          </label>
          <span className="theme-icon">🌙</span>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <div className="input-section" style={{ flex: '1', maxWidth: '50%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Mermaid Syntax</h2>
            <div>
              <button onClick={renderDiagram} style={{ marginRight: '10px' }}>Render Diagram</button>
              <button onClick={handleOpenPopup}>Open Editor</button>
            </div>
          </div>
          <textarea
            value={mermaidCode}
            onChange={(e) => setMermaidCode(e.target.value)}
            placeholder="Enter your Mermaid diagram syntax here..."
            style={{ width: '100%', height: '300px', padding: '10px', fontFamily: 'monospace', border: '1px solid #dddddd', borderRadius: '5px', resize: 'vertical', boxSizing: 'border-box', backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff', color: theme === 'dark' ? '#e0e0e0' : '#333333' }}
          />
          <div>
            {loading && <span className="loading">Rendering...</span>}
            <div id="error-message" style={{ color: '#e74c3c', marginTop: '10px' }}>{errorMessage}</div>
          </div>

          <div id="resolution-settings" style={{ marginTop: '15px', padding: '10px', border: '1px solid #dddddd', borderRadius: '5px' }}>
            <h3>Export Settings</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div>
                <label htmlFor="image-width">Width: </label>
                <input type="number" id="image-width" value={imageWidth} onChange={(e) => setImageWidth(parseInt(e.target.value, 10))} min="100" />
              </div>
              <div>
                <label htmlFor="image-height">Height: </label>
                <input type="number" id="image-height" value={imageHeight} onChange={(e) => setImageHeight(parseInt(e.target.value, 10))} min="100" />
              </div>
              <div>
                <label htmlFor="image-scale">Scale: </label>
                <input type="number" id="image-scale" value={imageScale} onChange={(e) => setImageScale(parseFloat(e.target.value))} min="1" max="5" step="0.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="output-section" style={{ flex: '1', maxWidth: '50%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Rendered Diagram</h2>
            <div>
              <button onClick={exportSvg} style={{ marginRight: '5px' }}>Export as SVG</button>
              <button onClick={exportPng} style={{ marginRight: '5px' }}>Export as PNG</button>
              <button onClick={openDiagramWindow}>Open Diagram</button>
            </div>
          </div>
          <div id="mermaid-output" ref={outputDivRef} style={{ border: '1px solid #dddddd', borderRadius: '5px', padding: '10px', minHeight: '300px', backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f9f9f9' }}></div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="popup-content" style={{ backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff', padding: '20px', borderRadius: '5px', width: '80%', height: '90%', maxWidth: '1200px', maxHeight: '100vh', overflowY: 'auto', color: theme === 'dark' ? '#e0e0e0' : '#333333', border: '1px solid #dddddd' }}>
            <h2>Edit Mermaid Syntax</h2>
            <textarea
              value={mermaidCode}
              onChange={(e) => setMermaidCode(e.target.value)}
              style={{ width: '100%', height: '500px', marginBottom: '15px', fontFamily: 'monospace', border: '1px solid #dddddd', borderRadius: '5px', resize: 'vertical', boxSizing: 'border-box', backgroundColor: theme === 'dark' ? '#2d2d2d' : '#ffffff', color: theme === 'dark' ? '#e0e0e0' : '#333333' }}
            />
            <div>
              <button onClick={handleSavePopup}>Save and Close</button>
              <button onClick={handleClosePopup}>Close Without Saving</button>
            </div>
          </div>
        </div>
      )}

      {isDiagramPopupOpen && (
        <div className="popup" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="popup-content" style={{ backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff', padding: '20px', borderRadius: '5px', width: '80%', height: '90%', maxWidth: '1200px', maxHeight: '100vh', overflowY: 'auto', color: theme === 'dark' ? '#e0e0e0' : '#333333', border: '1px solid #dddddd' }}>
            <h2>Diagram Preview</h2>
            <div className="diagram-controls">
              <button onClick={handleZoomIn}>Zoom In</button>
              <button onClick={handleZoomOut}>Zoom Out</button>
              <button onClick={() => setIsDiagramPopupOpen(false)}>Close</button>
            </div>
            <div id="diagram-preview" ref={diagramPreviewRef} style={{ overflow: 'auto', maxHeight: '90vh', maxWidth: '100%', width: '100%', height: '70%', border: '1px solid #dddddd', padding: '15px', backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f9f9f9', borderRadius: '5px' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;