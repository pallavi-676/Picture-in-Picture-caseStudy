import React from 'react';
import { createPortal } from 'react-dom';
import UtilityManager from './components/UtilityManager';
import { usePictureInPicture } from './hooks/usePictureInPicture';
import useWorkspaceStore from './store/workspaceStore';

// Widgets that can be portaled
import FloatingNotesWidget from './components/FloatingNotesWidget';
import ScreenShareWidget from './components/ScreenShareWidget';
import StopwatchWidget from './components/StopwatchWidget';
import TelemetryConsole from './components/TelemetryConsole';

function App() {
  const { pipContainer, requestPipWindow, closePipWindow } = usePictureInPicture();
  const { pipState } = useWorkspaceStore();

  // Helper to render the currently portaled widget
  const renderPortaledWidget = () => {
    switch (pipState.activeWidget) {
      case 'notes':
        return <FloatingNotesWidget />;
      case 'media':
        return <ScreenShareWidget />;
      case 'stopwatch':
        return <StopwatchWidget />;
      case 'telemetry':
        return <TelemetryConsole />;
      default:
        return null;
    }
  };

  return (
    <>
      <UtilityManager 
        onRequestPip={requestPipWindow} 
        onClosePip={closePipWindow}
        isPipOpen={!!pipContainer}
      />
      
      {/* If PiP is active and we have a container, render the widget into the PiP window via Portal */}
      {pipContainer && createPortal(
        renderPortaledWidget(),
        pipContainer
      )}
    </>
  );
}

export default App;
