import React from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import TransportActionStrip from './TransportActionStrip';
import WorkspaceStage from './WorkspaceStage';
import { Activity, FileText, Timer, Video, MonitorPlay, Settings2, Box } from 'lucide-react';

const UtilityManager = ({ onRequestPip, onClosePip, isPipOpen }) => {
  const { activeTab, setActiveTab, pipState } = useWorkspaceStore();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'notes', label: 'Notepad', icon: FileText },
    { id: 'stopwatch', label: 'Stopwatch', icon: Timer },
    { id: 'media', label: 'Media Stream', icon: Video },
    { id: 'telemetry', label: 'Telemetry', icon: MonitorPlay },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-cream text-neutral-800 font-serif">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-mist bg-cream z-10 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sky text-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-tight m-0 text-neutral-900">Picture-In-Picture Workspace</h1>
            <p className="text-xs text-neutral-500 uppercase tracking-widest mt-0.5">Premium Utility Environment</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-mist shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              {pipState.isActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${pipState.isActive ? 'bg-sky' : 'bg-neutral-300'}`}></span>
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-600">
              {pipState.isActive ? 'Overlay Active' : 'Overlay Idle'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden p-3 gap-3 bg-cream">
        
        {/* Left Sidebar */}
        <aside className="w-56 bg-sand rounded-2xl flex flex-col shrink-0 shadow-sm overflow-hidden border border-mist/50">
          <div className="px-5 py-4 border-b border-mist/30">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-600">Navigation</h2>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-sky text-neutral-900 font-semibold shadow-sm' 
                      : 'text-neutral-700 hover:bg-mist/60 hover:text-neutral-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-neutral-900' : 'text-neutral-500'}`} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 bg-sand border-t border-mist/30 flex items-center gap-2 text-xs text-neutral-500">
            <div className="p-1.5 bg-mist/50 rounded text-sky">
              <Settings2 className="w-3 h-3" />
            </div>
            <span>Workspace v2.0</span>
          </div>
        </aside>

        {/* Main Workspace Column */}
        <main className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-mist overflow-hidden">
          <TransportActionStrip 
            onRequestPip={onRequestPip} 
            onClosePip={onClosePip}
            isPipOpen={isPipOpen}
          />
          
          {/* Stage: flex-col so child gets a real pixel height for overflow-y-auto to work */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <WorkspaceStage />
          </div>
        </main>
      </div>

      {/* Bottom Status Bar */}
      <footer className="shrink-0 h-9 border-t border-mist bg-sand flex items-center justify-between px-5 text-xs font-mono text-neutral-600 z-10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <Box className="w-3 h-3 text-sky" />
            {pipState.isActive ? <span>PiP: <span className="font-semibold text-neutral-900">{pipState.width}×{pipState.height}</span></span> : 'Main Browser Window'}
          </span>
          <span className="w-px h-4 bg-mist/50"></span>
          <span>Sync: <span className="text-sky font-semibold">ACTIVE</span></span>
        </div>
        <div className="flex gap-3">
          <span>Storage: <span className="text-neutral-800 font-semibold">LocalStorage</span></span>
          <span className="w-px h-4 bg-mist/50"></span>
          <span>Doc PiP: <span className={pipState.isSupported ? "text-sky font-semibold" : "text-red-400 font-semibold"}>{pipState.isSupported ? 'Supported' : 'Unsupported'}</span></span>
        </div>
      </footer>
    </div>
  );
};

export default UtilityManager;
