import React, { useEffect, useState, useRef } from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

const StopwatchWidget = () => {
  const { stopwatch, updateStopwatch, resetStopwatch } = useWorkspaceStore();
  const [displayTime, setDisplayTime] = useState(stopwatch.time);
  const frameRef = useRef();

  // Handle local high-speed rendering without spamming Zustand
  useEffect(() => {
    if (stopwatch.isRunning && stopwatch.startTime) {
      const updateLoop = () => {
        const now = Date.now();
        setDisplayTime(now - stopwatch.startTime);
        frameRef.current = requestAnimationFrame(updateLoop);
      };
      frameRef.current = requestAnimationFrame(updateLoop);
    } else {
      setDisplayTime(stopwatch.time); // Sync back to store when stopped
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [stopwatch.isRunning, stopwatch.startTime, stopwatch.time]);

  const handleStart = () => {
    updateStopwatch({ 
      isRunning: true, 
      startTime: Date.now() - stopwatch.time 
    });
  };

  const handlePause = () => {
    updateStopwatch({ 
      isRunning: false, 
      time: displayTime 
    });
  };

  const handleReset = () => {
    resetStopwatch();
    setDisplayTime(0);
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-cream p-12 overflow-auto">
      <div className="bg-white border border-mist rounded-3xl p-16 shadow-sm flex flex-col items-center w-full max-w-2xl">
        <div className="mb-10 flex flex-col items-center">
          <div className="p-4 bg-mist/30 rounded-2xl mb-6">
            <Timer className="w-10 h-10 text-sky" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-500 uppercase tracking-widest">Focus Session</h2>
        </div>

        <div className="text-7xl md:text-8xl font-serif tracking-tight text-neutral-800 mb-16 tabular-nums font-light drop-shadow-sm">
          {formatTime(displayTime)}
        </div>

        <div className="flex gap-6">
          {!stopwatch.isRunning ? (
            <button 
              onClick={handleStart}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-sky text-white hover:bg-sky/90 transition-all duration-300 active:scale-95 shadow-md shadow-sky/30 hover:shadow-lg hover:-translate-y-1"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          ) : (
            <button 
              onClick={handlePause}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-white border border-mist text-sky hover:bg-mist/30 transition-all duration-300 active:scale-95 shadow-sm hover:-translate-y-1"
            >
              <Pause className="w-8 h-8" />
            </button>
          )}

          <button 
            onClick={handleReset}
            className="w-20 h-20 flex items-center justify-center rounded-full bg-sand/30 text-neutral-600 border border-mist hover:bg-sand/60 transition-all duration-300 active:scale-95 shadow-sm hover:-translate-y-1"
          >
            <RotateCcw className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopwatchWidget;
