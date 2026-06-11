# Picture-in-Picture Workspace Utility

A modern browser-based productivity workspace built with **React, Vite, Zustand, Tailwind CSS, and the Document Picture-in-Picture API**.

This application allows users to detach workspace modules such as Notes, Stopwatch, and Media Streams into always-on-top floating windows while maintaining real-time synchronization with the main application.

---

## ✨ Features

### 📝 Workspace Notes
- Rich note-taking environment
- Checklist management
- Persistent storage using LocalStorage
- Real-time synchronization between main window and PiP window

### ⏱️ Focus Stopwatch
- Start, pause, and reset controls
- Live synchronization across windows
- Session tracking

### 🎥 Universal Media Stream Viewer
- Screen Sharing (WebRTC)
- Webcam Streaming
- Local Video Upload
- Media stream persistence during PiP transitions
- Real-time stream status monitoring

### 🪟 Document Picture-in-Picture
- Detach supported widgets into floating always-on-top windows
- Native Chrome/Edge Document PiP support
- Independent floating workspace windows
- Automatic state synchronization
- Dynamic window resize support

### 📊 Telemetry Analytics
- Real-time event logging
- System activity tracking
- Media stream monitoring
- PiP lifecycle monitoring
- Categorized event history

### 💾 Workspace Persistence
- Zustand state management
- LocalStorage persistence
- Restore previous workspace sessions
- Import workspace configurations
- Export workspace configurations

### 📈 Dashboard Overview
- Workspace status monitoring
- Browser capability detection
- PiP support verification
- Synchronization status tracking
- Workspace statistics

---

## 🚀 Technologies Used

- React.js
- Vite
- Zustand
- Tailwind CSS
- Lucide React Icons
- Document Picture-in-Picture API
- WebRTC APIs
- Screen Capture API
- MediaDevices API
- LocalStorage API

---

## 🏗️ Project Architecture

```text
src/
│
├── components/
│   ├── UtilityManager.jsx
│   ├── OverlayArchitectureSelector.jsx
│   ├── WorkspaceStage.jsx
│   ├── FloatingNotesWidget.jsx
│   ├── StopwatchWidget.jsx
│   ├── ScreenShareWidget.jsx
│   ├── TelemetryConsole.jsx
│   └── TransportActionStrip.jsx
│
├── hooks/
│   └── usePictureInPicture.js
│
├── store/
│   └── workspaceStore.js
│
├── utils/
│   └── styleCloner.js
│
├── App.jsx
└── main.jsx
```

---

## 🖥️ Browser Support

| Browser | Support |
|----------|----------|
| Chrome 116+ | ✅ |
| Edge 116+ | ✅ |
| Firefox | ❌ |
| Safari | ❌ |

> Document Picture-in-Picture API currently works only in Chromium-based browsers.

---

## 📦 Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the project:

```bash
cd picture-in-picture-workspace-utility
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 🎯 How It Works

### Document Picture-in-Picture

The application uses the browser's native:

```javascript
window.documentPictureInPicture.requestWindow()
```

API to create floating windows.

When a widget is detached:

1. A new PiP window is created.
2. Stylesheets are cloned.
3. React portals render content into the new window.
4. State remains synchronized through Zustand.
5. Closing the PiP window safely restores the widget to the main workspace.

---

## 💾 Import / Export System

### Export

Exports:

- Notes
- Checklists
- Stopwatch state
- Active workspace tab
- PiP preferences

### Import

Imports previously exported workspace configurations.

### Restore

Restores the latest workspace session from LocalStorage.

---

## 📡 Media Streaming

Supported media sources:

### Screen Capture

```javascript
navigator.mediaDevices.getDisplayMedia()
```

### Webcam

```javascript
navigator.mediaDevices.getUserMedia()
```

### Local Video Files

Users can upload and view local video files directly within the workspace.

---

## 🔒 Privacy

This application:

- Does not use a backend
- Does not store data on external servers
- Does not require user accounts
- Runs entirely in the browser
- Stores workspace data locally

---

## 🎨 Design Philosophy

The interface follows a premium editorial design language featuring:

- Soft neutral color palette
- Serif typography
- Spacious layouts
- Minimal distractions
- Focus-oriented workspace design

---

## 🧪 Testing Checklist

- Notes synchronization
- Stopwatch synchronization
- Screen sharing
- Webcam streaming
- Video uploads
- PiP detachment
- PiP restoration
- Workspace export
- Workspace import
- LocalStorage restoration
- Telemetry logging

---

## 🔮 Future Enhancements

- Multi-widget PiP support
- Drag-and-drop dashboard customization
- Theme switching
- Session analytics
- Cloud synchronization
- Collaborative workspaces
- Keyboard shortcuts
- PWA support

---

## 👨‍💻 Author

Developed as a frontend-only React application demonstrating advanced usage of:

- Document Picture-in-Picture API
- React Portals
- Zustand State Management
- Browser Media APIs
- Modern Frontend Architecture

---

## 📄 License

This project is intended for educational and demonstration purposes.
