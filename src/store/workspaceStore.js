import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWorkspaceStore = create(
  persist(
    (set, get) => ({
      // Application State
      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Telemetry Logs
      telemetryLogs: [],
      addLog: (type, message) => set((state) => {
        // Prevent rapid duplicate spam
        const lastLog = state.telemetryLogs[0];
        if (lastLog && lastLog.type === type && lastLog.message === message) {
          return state; // Skip duplicate
        }

        const newLog = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          type,
          message
        };
        // Keep last 100 logs
        const updatedLogs = [newLog, ...state.telemetryLogs].slice(0, 100);
        return { telemetryLogs: updatedLogs };
      }),
      clearLogs: () => set({ telemetryLogs: [] }),

      // Notes Widget State
      notes: {
        title: 'Workspace Notes',
        content: '# Welcome to your Premium Workspace\n\nThis is a safe space for your thoughts, detached from the browser frame. \n\n### Quick Tips:\n- Click "Initialize PiP Overlay" to detach this editor.\n- Add tasks to your checklist below.\n- Your content saves automatically to LocalStorage.',
        checklist: []
      },
      updateNotes: (updates) => set((state) => ({
        notes: { ...state.notes, ...updates }
      })),
      addChecklistItem: (text) => set((state) => ({
        notes: {
          ...state.notes,
          checklist: [...state.notes.checklist, { id: Date.now().toString(), text, checked: false }]
        }
      })),
      toggleChecklistItem: (id) => set((state) => ({
        notes: {
          ...state.notes,
          checklist: state.notes.checklist.map(item => 
            item.id === id ? { ...item, checked: !item.checked } : item
          )
        }
      })),
      removeChecklistItem: (id) => set((state) => ({
        notes: {
          ...state.notes,
          checklist: state.notes.checklist.filter(item => item.id !== id)
        }
      })),

      // Stopwatch Widget State
      stopwatch: {
        time: 0,
        isRunning: false,
        lastUpdated: null,
        startTime: null
      },
      updateStopwatch: (updates) => set((state) => ({
        stopwatch: { ...state.stopwatch, ...updates }
      })),
      resetStopwatch: () => set((state) => ({
        stopwatch: { time: 0, isRunning: false, lastUpdated: null, startTime: null }
      })),

      // PiP Overlay State
      pipState: {
        isActive: false,
        activeWidget: null, // 'notes', 'stopwatch', 'screen', 'webcam', 'telemetry'
        width: 450,
        height: 500,
        isSupported: true, // Will be updated by detection
        lastSync: new Date().toISOString()
      },
      updatePipState: (updates) => set((state) => ({
        pipState: { ...state.pipState, ...updates, lastSync: new Date().toISOString() }
      })),
      openPip: (widgetId) => set((state) => {
        get().addLog('PiP', `Opened overlay window for ${widgetId}`);
        return { pipState: { ...state.pipState, isActive: true, activeWidget: widgetId, lastSync: new Date().toISOString() } };
      }),
      closePip: () => set((state) => {
        get().addLog('PiP', 'Closed overlay window');
        return { pipState: { ...state.pipState, isActive: false, activeWidget: null, lastSync: new Date().toISOString() } };
      }),

      // Media State - CRITICAL: streamObject stored globally so it persists across React Portal remounts
      media: {
        activeSource: 'none', // 'none', 'screen', 'webcam', 'video'
        videoFileName: '',
        streamObject: null, 
        videoObjectUrl: null
      },
      updateMediaState: (updates) => set((state) => ({
        media: { ...state.media, ...updates }
      })),

      // ── Workspace Actions ────────────────────────────────────────────

      // EXPORT: Serialise persistent workspace data to a clean JSON file.
      // Never includes: telemetry, streams, active PiP references.
      exportWorkspace: () => {
        const s = get();
        const payload = {
          workspaceVersion: '2.0',
          exportDate: new Date().toISOString(),
          activeTab: s.activeTab,
          notes: s.notes,
          stopwatch: {
            time: s.stopwatch.time,
            isRunning: false,
            startTime: null,
            lastUpdated: null,
          },
          pipPreferences: {
            width: s.pipState.width,
            height: s.pipState.height,
          },
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workspace-export-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        get().addLog('Workspace', 'Exported workspace configuration to JSON');
      },

      // IMPORT: Merge a JSON file into current state.
      // Validates structure before applying. Never restores streams or PiP.
      // Backward-compatible with old _schema format and new workspaceVersion format.
      importWorkspace: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          if (!parsed || typeof parsed !== 'object') throw new Error('Not a valid workspace object');

          // Detect old format (had _schema + telemetryLogs) vs new format (workspaceVersion)
          const isLegacy = '_schema' in parsed && !('workspaceVersion' in parsed);

          set((state) => ({
            // ✓ Notes (title + content + checklist)
            notes: parsed.notes ?? state.notes,
            // ✓ Active tab
            activeTab: parsed.activeTab ?? state.activeTab,
            // ✓ Stopwatch time — never resume running state
            stopwatch: {
              ...state.stopwatch,
              time: parsed.stopwatch?.time ?? state.stopwatch.time,
              isRunning: false,
              startTime: null,
            },
            // ✓ PiP window dimensions only — never isActive or activeWidget
            pipState: {
              ...state.pipState,
              width: parsed.pipPreferences?.width ?? state.pipState.width,
              height: parsed.pipPreferences?.height ?? state.pipState.height,
              isActive: false,
              activeWidget: null,
            },
            // ✗ Never restore streams (regardless of format)
            media: { activeSource: 'none', videoFileName: '', streamObject: null, videoObjectUrl: null },
          }));

          get().addLog('Workspace', `Imported workspace from JSON file${isLegacy ? ' (legacy format)' : ''}`);
          return { ok: true, message: `Workspace imported successfully.${isLegacy ? ' (Legacy v1 format detected)' : ''}` };
        } catch (e) {
          get().addLog('Error', `Import failed: ${e.message}`);
          return { ok: false, message: `Invalid workspace file — ${e.message}` };
        }
      },

      // RESTORE: Read the current Zustand-persisted LocalStorage snapshot
      // and re-apply persistent fields. Never touches streams or PiP state.
      restoreWorkspace: () => {
        try {
          const raw = localStorage.getItem('pip-workspace-storage');
          if (!raw) {
            get().addLog('Workspace', 'Restore attempted but no LocalStorage snapshot found');
            return { ok: false, message: 'No saved workspace found in local storage.' };
          }
          const persisted = JSON.parse(raw);
          // Zustand-persist wraps data under { state: {...} }
          const saved = persisted?.state ?? persisted;

          set((state) => ({
            notes: saved.notes ?? state.notes,
            activeTab: saved.activeTab ?? state.activeTab,
            stopwatch: {
              ...state.stopwatch,
              time: saved.stopwatch?.time ?? state.stopwatch.time,
              isRunning: false,
              startTime: null,
            },
            pipState: {
              ...state.pipState,
              width: saved.pipState?.width ?? state.pipState.width,
              height: saved.pipState?.height ?? state.pipState.height,
              isActive: false,
              activeWidget: null,
            },
            // Never restore streams
            media: { activeSource: 'none', videoFileName: '', streamObject: null, videoObjectUrl: null },
          }));

          get().addLog('Workspace', 'Restored workspace from LocalStorage');
          return { ok: true, message: 'Workspace restored from local storage.' };
        } catch (e) {
          get().addLog('Error', `Restore failed: ${e.message}`);
          return { ok: false, message: 'Restore failed. LocalStorage data may be corrupted.' };
        }
      },

      // RESET: Wipe all state back to factory defaults.
      resetWorkspace: () => {
        set({
          activeTab: 'dashboard',
          telemetryLogs: [],
          notes: {
            title: 'Workspace Notes',
            content: '# Welcome to your Premium Workspace\n\nThis is a safe space for your thoughts, detached from the browser frame. \n\n### Quick Tips:\n- Click "Initialize PiP Overlay" to detach this editor.\n- Add tasks to your checklist below.\n- Your content saves automatically to LocalStorage.',
            checklist: []
          },
          stopwatch: { time: 0, isRunning: false, lastUpdated: null, startTime: null },
          media: { activeSource: 'none', videoFileName: '', streamObject: null, videoObjectUrl: null },
        });
        get().addLog('Workspace', 'Workspace reset to factory defaults');
      }
    }),
    {
      name: 'pip-workspace-storage',
      // We don't want to persist the PiP window's physical existence or transient running states or MediaStream objects
      partialize: (state) => ({
        activeTab: state.activeTab,
        notes: state.notes,
        stopwatch: { ...state.stopwatch, isRunning: false },
        media: { activeSource: 'none', videoFileName: '', streamObject: null, videoObjectUrl: null }, // Reset media on load
        pipState: { ...state.pipState, isActive: false, activeWidget: null }
      }),
    }
  )
);

export default useWorkspaceStore;
