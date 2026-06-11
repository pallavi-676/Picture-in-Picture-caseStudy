import React from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import { Plus, X, Type } from 'lucide-react';

const FloatingNotesWidget = () => {
  const { notes, updateNotes, addChecklistItem, toggleChecklistItem, removeChecklistItem } = useWorkspaceStore();
  const [newItemText, setNewItemText] = React.useState('');

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (newItemText.trim()) {
      addChecklistItem(newItemText.trim());
      setNewItemText('');
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-sand text-neutral-800 p-8 font-serif overflow-hidden">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-mist/60">
        <div className="p-2 bg-white/50 rounded-lg text-sky">
          <Type className="w-6 h-6" />
        </div>
        <input 
          type="text" 
          value={notes.title}
          onChange={(e) => updateNotes({ title: e.target.value })}
          className="text-3xl font-medium bg-transparent border-none outline-none flex-1 placeholder-neutral-400 text-neutral-900"
          placeholder="Note Title..."
        />
      </div>

      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-4">
        <div className="flex-1 min-h-[200px]">
          <textarea
            value={notes.content}
            onChange={(e) => updateNotes({ content: e.target.value })}
            placeholder="Start typing your rich notes here... Markdown supported in your mind!"
            className="w-full h-full resize-none bg-transparent border-none outline-none leading-relaxed text-lg text-neutral-800 placeholder-neutral-500/70"
          />
        </div>

        <div className="border-t border-mist/60 pt-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-600 mb-4">Action Items</h3>
          
          <div className="flex flex-col gap-3 mb-5">
            {notes.checklist.map((item) => (
              <div key={item.id} className="flex items-start gap-3 group bg-white/40 p-3 rounded-xl border border-mist/30 transition-colors hover:bg-white/60 hover:border-mist/60">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="peer w-5 h-5 appearance-none border-2 border-sky rounded bg-white checked:bg-sky cursor-pointer transition-colors"
                  />
                  {item.checked && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white pb-0.5">
                      ✓
                    </div>
                  )}
                </div>
                <span className={`flex-1 text-lg transition-colors ${item.checked ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                  {item.text}
                </span>
                <button 
                  onClick={() => removeChecklistItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddChecklist} className="flex gap-3">
            <input 
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add new action item..."
              className="flex-1 bg-white border border-mist rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent transition-all shadow-sm"
            />
            <button type="submit" className="px-5 py-3 bg-sky text-white rounded-xl hover:bg-sky/90 shadow-sm transition-colors" disabled={!newItemText.trim()}>
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FloatingNotesWidget;
