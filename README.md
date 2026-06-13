# Picture-In-Picture Overlay Workspace Utility

## Case Study Project

A frontend-only ReactJS application that demonstrates the practical implementation of the **Document Picture-in-Picture API** and **Picture-in-Picture API** for creating detachable productivity workspaces.

The application allows users to move workspace modules such as Notes, Stopwatch, and Media Stream Viewers into always-on-top floating windows while maintaining real-time synchronization with the primary application.

---

## 📖 Case Study Overview

Modern productivity workflows often require users to switch between multiple browser tabs and applications. Important information such as notes, timers, and media streams can become hidden behind other windows, reducing productivity and focus.

The **Picture-In-Picture Overlay Workspace Utility** addresses this challenge by allowing workspace components to be detached into floating overlay windows that remain visible while users continue working in other applications.

The project demonstrates how modern browser APIs can be used to create lightweight productivity tools without requiring backend infrastructure.

---

## 🎯 Objectives

- Implement the Document Picture-in-Picture API.
- Create detachable React workspace modules.
- Maintain synchronization between main and floating windows.
- Support webcam and screen-sharing capabilities.
- Provide local workspace persistence.
- Enable workspace export and restore functionality.
- Demonstrate advanced browser API integration.
- Operate entirely on the client side.

---

## ✨ Features

### Dashboard Workspace
- Workspace overview
- Browser capability detection
- PiP status monitoring
- Session statistics
- Recent activity tracking

### Floating Notes Widget
- Rich text note-taking
- Checklist management
- Real-time synchronization
- LocalStorage persistence

### Focus Stopwatch Widget
- Start, pause, and reset controls
- Session tracking
- PiP synchronization

### Universal Media Stream Viewer
- Webcam support
- Screen sharing
- Video upload support
- Stream monitoring
- PiP compatibility

### Telemetry Console
- System event logging
- Media event tracking
- PiP lifecycle monitoring
- Workspace activity tracking

### Workspace Management
- Export workspace configuration
- Restore workspace state
- Local session persistence

---

## 🏗️ System Architecture

```text
User Interface
       │
       ▼
React Components
       │
       ▼
Zustand Store
       │
       ▼
Browser APIs
       │
       ▼
LocalStorage
```

The application follows a frontend-only architecture and does not require any backend server or database.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|----------|
| ReactJS | Frontend Framework |
| Vite | Build Tool |
| Zustand | State Management |
| Tailwind CSS | Styling |
| LocalStorage | Persistence |
| Document PiP API | Floating Workspaces |
| MediaDevices API | Webcam Access |
| Screen Capture API | Screen Sharing |

---

## 🪟 Document Picture-in-Picture

The project uses the browser's native Document Picture-in-Picture API to create floating windows capable of rendering complete React components.

When a widget is detached:

1. A PiP window is created.
2. Stylesheets are cloned.
3. React components are rendered inside the floating window.
4. State synchronization is maintained through Zustand.

This allows users to keep important workspace tools visible at all times.

---

## 📡 Media Support

### Webcam Streaming

```javascript
navigator.mediaDevices.getUserMedia()
```

### Screen Sharing

```javascript
navigator.mediaDevices.getDisplayMedia()
```

### Video Upload

Users can upload and monitor local video files directly within the workspace.

---

## 💾 Persistence System

The application uses LocalStorage to preserve:

- Notes
- Checklist items
- Active workspace
- User preferences
- Workspace settings

This allows users to restore their workspace after refreshing or reopening the application.

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/pallavi-676/Picture-in-Picture.git
```

Navigate into the project:

```bash
cd Picture-in-Picture
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

---

## 🌐 Live Demo

**Live Application:**  
[live link](https://picture-in-picture-i1wc8mlnn-pallavi-676s-projects.vercel.app/)

**GitHub Repository:**  
https://github.com/pallavi-676/Picture-in-Picture

---

## 🧪 Testing

The following modules were tested:

### Notes Module
- Note creation
- Editing
- Synchronization

### Stopwatch Module
- Start
- Pause
- Reset
- PiP synchronization

### Media Viewer
- Webcam streaming
- Screen sharing
- Video upload

### Picture-in-Picture
- Window creation
- Widget detachment
- State synchronization

### Persistence
- Export
- Restore
- LocalStorage recovery

---

## Advantages

- Frontend-only architecture
- Lightweight implementation
- No backend dependency
- Real-time synchronization
- Modern browser API integration
- Improved multitasking experience

---

## Limitations

- Requires Chromium-based browsers.
- Active media streams cannot be automatically restored after refresh.
- Single active PiP workspace limitation.

---

## Conclusion

The Picture-In-Picture Overlay Workspace Utility demonstrates how modern browser technologies such as the Document Picture-in-Picture API, Zustand state management, LocalStorage persistence, and ReactJS can be combined to create detachable productivity workspaces.

The project serves as a practical case study in advanced frontend engineering, browser API integration, and productivity-focused application design.

---

## Author

**Pallavi Sarovar**  
Roll Number: **150096725219**

Case Study Project – School of Future Tech
