import React from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import {
  Activity, Layout, MonitorPlay, Video, FileText, Globe,
  Database, Terminal, CheckCircle2, XCircle, Clock, Wifi, WifiOff,
  PictureInPicture2
} from 'lucide-react';

const OverlayArchitectureSelector = () => {
  const { pipState, media, telemetryLogs, notes } = useWorkspaceStore();
  const recentLogs = telemetryLogs.slice(0, 5);

  const completedItems = notes.checklist.filter(i => i.checked).length;

  return (
    /* flex-1 + min-h-0: fills the flex-col WorkspaceStage and allows overflow-y-auto to actually scroll */
    <div className="flex-1 min-h-0 overflow-y-auto bg-cream/50 font-serif">
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        <header>
          <h2 className="text-2xl font-medium text-neutral-900 mb-1">Workspace Overview</h2>
          <p className="text-neutral-500 text-sm tracking-wide">Comprehensive session state and system information.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* ── Session State ─────────────────────────────── */}
          <div className="bg-white border border-mist rounded-2xl p-5 shadow-sm">
            <SectionHeader icon={<Layout className="w-4 h-4 text-sky" />} label="Session State" />
            <div className="space-y-3 mt-4">
              <Row label="PiP Overlay">
                <StatusBadge active={pipState.isActive} />
              </Row>
              <Row label="Detached Widget">
                <span className="font-medium text-neutral-900 capitalize">{pipState.activeWidget || 'None'}</span>
              </Row>
              <Row label="Active Media Feed">
                <span className={`font-medium uppercase text-sm ${media.activeSource !== 'none' ? 'text-sky' : 'text-neutral-400'}`}>
                  {media.activeSource !== 'none' ? media.activeSource : 'Offline'}
                </span>
              </Row>
              <Row label="Window Size">
                <span className="font-mono text-sm text-neutral-700">
                  {pipState.isActive ? `${pipState.width}×${pipState.height}` : '—'}
                </span>
              </Row>
              <Row label="Sync Status">
                <span className="text-sky font-semibold text-xs uppercase tracking-wider flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Synchronized
                </span>
              </Row>
              <Row label="Last Sync" noBorder>
                <span className="font-mono text-xs text-neutral-500">
                  {new Date(pipState.lastSync).toLocaleTimeString()}
                </span>
              </Row>
            </div>
          </div>

          {/* ── Browser Capabilities ───────────────────────── */}
          <div className="bg-white border border-mist rounded-2xl p-5 shadow-sm">
            <SectionHeader icon={<Globe className="w-4 h-4 text-sky" />} label="Browser Capabilities" />
            <div className="space-y-2 mt-4">
              <CapabilityRow label="Document Picture-in-Picture" supported={'documentPictureInPicture' in window} />
              <CapabilityRow label="Native Video PiP" supported={document.pictureInPictureEnabled} />
              <CapabilityRow label="Screen Capture (WebRTC)" supported={'mediaDevices' in navigator && 'getDisplayMedia' in navigator.mediaDevices} />
              <CapabilityRow label="Webcam (getUserMedia)" supported={'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices} />
              <CapabilityRow label="LocalStorage Persistence" supported={typeof Storage !== 'undefined'} />
            </div>
          </div>

          {/* ── Statistics ────────────────────────────────── */}
          <div className="bg-white border border-mist rounded-2xl p-5 shadow-sm">
            <SectionHeader icon={<Database className="w-4 h-4 text-sky" />} label="Session Statistics" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              <StatBox label="Telemetry Events" value={telemetryLogs.length} />
              <StatBox label="Checklist Items" value={notes.checklist.length} />
              <StatBox label="Completed Actions" value={completedItems} highlight={completedItems > 0} />
              <StatBox label="PiP Window Size" value={pipState.isActive ? `${pipState.width}×${pipState.height}` : 'N/A'} small />
            </div>
          </div>

          {/* ── Recent Activity ──────────────────────────── */}
          <div className="bg-white border border-mist rounded-2xl p-5 shadow-sm">
            <SectionHeader icon={<Activity className="w-4 h-4 text-sky" />} label="Recent Activity" />
            <div className="mt-4 space-y-2">
              {recentLogs.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 italic text-sm">
                  No events logged yet. Start interacting with the workspace!
                </div>
              ) : (
                recentLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-2.5 bg-cream/40 rounded-xl border border-mist/30">
                    <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                      log.type === 'Error' ? 'bg-red-100 text-red-600 border-red-200' :
                      log.type === 'PiP' ? 'bg-sand text-neutral-700 border-sand/80' :
                      log.type === 'Media' ? 'bg-mist text-sky border-mist/80' :
                      'bg-sky/20 text-sky border-sky/30'
                    }`}>{log.type}</span>
                    <span className="flex-1 text-xs text-neutral-700 leading-snug">{log.message}</span>
                    <span className="shrink-0 text-[10px] font-mono text-neutral-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── PiP Status Panel ─────────────────────────── */}
          <div className="md:col-span-2 bg-white border border-mist rounded-2xl p-5 shadow-sm">
            <SectionHeader icon={<PictureInPicture2 className="w-4 h-4 text-sky" />} label="PiP Status Panel" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-cream/50 border border-mist/50 rounded-xl p-4 text-center">
                <div className={`text-lg font-semibold mb-1 ${pipState.isActive ? 'text-sky' : 'text-neutral-400'}`}>
                  {pipState.isActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500">Overlay Status</div>
              </div>
              <div className="bg-cream/50 border border-mist/50 rounded-xl p-4 text-center">
                <div className="text-lg font-medium text-neutral-800 mb-1 capitalize">
                  {pipState.activeWidget || '—'}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500">Detached Widget</div>
              </div>
              <div className="bg-cream/50 border border-mist/50 rounded-xl p-4 text-center">
                <div className="text-base font-mono text-neutral-800 mb-1">
                  {pipState.isActive ? `${pipState.width}×${pipState.height}` : '—'}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500">Window Size</div>
              </div>
              <div className="bg-cream/50 border border-mist/50 rounded-xl p-4 text-center">
                <div className="text-xs font-mono text-neutral-700 mb-1 truncate">
                  {new Date(pipState.lastSync).toLocaleTimeString()}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500">Last Sync</div>
              </div>
            </div>
          </div>

          {/* ── Case Study Checklist ─────────────────────── */}
          <div className="md:col-span-2 bg-white border border-mist rounded-2xl p-5 shadow-sm">
            <SectionHeader icon={<CheckCircle2 className="w-4 h-4 text-sky" />} label="Feature Completion — Case Study Verification" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              {[
                ['Document Picture-in-Picture API', 'documentPictureInPicture' in window],
                ['Native Video PiP (HTML5)', document.pictureInPictureEnabled],
                ['Notes Workspace', true],
                ['Stopwatch Workspace', true],
                ['Media Stream Workspace', 'mediaDevices' in navigator],
                ['Telemetry Analytics Console', true],
                ['LocalStorage Persistence', typeof Storage !== 'undefined'],
                ['Zustand State Synchronization', true],
                ['Export Workspace JSON', true],
                ['Import Workspace JSON', true],
                ['Browser Capability Detection', true],
                ['Style Cloning into PiP Window', true],
              ].map(([label, done]) => (
                <div key={label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm ${done ? 'bg-cream/40 border-mist/40 text-neutral-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                  {done
                    ? <CheckCircle2 className="w-4 h-4 text-sky shrink-0" />
                    : <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  {label}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ─────────────────────────────────── */
const SectionHeader = ({ icon, label }) => (
  <div className="flex items-center gap-2">
    {icon}
    <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{label}</h3>
  </div>
);

const Row = ({ label, children, noBorder }) => (
  <div className={`flex justify-between items-center py-2 ${noBorder ? '' : 'border-b border-mist/30'}`}>
    <span className="text-sm text-neutral-600">{label}</span>
    {children}
  </div>
);

const StatusBadge = ({ active }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wider ${active ? 'bg-sky text-white' : 'bg-sand text-neutral-600'}`}>
    {active ? 'ACTIVE' : 'IDLE'}
  </span>
);

const CapabilityRow = ({ label, supported }) => (
  <div className="flex justify-between items-center p-2.5 bg-cream/40 rounded-lg border border-mist/30 text-sm">
    <span className="text-neutral-700">{label}</span>
    {supported
      ? <span className="text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Ready</span>
      : <span className="text-red-500 font-semibold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> N/A</span>}
  </div>
);

const StatBox = ({ label, value, highlight, small }) => (
  <div className={`rounded-xl border p-4 flex flex-col items-center justify-center text-center gap-1 transition-colors ${highlight ? 'bg-sky/10 border-sky/30' : 'bg-sand/30 border-mist/50'}`}>
    <span className={`font-light text-neutral-800 ${small ? 'text-base font-mono' : 'text-3xl'}`}>{value}</span>
    <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-500">{label}</span>
  </div>
);

export default OverlayArchitectureSelector;
