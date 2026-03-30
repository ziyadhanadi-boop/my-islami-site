import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Azkar = ({ title, category }) => {
  const [activeZikr, setActiveZikr] = useState(0);
  const [count, setCount] = useState(0);
  const [azkarList, setAzkarList] = useState([]);

  useEffect(() => {
    const fetchAzkar = async () => {
      try {
        const res = await axios.get('/api/zikr');
        if (res.data.length > 0) {
          const filtered = res.data.filter(z => z.category === category);
          setAzkarList(filtered);
        }
      } catch (error) {
        console.error('Error fetching azkar', error);
      }
    };
    fetchAzkar();
  }, [category]);

  const handleNext = () => {
    setActiveZikr((prev) => (prev + 1) % azkarList.length);
    setCount(0);
  };

  const handlePrev = () => {
    setActiveZikr((prev) => (prev - 1 + azkarList.length) % azkarList.length);
    setCount(0);
  };

  if (azkarList.length === 0) return null;

  return (
    <div className="card" style={{ 
      padding: '2rem', 
      marginBottom: '2rem', 
      textAlign: 'center', 
      background: 'linear-gradient(145deg, var(--surface-color), var(--bg-color))',
      border: '1px solid var(--border-color)',
      position: 'relative'
    }}>
      <h3 style={{ marginBottom: '2rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{category === 'اذكار الصباح' ? '🌅' : category === 'اذكار المساء' ? '🌙' : '📿'}</span> {title}
      </h3>
      
      <div style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '2rem', padding: '0 1rem' }}>
        <p style={{ 
          fontSize: 'clamp(1.1rem, 5vw, 1.5rem)', 
          fontWeight: 'bold', 
          marginBottom: '0.75rem', 
          lineHeight: '1.6',
          color: 'var(--text-primary)'
        }}>
          {azkarList[activeZikr].text}
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          {azkarList[activeZikr].description}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(1rem, 10vw, 3rem)', marginBottom: '2rem' }}>
        <button onClick={handlePrev} className="btn zikr-nav-btn" style={{ 
          fontSize: '2.5rem', 
          background: 'none', 
          color: 'var(--primary-color)',
          padding: '1rem',
          opacity: 0.7
        }}>‹</button>
        
        <div 
          onClick={() => {
            if (count < (azkarList[activeZikr].count || 1)) {
              setCount(count + 1);
            }
          }}
          onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; if (window.navigator.vibrate) window.navigator.vibrate(5); }}
          onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          style={{ 
            width: 'clamp(110px, 30vw, 150px)', 
            height: 'clamp(110px, 30vw, 150px)', 
            borderRadius: '50%', 
            background: count >= (azkarList[activeZikr].count || 1) ? '#22c55e' : 'var(--primary-color)', 
            color: 'white', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: count >= (azkarList[activeZikr].count || 1) ? 'default' : 'pointer',
            boxShadow: count >= (azkarList[activeZikr].count || 1) ? '0 12px 24px rgba(34, 197, 94, 0.35)' : '0 12px 24px rgba(13, 148, 136, 0.35)',
            userSelect: 'none',
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <span style={{ fontSize: 'clamp(2.2rem, 10vw, 3rem)', fontWeight: 'bold' }}>{count}</span>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', width: '40%', margin: '4px 0' }}></div>
          <span style={{ fontSize: '1rem', opacity: 0.8 }}>{azkarList[activeZikr].count || 1}</span>
        </div>
        
        <button onClick={handleNext} className="btn zikr-nav-btn" style={{ 
          fontSize: '2.5rem', 
          background: 'none', 
          color: 'var(--primary-color)',
          padding: '1rem',
          opacity: 0.7
        }}>›</button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .zikr-nav-btn { fontSize: 3rem !important; padding: 0.5rem !important; }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button onClick={() => setCount(0)} className="btn btn-danger" style={{ 
          padding: '0.4rem 1.25rem', 
          fontSize: '0.85rem',
          borderRadius: '2rem'
        }}>تصفير العداد</button>
      </div>

      <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {activeZikr + 1} / {azkarList.length}
      </div>
    </div>
  );
};

export default Azkar;
