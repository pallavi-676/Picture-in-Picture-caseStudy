import React, { useRef, useState } from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import {
  Maximize2, Minimize2, Settings,
  Download, Upload, RotateCcw, Trash2,
  CheckCircle2, XCircle
} from 'lucide-react';

const TransportActionStrip = ({ onRequestPip, onClosePip, isPipOpen }) => {
  const {
    activeTab,
    exportWorkspace,
    importWorkspace,
    restoreWorkspace,
    resetWorkspace,
  } = useWorkspaceStore();

  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null); // { ok: bool, message: string }

  const showToast = (result) => {
    setToast(result);
    setTimeout(() => setToast(null), 4000);
  };

  // ── Import: file picker → read → parse → merge ──────────────
  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = importWorkspace(ev.target.result);
      showToast(result);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── Restore: reads LocalStorage directly ────────────────────
  const handleRestore = () => {
    const result = restoreWorkspace();
    showToast(result);
  };

  // ── Reset: confirm then wipe ─────────────────────────────────
  const handleReset = () => {
    if (window.confirm('Reset workspace to factory defaults? All notes, checklist items, and stopwatch data will be cleared. This cannot be undone.')) {
      resetWorkspace();
      showToast({ ok: true, message: 'Workspace reset to factory defaults.' });
    }
  };

  const canOpenPip = ['notes', 'stopwatch', 'media', 'telemetry'].includes(activeTab);

  return (
    <div className="shrink-0 border-b border-mist bg-white">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">

        {/* Label */}
        <div className="flex items-center gap-2 mr-2">
          <div className="p-1.5 bg-cream rounded-lg text-neutral-400">
            <Settings className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Transport Controls
          </h2>
        </div>

        <div className="flex-1" />

        {/* ── PiP Toggle ─────────────────────────────── */}
        {isPipOpen ? (
          <button
            onClick={onClosePip}
            className="enterprise-button enterprise-button-danger text-sm"
          >
            <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
            Close Floating
          </button>
        ) : (
          <button
            onClick={() => onRequestPip(activeTab)}
            disabled={!canOpenPip}
            title={canOpenPip ? 'Open current widget in PiP window' : 'Select Notes, Stopwatch, Media or Telemetry first'}
            className={`enterprise-button enterprise-button-primary text-sm ${!canOpenPip ? 'opacity-50 cursor-not-allowed' : 'shadow-md shadow-sky/20'}`}
          >
            <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
            Initialize PiP
          </button>
        )}

        <div className="w-px h-7 bg-mist mx-1" />

        {/* ── Export ─────────────────────────────────── */}
        <button
          onClick={exportWorkspace}
          title="Export workspace configuration to a JSON file"
          className="enterprise-button enterprise-button-secondary text-sm"
        >
          <Download className="w-3.5 h-3.5 mr-1.5 text-sky" />
          Export
        </button>

        {/* ── Import ─────────────────────────────────── */}
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleImportClick}
          title="Import workspace configuration from a JSON file"
          className="enterprise-button enterprise-button-secondary text-sm"
        >
          <Upload className="w-3.5 h-3.5 mr-1.5 text-sky" />
          Import
        </button>

        {/* ── Restore ────────────────────────────────── */}
        <button
          onClick={handleRestore}
          title="Restore workspace from the last LocalStorage save point"
          className="enterprise-button enterprise-button-secondary text-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-sky" />
          Restore
        </button>

        {/* ── Reset ──────────────────────────────────── */}
        <button
          onClick={handleReset}
          title="Reset workspace to factory defaults"
          className="enterprise-button bg-white text-red-400 border border-red-100 hover:bg-red-50 hover:border-red-200 text-sm"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Toast Banner ──────────────────────────────── */}
      {toast && (
        <div
          className={`flex items-start gap-3 px-5 py-2.5 text-sm font-serif border-t transition-all ${
            toast.ok
              ? 'bg-sky/10 border-sky/20 text-sky'
              : 'bg-red-50 border-red-100 text-red-600'
          }`}
        >
          {toast.ok
            ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
          }
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default TransportActionStrip;
