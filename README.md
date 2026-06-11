# Picture-in-Picture Workspace Utility

A modern productivity workspace built with **React, Vite, Zustand, Tailwind CSS, WebRTC APIs, and the Document Picture-in-Picture API**.

The application allows users to detach workspace modules such as Notes, Stopwatch, and Media Streams into native always-on-top floating windows while maintaining real-time synchronization with the main application. The Document Picture-in-Picture API enables arbitrary HTML content—not just videos—to be displayed in floating windows, making it ideal for productivity-focused web applications. :contentReference[oaicite:0]{index=0}

---

## 🔗 Project Information

| Item | Link |
|--------|--------|
| 🚀 Live Demo | https://YOUR-VERCEL-LINK.vercel.app |
| 💻 GitHub Repository | https://github.com/pallavi-676/Picture-in-Picture |
| ⚛️ Frontend Framework | React + Vite |
| 🗂️ State Management | Zustand |
| 🎨 Styling | Tailwind CSS |
| 🪟 Core Feature | Document Picture-in-Picture API |
| 💾 Persistence | LocalStorage |
| 📡 Media Support | Screen Share, Webcam, Video Upload |

---

## ✨ Features

### 📝 Workspace Notes
- Rich text note-taking
- Checklist management
- Real-time synchronization
- Persistent storage using LocalStorage
- PiP-compatible editing experience

### ⏱️ Focus Stopwatch
- Start, pause, and reset functionality
- Session tracking
- Real-time synchronization between windows
- Floating PiP stopwatch mode

### 🎥 Universal Media Stream Viewer
- Screen sharing support
- Webcam streaming
- Local video uploads
- Stream persistence during PiP transitions
- Stream information monitoring

### 🪟 Document Picture-in-Picture
- Native always-on-top floating windows
- Widget detachment system
- Independent workspace windows
- Window resizing support
- State synchronization across windows

### 📊 Telemetry Analytics
- Real-time event logging
- PiP activity tracking
- Media activity monitoring
- System event monitoring
- Categorized logs

### 💾 Workspace Management
- Export workspace configuration
- Import workspace configuration
- Restore previous session
- Reset workspace state
- LocalStorage persistence

### 📈 Dashboard Overview
- Workspace status
- Browser capability detection
- PiP support verification
- Synchronization monitoring
- Workspace statistics

---

## 🛠️ Technologies Used

- React.js
- Vite
- Zustand
- Tailwind CSS
- Lucide React
- Document Picture-in-Picture API
- WebRTC APIs
- Screen Capture API
- MediaDevices API
- LocalStorage API

---

## 🏗️ Project Structure

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

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/pallavi-676/Picture-in-Picture.git
```

### Navigate Into Project

```bash
cd Picture-in-Picture
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🪟 How Document Picture-in-Picture Works

This project uses the browser's native Document Picture-in-Picture API.

```javascript
const pipWindow =
  await window.documentPictureInPicture.requestWindow({
    width: 450,
    height: 500,
  });
```

The API enables opening a floating always-on-top window containing arbitrary HTML content instead of being limited to only video elements. This allows Notes, Stopwatch, and Media widgets to run independently while remaining synchronized with the main application. :contentReference[oaicite:1]{index=1}

---

## 📡 Media Features

### Screen Sharing

```javascript
navigator.mediaDevices.getDisplayMedia()
```

### Webcam Streaming

```javascript
navigator.mediaDevices.getUserMedia()
```

### Video Upload

Users can upload and view local video files directly within the workspace.

---

## 💾 Import / Export System

### Export

Exports:

- Active workspace tab
- Notes
- Checklist items
- Stopwatch state
- PiP preferences

### Import

Imports previously exported workspace configuration files.

### Restore

Restores the most recent saved workspace from LocalStorage.

### Reset

Resets the workspace to its default state.

---

## 📊 Telemetry System

The application tracks:

- System events
- PiP events
- Media events
- Workspace actions
- Import/Export activity

Telemetry data is displayed in real time through the Telemetry Analytics panel.

---

## 🎨 Design Philosophy

The interface follows a premium editorial workspace design:

- Soft neutral palette
- Serif typography
- Spacious layouts
- Focus-oriented workflow
- Minimal distractions
- Productivity-first interface

---

## 🌐 Browser Support

| Browser | Support |
|----------|----------|
| Chrome 116+ | ✅ |
| Edge 116+ | ✅ |
| Firefox | ❌ |
| Safari | ❌ |

> Document Picture-in-Picture currently requires Chromium-based browsers. :contentReference[oaicite:2]{index=2}

---

## 🔒 Privacy

This application:

- Runs entirely in the browser
- Uses no backend services
- Requires no user account
- Stores data locally
- Does not transmit workspace data to external servers

---

## 🧪 Testing Checklist

### Notes
- Create notes
- Edit notes
- Synchronize with PiP

### Stopwatch
- Start timer
- Pause timer
- Reset timer
- Verify PiP synchronization

### Media
- Screen sharing
- Webcam streaming
- Video uploads
- PiP media rendering

### Workspace
- Export configuration
- Import configuration
- Restore session
- Reset workspace

### PiP
- Open floating window
- Resize floating window
- Close floating window
- Restore widget to main workspace

---

## 🔮 Future Enhancements

- Multiple simultaneous PiP widgets
- Custom dashboard layouts
- Theme switching
- Session analytics
- Keyboard shortcuts
- Progressive Web App support
- Cloud synchronization
- Collaborative workspaces

---

## 👩‍💻 Author

**Pallavi Sarovar**

Frontend project demonstrating advanced browser APIs including:

- Document Picture-in-Picture API
- React Portals
- Zustand State Management
- WebRTC Media APIs
- Modern React Architecture



