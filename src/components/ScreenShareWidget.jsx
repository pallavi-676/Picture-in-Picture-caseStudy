import React, { useRef, useEffect, useState } from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import {
  MonitorUp, Video as VideoIcon, StopCircle, UploadCloud,
  PictureInPicture2, Info, Clock, Wifi, WifiOff
} from 'lucide-react';

const ScreenShareWidget = () => {
  const { media, updateMediaState, addLog } = useWorkspaceStore();
  const videoRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const [resolution, setResolution] = useState(null);

  // Attach global stream on every mount — this is the critical PiP fix
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (media.streamObject) {
      video.srcObject = media.streamObject;
      video.src = '';
      video.play().catch(() => {});

      // Read resolution from track settings
      const track = media.streamObject.getVideoTracks()[0];
      if (track) {
        const s = track.getSettings();
        setResolution(s.width && s.height ? `${s.width}×${s.height}` : null);
      }
    } else if (media.videoObjectUrl) {
      video.srcObject = null;
      video.src = media.videoObjectUrl;
      video.play().catch(() => {});
      setResolution(null);
    } else {
      video.srcObject = null;
      video.src = '';
      setResolution(null);
    }
  }, [media.streamObject, media.videoObjectUrl]);

  // Elapsed timer — resets when source changes
  useEffect(() => {
    if (media.activeSource === 'none') { setElapsed(0); return; }
    const t0 = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 1000);
    return () => clearInterval(id);
  }, [media.activeSource]);

  const fmtElapsed = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  /* ── Actions ───────────────────────────────────────── */
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      handleStream(stream, 'screen');
    } catch (err) {
      addLog('Error', `Screen share failed: ${err.message}`);
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      handleStream(stream, 'webcam');
    } catch (err) {
      addLog('Error', `Webcam failed: ${err.message}`);
    }
  };

  const handleStream = (stream, type) => {
    stopMedia();
    updateMediaState({ activeSource: type, streamObject: stream });
    addLog('Media', `Started ${type} stream`);
    stream.getVideoTracks()[0].onended = () => stopMedia();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    stopMedia();
    const url = URL.createObjectURL(file);
    updateMediaState({ activeSource: 'video', videoFileName: file.name, videoObjectUrl: url });
    addLog('Media', `Loaded video file: ${file.name}`);
    e.target.value = '';
  };

  const stopMedia = () => {
    if (media.streamObject) media.streamObject.getTracks().forEach(t => t.stop());
    if (media.videoObjectUrl) URL.revokeObjectURL(media.videoObjectUrl);
    if (media.activeSource !== 'none') addLog('Media', 'Stream terminated');
    updateMediaState({ activeSource: 'none', videoFileName: '', streamObject: null, videoObjectUrl: null });
  };

  const requestNativePip = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
          addLog('Media', 'Video detached to native HTML5 PiP');
        }
      } catch (err) {
        addLog('Error', `Native PiP: ${err.message}`);
      }
    } else {
      alert('Native Video PiP is not supported in this browser.');
    }
  };

  const isIdle = media.activeSource === 'none';

  /* ── Labels ─────────────────────────────────────────── */
  const sourceLabel = {
    none: 'No Source',
    screen: 'Desktop Capture',
    webcam: 'Webcam (WebRTC)',
    video: `Local File`,
  }[media.activeSource];

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-cream p-4 overflow-hidden">
      <div className="flex flex-col h-full bg-white border border-mist rounded-2xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-5 py-3 bg-white border-b border-mist flex justify-between items-center shrink-0">
          <h2 className="text-base font-medium text-neutral-800 flex items-center gap-2">
            <div className="p-1.5 bg-mist/30 text-sky rounded-lg">
              <VideoIcon className="w-4 h-4" />
            </div>
            Universal Media Stream
          </h2>
          <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider border ${
            isIdle ? 'bg-sand/50 text-neutral-500 border-mist/50' : 'bg-sky/20 text-sky border-sky/30'
          }`}>
            {isIdle ? 'IDLE' : `${media.activeSource.toUpperCase()} ACTIVE`}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">

          {/* Video Stage */}
          <div className="flex-1 bg-sand/10 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-mist overflow-hidden">
            {isIdle ? (
              <div className="text-center text-neutral-400 max-w-xs">
                <div className="w-16 h-16 mx-auto mb-4 bg-mist/20 rounded-full flex items-center justify-center border border-mist/50">
                  <MonitorUp className="w-7 h-7 text-sky opacity-70" />
                </div>
                <h3 className="text-base font-medium text-neutral-700 mb-1">Awaiting Source</h3>
                <p className="text-sm font-serif leading-relaxed">Use the toolbar to select a screen, webcam, or uploaded video.</p>
              </div>
            ) : (
              <div className="relative w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow-md border border-mist bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  controls={media.activeSource === 'video'}
                  autoPlay
                  playsInline
                  muted={media.activeSource === 'webcam'}
                />
              </div>
            )}
            {/* Hidden when idle so ref still mounts */}
            {isIdle && (
              <video ref={videoRef} className="hidden" autoPlay playsInline muted />
            )}
          </div>

          {/* Stream Info Panel */}
          <div className="w-full md:w-56 bg-cream/30 p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky" /> Stream Details
            </h3>

            <InfoItem label="Source Interface" value={sourceLabel} />
            {media.activeSource === 'video' && (
              <InfoItem label="Filename" value={media.videoFileName} mono truncate />
            )}
            <InfoItem label="Resolution" value={resolution || (isIdle ? '—' : 'Detecting…')} mono />
            <InfoItem
              label="Connection"
              value={
                <span className={`flex items-center gap-1.5 text-sm font-medium ${isIdle ? 'text-neutral-400' : 'text-green-700'}`}>
                  {isIdle
                    ? <><WifiOff className="w-3.5 h-3.5" /> Offline</>
                    : <><Wifi className="w-3.5 h-3.5" /> Broadcasting</>}
                </span>
              }
            />
            <InfoItem
              label="Duration"
              value={
                <span className="flex items-center gap-1.5 font-mono text-sm text-neutral-700">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  {isIdle ? '—' : fmtElapsed(elapsed)}
                </span>
              }
            />
          </div>
        </div>

        {/* Toolbar — always visible, buttons disable when needed */}
        <div className="px-5 py-3 bg-white border-t border-mist flex flex-wrap gap-3 items-center justify-center shrink-0">
          <button
            onClick={startScreenShare}
            disabled={!isIdle}
            className="enterprise-button enterprise-button-secondary bg-mist/40 hover:bg-mist/60 text-sky border border-mist disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MonitorUp className="w-4 h-4 mr-1.5" /> Share Screen
          </button>

          <button
            onClick={startWebcam}
            disabled={!isIdle}
            className="enterprise-button enterprise-button-secondary bg-mist/40 hover:bg-mist/60 text-sky border border-mist disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <VideoIcon className="w-4 h-4 mr-1.5" /> Enable Webcam
          </button>

          <label className={`enterprise-button enterprise-button-secondary border border-mist ${!isIdle ? 'opacity-40 cursor-not-allowed bg-mist/20' : 'bg-mist/40 hover:bg-mist/60 text-sky cursor-pointer'}`}>
            <UploadCloud className="w-4 h-4 mr-1.5" /> Upload Video
            <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} disabled={!isIdle} />
          </label>

          <div className="w-px h-7 bg-mist mx-1 hidden sm:block" />

          <button
            onClick={requestNativePip}
            disabled={isIdle}
            className="enterprise-button bg-sky text-white shadow-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <PictureInPicture2 className="w-4 h-4 mr-1.5" /> Detach Video
          </button>

          <button
            onClick={stopMedia}
            disabled={isIdle}
            className="enterprise-button enterprise-button-danger disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <StopCircle className="w-4 h-4 mr-1.5" /> Stop Stream
          </button>
        </div>

      </div>
    </div>
  );
};

/* ── Helper ─────────────────────────────────────────── */
const InfoItem = ({ label, value, mono, truncate }) => (
  <div>
    <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-0.5">{label}</div>
    <div className={`text-neutral-800 font-medium text-sm ${mono ? 'font-mono' : ''} ${truncate ? 'truncate' : ''}`}>
      {value}
    </div>
  </div>
);

export default ScreenShareWidget;
