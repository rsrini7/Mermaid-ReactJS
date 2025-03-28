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
    Another task     :after a1, 2d
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

export default templates;
