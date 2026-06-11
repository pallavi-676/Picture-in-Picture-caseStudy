import React from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import FloatingNotesWidget from './FloatingNotesWidget';
import ScreenShareWidget from './ScreenShareWidget';
import StopwatchWidget from './StopwatchWidget';
import OverlayArchitectureSelector from './OverlayArchitectureSelector';
import TelemetryConsole from './TelemetryConsole';

const WorkspaceStage = () => {
  const { activeTab } = useWorkspaceStore();

  const renderActiveWidget = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OverlayArchitectureSelector />;
      case 'notes':
        return <FloatingNotesWidget />;
      case 'media':
        return <ScreenShareWidget />;
      case 'stopwatch':
        return <StopwatchWidget />;
      case 'telemetry':
        return <TelemetryConsole />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-neutral-400 font-medium text-lg">
            Select a workspace from the sidebar
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
      {renderActiveWidget()}
    </div>
  );
};

export default WorkspaceStage;
