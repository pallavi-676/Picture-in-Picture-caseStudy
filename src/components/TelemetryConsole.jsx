import React, { useState, useMemo } from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import { Terminal, Trash2, Activity, Search, Download, Filter, Clock, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['All', 'System', 'PiP', 'Media', 'Workspace', 'Error'];

const TAG_STYLES = {
  System:    'bg-sky/20 text-sky border-sky/30',
  PiP:       'bg-sand border-sand/80 text-neutral-700',
  Media:     'bg-mist text-sky border-mist/80',
  Workspace: 'bg-purple-100 text-purple-700 border-purple-200',
  Error:     'bg-red-100 text-red-600 border-red-200',
};

const TelemetryConsole = () => {
  const { telemetryLogs, clearLogs, pipState } = useWorkspaceStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return telemetryLogs.filter(log => {
      const matchesCategory = activeCategory === 'All' || log.type === activeCategory;
      const matchesSearch = !searchQuery || 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [telemetryLogs, activeCategory, searchQuery]);

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Category', 'Message'].join(','),
      ...filteredLogs.map(l => [
        new Date(l.timestamp).toISOString(),
        l.type,
        `"${l.message.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const latestEvent = telemetryLogs[0];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-cream font-serif overflow-hidden">

      {/* Page Header */}
      <div className="shrink-0 px-6 py-4 bg-white border-b border-mist shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-neutral-800 flex items-center gap-3">
            <div className="p-1.5 bg-mist/50 rounded-lg text-sky">
              <Activity className="w-5 h-5" />
            </div>
            Telemetry Analytics
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={exportLogs}
              disabled={filteredLogs.length === 0}
              className="enterprise-button enterprise-button-secondary bg-mist/40 hover:bg-mist/60 text-sky border border-mist text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </button>
            <button
              onClick={clearLogs}
              disabled={telemetryLogs.length === 0}
              className="enterprise-button enterprise-button-danger text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear All
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-cream/70 border border-mist/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-light text-neutral-800">{telemetryLogs.length}</div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-0.5">Total Events</div>
          </div>
          <div className="bg-cream/70 border border-mist/50 rounded-xl p-3 text-center">
            <div className="text-2xl font-light text-neutral-800">{filteredLogs.length}</div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-0.5">Filtered</div>
          </div>
          <div className="bg-cream/70 border border-mist/50 rounded-xl p-3 text-center">
            <div className="text-xs font-mono text-neutral-700 truncate">
              {latestEvent ? new Date(latestEvent.timestamp).toLocaleTimeString() : '—'}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 mt-0.5">Latest Event</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search events by message or category..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-mist rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky/30 focus:border-sky transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wider border transition-all ${
                activeCategory === cat
                  ? 'bg-sky text-neutral-900 border-sky shadow-sm'
                  : 'bg-white text-neutral-600 border-mist hover:border-sky/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PiP Quick Status */}
      <div className="shrink-0 px-6 py-3 bg-white border-b border-mist flex gap-4 text-xs font-mono text-neutral-600 flex-wrap">
        <span>PiP: <span className={pipState.isActive ? 'text-sky font-bold' : 'text-neutral-400'}>{pipState.isActive ? 'ACTIVE' : 'IDLE'}</span></span>
        <span>Widget: <span className="text-neutral-800">{pipState.activeWidget || 'None'}</span></span>
        <span>Window: <span className="text-neutral-800">{pipState.width}×{pipState.height}</span></span>
        <span>API: <span className={pipState.isSupported ? 'text-sky font-bold' : 'text-red-400 font-bold'}>{pipState.isSupported ? 'Supported' : 'Unsupported'}</span></span>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-16 h-16 bg-mist/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-mist/50">
              <Terminal className="w-7 h-7 text-sky opacity-70" />
            </div>
            <h3 className="text-lg font-medium text-neutral-700 mb-2">
              {searchQuery || activeCategory !== 'All' ? 'No matching events' : 'No events logged yet'}
            </h3>
            <p className="text-sm text-neutral-500 max-w-xs">
              {searchQuery || activeCategory !== 'All' 
                ? 'Try adjusting your search query or category filter.'
                : 'System, media, and PiP events will appear here as you interact with the workspace.'}
            </p>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={log.id}
              className={`flex gap-3 p-3 rounded-xl border transition-all hover:border-sky/30 hover:shadow-sm ${
                index % 2 === 0 ? 'bg-white border-mist/40' : 'bg-sand/10 border-transparent'
              }`}
            >
              <div className="flex items-center shrink-0 mt-0.5">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${TAG_STYLES[log.type] || 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                  {log.type}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-neutral-700 text-sm leading-snug">{log.message}</p>
              </div>
              <div className="shrink-0 flex items-start gap-1 text-neutral-400 text-[11px] font-mono whitespace-nowrap">
                <Clock className="w-3 h-3 mt-0.5" />
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TelemetryConsole;
