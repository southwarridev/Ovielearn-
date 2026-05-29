import { Chapter } from "./types";

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: "getting_started",
    title: "1. Getting Started",
    lessons: [
      {
        id: "intro",
        title: "What is Ovie?",
        description: "An introduction to the Ovie programming language and its design philosophy.",
        theory: `### What is Ovie?
Ovie is a modern, beginner-friendly programming language that combines low-level execution power with high-level readability. It features a natural syntax inspired by Nigerian Pidgin English, making it incredibly welcoming to newcomers while delivering maximum performance.

### Design Principles
Ovie is built on three core design concepts:
1. **Low-Level Control with High-Level Joy:** Directly control memory allocation and hardware buffers without standard syntactic clutter.
2. **Only 13 Keywords:** An extremely light language footprint that is easy to remember and fast to master.
3. **Self-Hosted Compiler:** Ovie's compiler capability is self-hosted, meaning the compiler is written in Ovie itself!

### Installation
Setting up Ovie locally takes only one simple terminal script command:

- **Linux / macOS:**
  \`\`\`bash
  curl -sSL https://raw.githubusercontent.com/southwarridev/ovie/main/easy-linux-install.sh | bash
  \`\`\`

- **Windows (PowerShell):**
  \`\`\`powershell
  iwr -useb https://raw.githubusercontent.com/southwarridev/ovie/main/easy-windows-install.ps1 | iex
  \`\`\`

### Quick Check
After installation, you can compile and execute high-performance Ovie \`.ov\` source files on your device using:
\`\`\`bash
oviec run hello.ov
\`\`\``,
        codeBoilerplate: `// Welcome to the Ovie Academy and Compiler!
// Look at the code below. We use the 'seeAm' statement 
// to print messages to standard output. 
// Click 'Run Code' to execute the compiler.

seeAm "Welcome to Ovie! 👋"
`,
        interactiveChallenge: {
          question: "How many keywords does the Ovie programming language have as of v2.3?",
          type: "multiple_choice",
          choices: [
            "13 keywords",
            "52 keywords",
            "Over 100 keywords"
          ],
          correctAnswer: "13 keywords"
        }
      },
      {
        id: "hello_world",
        title: "Writing Hello World",
        description: "Learn how to print messages to standard output in Ovie using 'seeAm'.",
        theory: `### Outputting Data with seeAm
In Ovie, we output or print text onto the screen using the intuitive \`seeAm\` keyword (originating from the Nigerian Pidgin term meaning "show me"). 

### Syntax Rules
Unlike most systems languages, Ovie doesn't require complex boilerplate, includes, or main functions for simple scripts! You can print output by writing:

\`\`\`ovie
seeAm "Hello from Ovie! 👋"
\`\`\`

### String Concatenation
You can combine or join multiple pieces of text together using the standard \`+\` operator:

\`\`\`ovie
mut name = "Absolute Beginner"
seeAm "Welcome to programming, " + name + "!"
\`\`\``,
        codeBoilerplate: `// Fix this code so it outputs "Hello, Ovie!"
seeAm "Hello, Ovie!"
`,
        interactiveChallenge: {
          question: "Which Ovie keyword translates to 'show me' and is used to print lines to stdout?",
          type: "fill_in_the_blank",
          correctAnswer: "seeAm",
          placeholder: "e.g., print, seeAm, println"
        }
      }
    ]
  },
  {
    id: "basics",
    title: "2. The Basics",
    lessons: [
      {
        id: "variables",
        title: "Immutable & mut Variables",
        description: "How to declare constant bindings and mutable variables.",
        theory: `### Data Boxes: Variables
Ovie makes database bindings incredibly clean. Variables are immutable (un-changeable) by default, protecting memory from unintended alterations.

### Immutable Variables (Fixed)
To declare an immutable variable, simply assign a name directly without any keyword!
\`\`\`ovie
greeting = "Hello, World!"
// greeting = "New value" <-- This would fail compiler checks!
\`\`\`

### Mutable Variables (Changeable)
To declare a variable whose value can change later, prefix the identifier with the \`mut\` keyword:
\`\`\`ovie
mut count = 0
count = count + 1
seeAm count // Outputs: 1
\`\`\`

### Data Types
Ovie uses capitalized type identifiers for clear architectural definition:
- \`String\` (text)
- \`Number\` (both integer & fractional representations)
- \`Boolean\` (\`true\` or \`false\`)`,
        codeBoilerplate: `mut followers = 150
followers = followers + 1

seeAm "Total followers: " + followers
`,
        interactiveChallenge: {
          question: "Which keyword must be placed before an Ovie variable to make it changeable (mutable)?",
          type: "fill_in_the_blank",
          correctAnswer: "mut",
          placeholder: "e.g., var, let, mut"
        }
      },
      {
        id: "functions",
        title: "Functions & Types",
        description: "Structuring clean, reusable code recipes with inputs and outputs.",
        theory: `### Declaring Functions
Functions in Ovie are defined using the \`fn\` keyword. They aggregate statements into modular layouts.

### Inputs & Return Arrow
- **Arguments:** Named variables inside the parentheses followed by their Capitalized types.
- **Return Type:** Declared using the right arrow symbol \`->\` before the opening brace.

Let's look at this clean addition calculation:
\`\`\`ovie
fn add(a: Number, b: Number) -> Number {
    return a + b
}

seeAm add(5, 7) // Outputs: 12
\`\`\``,
        codeBoilerplate: `fn quadruple(num: Number) -> Number {
    return num * 4
}

seeAm quadruple(20)
`,
        interactiveChallenge: {
          question: "What is the return type identifier of a function returning a numeric calculator state in Ovie?",
          type: "multiple_choice",
          choices: [
            "int",
            "Number",
            "double"
          ],
          correctAnswer: "Number"
        }
      }
    ]
  },
  {
    id: "advanced",
    title: "3. Advanced Principles",
    lessons: [
      {
        id: "control_flow",
        title: "Control Flow",
        description: "Conditional logic checks and repeating ranges.",
        theory: `### Decision Making (if & else)
Ovie allows you to branch execution paths based on truth states. Brackets around the logical expression are optional!

\`\`\`ovie
mut score = 85

if score >= 80 {
    seeAm "Great job!"
} else {
    seeAm "Keep practicing!"
}
\`\`\`

### Loops and Iteration (for)
To repeat execution sequences over a defined range of values, Ovie provides a clean, fast \`for\` loop syntax:

\`\`\`ovie
for i in 0..5 {
    seeAm "Count: " + i
}
\`\`\`
This loop counts from 0 up to (but not including) 5, outputting each iteration step to standard output.`,
        codeBoilerplate: `for score in 1..4 {
    seeAm "Score rating: " + score
}
`,
        interactiveChallenge: {
          question: "Which Ovie range symbol is used inside a 'for' loop to declare an iteration bounds (e.g. 0 to 5)?",
          type: "fill_in_the_blank",
          correctAnswer: "..",
          placeholder: "e.g. to, .., =>"
        },
        isPremium: true
      },
      {
        id: "structs_enums",
        title: "Custom Data with Structs",
        description: "Custom record modeling and standard libraries.",
        theory: `### Struct Record Modeling
To model elaborate data structures, Ovie provides custom defined schemas labeled as \`structs\`.

\`\`\`ovie
struct Student {
    name: String,
    age: Number,
    is_active: Boolean
}

mut s = Student { 
    name: "Amina", 
    age: 21, 
    is_active: true 
}

seeAm s.name
\`\`\`

### Rich Built-in Standard Libraries
Ovie ships with optimized namespaces out-of-the-box:
- \`std::io\`: Read/Write console buffers
- \`std::fs\`: Solid file system manipulation
- \`std::math\`: Complex mathematical vectors
- \`std::core\`: General utility types containing \`Result\` & \`Option\``,
        codeBoilerplate: `struct Robot {
    model: String,
    version: Number
}

mut r = Robot { model: "Ovie-Bot", version: 2.3 }
seeAm r.model + " v" + r.version
`,
        interactiveChallenge: {
          question: "Which capitalized keyword is used to represent standard true/false values inside an Ovie struct scheme?",
          type: "multiple_choice",
          choices: [
            "bool",
            "boolean",
            "Boolean"
          ],
          correctAnswer: "Boolean"
        },
        isPremium: true
      }
    ]
  },
  {
    id: "mobile_engine",
    title: "4. Mobile App Engine (.ov)",
    lessons: [
      {
        id: "mobile_intro",
        title: "Building Mobile Apps",
        description: "Learn how Ovie's native mobile directives compile layouts into responsive Android interfaces.",
        theory: `### Introducing Ovie Mobile UI (.ov)
Ovie integrates a high-performance, reactive Mobile UI framework called **Kpalasa UI**! This framework compiles standard \`.ov\` files directly into native XML/Jetpack Compose layouts.

### Mobile Elements Overview
The framework gives you access to physical component builders:
1. \`makeLayout("Column") { ... }\`: Groups elements vertically.
2. \`makeText("label", color)\`: Prints screen texts/headers.
3. \`makeButton("title") { action }\`: Generates interactive hit zones.
4. \`makeInput("placeholder")\`: Form control lines.

### Sample Mobile Code
To draw a beautiful login page container inside an Ovie app:
\`\`\`ovie
makeLayout("Column") {
  makeText("Welcome to OvieLearn Native!", "gold")
  makeInput("Enter developer alias...")
  makeButton("Launch Sandbox Compilation") {
    seeAm "Handshake triggered!"
  }
}
\`\`\``,
        codeBoilerplate: `// Write an Ovie Mobile screen layout below!
// Click 'Run Code' to preview your responsive UI 
// live in the 'Virtual Device' sandbox tab!

makeLayout("Column") {
  makeText("Ovie Mobile App 📱", "emerald")
  makeText("Learn components with live simulation", "slate")
  makeButton("Trigger Alert") {
    seeAm "Button pressed! Mobile framework handshake successful!"
  }
}
`,
        interactiveChallenge: {
          question: "What is the name of Ovie's reactive mobile framework engine specified in Chapter 4?",
          type: "fill_in_the_blank",
          correctAnswer: "Kpalasa UI",
          placeholder: "e.g., Kpalasa UI"
        },
        isPremium: false
      },
      {
        id: "mobile_state",
        title: "Configuring APK Assembly Builds",
        description: "Generate compiled APK binary files from Ovie source structures.",
        theory: `### Cross-compiling Ovie into Android Binaries
Ovie's compiled assembly has target outputs for multiple CPU architectures! By pairing with modern mobile tooling, you can compile \`.ov\` assets directly into native Android APK packages.

### Automated CI Actions
Our automated pipeline inside \`.github/workflows/android-apk.yml\` runs structural compilation of assets:
1. Installs Android NDK / SDK prerequisites.
2. Cross-compiles Ovie Kpalasa structures into native binary definitions.
3. Builds the signed runtime APK wrapper using Gradle.
4. Uploads finished artifact logs as direct GitHub Release assets!

### Standard APK compiler directive:
To compile your local Ovie app code directly from the cli:
\`\`\`bash
oviec apk --target-abi arm64-v8a main.ov
\`\`\``,
        codeBoilerplate: `// Let's create an Interactive Dashboard using Ovie Mobile elements!
makeLayout("Column") {
  makeText("Ovie Wallet Console 💰", "gold")
  makeText("Active Balance: $148.02", "white")
  makeButton("Initialize APK Compiler Workflow") {
    seeAm "Compilation Started: Packing Kpalasa App.ov into target Android-v8a APK..."
  }
}
`,
        interactiveChallenge: {
          question: "Which folder houses our newly introduced automated build action that lets developers trigger and download APK releases?",
          type: "multiple_choice",
          choices: [
            ".github/workflows",
            "src/components",
            "assets/android"
          ],
          correctAnswer: ".github/workflows"
        },
        isPremium: false
      }
    ]
  }
];
