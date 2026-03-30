import React, { useContext } from 'react';
import { AudioContext } from '../context/AudioContext';

const GlobalAudioPlayer = () => {
  const { currentTrack, isPlaying, progress, togglePlay, closePlayer } = useContext(AudioContext);

  if (!currentTrack) return null;

  return (
    <>
      <style>{`
        .global-audio-player {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 80px;
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255,255,255,0.1);
          color: white;
          z-index: 9998; /* Just below chat widget */
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.2);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          direction: rtl;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .audio-progress-bar {
          position: absolute;
          top: -2px; left: 0; height: 3px;
          background: var(--primary-light);
          transition: width 0.1s linear;
        }
        .audio-controls {
          display: flex; gap: 1rem; align-items: center; justify-content: center;
        }
        .ctrl-btn {
          background: none; border: none; color: white;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          width: 45px; height: 45px; border-radius: 50%;
          font-size: 1.5rem; transition: background 0.2s, transform 0.2s;
        }
        .ctrl-btn:hover { background: rgba(255,255,255,0.1); transform: scale(1.05); }
        .play-pause {
          background: var(--primary-color) !important; color: white; width: 55px; height: 55px;
          box-shadow: 0 4px 15px rgba(13,148,136,0.4);
        }
        .play-pause:hover { background: var(--primary-dark) !important; transform: scale(1.1); }
      `}</style>
      <div className="global-audio-player no-print">
        <div className="audio-progress-bar" style={{ width: `${progress}%` }}></div>
        
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto', gap: '1.5rem' }}>
          {/* Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, overflow: 'hidden' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
              🎧
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{currentTrack.title}</h4>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>المشغل الإسلامي المتقدم</span>
            </div>
          </div>

          {/* Controls */}
          <div className="audio-controls">
            <button className="ctrl-btn play-pause" onClick={togglePlay} title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </div>

          {/* Close */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
            <button className="ctrl-btn" onClick={closePlayer} title="إغلاق المشغل" style={{ width: '35px', height: '35px', fontSize: '1.2rem', color: '#94a3b8' }}>
              ✕
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalAudioPlayer;
