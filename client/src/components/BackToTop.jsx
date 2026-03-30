import React, { useState, useEffect } from 'react';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="no-print"
      aria-label="العودة لأعلى"
      style={{
        position: 'fixed',
        bottom: '90px',
        left: '1.5rem',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0d9488, #0891b2)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 15px rgba(13,148,136,0.35)',
        cursor: 'pointer',
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
        animation: 'bounceIn 0.4s ease',
        transition: 'transform 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      ↑
      <style>{`@keyframes bounceIn { from { transform: scale(0); opacity:0; } to { transform: scale(1); opacity:1; } }`}</style>
    </button>
  );
};

export default BackToTop;
