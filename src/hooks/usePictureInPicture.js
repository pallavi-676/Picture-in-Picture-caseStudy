import { useState, useEffect, useCallback } from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import { cloneStyles } from '../utils/styleCloner';

export const usePictureInPicture = () => {
  const [pipWindow, setPipWindow] = useState(null);
  const [pipContainer, setPipContainer] = useState(null);
  const { pipState, updatePipState, openPip, closePip, addLog } = useWorkspaceStore();

  // Check support on mount
  useEffect(() => {
    const isSupported = 'documentPictureInPicture' in window;
    updatePipState({ isSupported });
    if (!isSupported) {
      addLog('System', 'Document Picture-in-Picture API is not supported in this browser.');
    }
  }, [updatePipState, addLog]);

  const requestPipWindow = useCallback(async (widgetId) => {
    if (!('documentPictureInPicture' in window)) {
      alert('Document Picture-in-Picture is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    if (pipWindow) {
      pipWindow.close();
    }

    try {
      addLog('System', `Requesting PiP window for ${widgetId}...`);
      
      const newPipWindow = await window.documentPictureInPicture.requestWindow({
        width: pipState.width,
        height: pipState.height,
      });

      // Ensure styles are perfectly cloned
      cloneStyles(newPipWindow.document);

      // Create Container that matches application body
      const container = newPipWindow.document.createElement('div');
      container.id = 'pip-root';
      container.style.width = '100%';
      container.style.height = '100vh';
      container.style.overflow = 'auto';
      container.style.backgroundColor = 'var(--color-cream, #EAE5C7)';
      
      newPipWindow.document.body.appendChild(container);

      // Update local state
      setPipWindow(newPipWindow);
      setPipContainer(container);
      
      // CRITICAL: Update global Zustand store so the portal targets this widget
      openPip(widgetId);

      // Listeners
      newPipWindow.addEventListener('pagehide', () => {
        setPipWindow(null);
        setPipContainer(null);
        closePip();
      });

      newPipWindow.addEventListener('resize', () => {
        updatePipState({ 
          width: newPipWindow.innerWidth, 
          height: newPipWindow.innerHeight 
        });
      });

      return container;

    } catch (error) {
      console.error('Failed to open PiP window:', error);
      addLog('Error', `Failed to open PiP: ${error.message}`);
    }
  }, [pipWindow, pipState.width, pipState.height, addLog, openPip, closePip, updatePipState]);

  const closePipWindow = useCallback(() => {
    if (pipWindow) {
      pipWindow.close(); // Triggers pagehide event
    }
  }, [pipWindow]);

  return {
    isSupported: pipState.isSupported,
    pipWindow,
    pipContainer,
    requestPipWindow,
    closePipWindow
  };
};
