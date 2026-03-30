import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DailyQuote = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Only show once per session to avoid annoying the user
    const hasSeenQuote = sessionStorage.getItem('has_seen_quote');

    if (!hasSeenQuote) {
      const fetchQuote = async () => {
        try {
          const res = await axios.get('/api/daily-quotes/random');
          if (res.data && res.data.text) {
            setQuote(res.data.text);
            // Delay before showing
            setTimeout(() => {
              setIsVisible(true);
            }, 2000);
            sessionStorage.setItem('has_seen_quote', 'true');
          }
        } catch (err) {
          console.error('Failed to fetch daily quote', err);
        }
      };

      fetchQuote();
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="daily-quote-card" style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      maxWidth: '350px',
      backgroundColor: 'var(--surface-color)',
      border: '1px solid var(--border-color)',
      borderRight: '4px solid var(--primary-color)',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      zIndex: 1000,
      animation: 'slideUp 0.5s ease-out',
      direction: 'rtl'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 992px) {
          .daily-quote-card { 
            bottom: 80px !important; 
            left: 10px !important; 
            right: 10px !important; 
            max-width: none !important; 
            width: calc(100% - 20px) !important; 
          }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>✨</span> رسالة اليوم
        </h4>
        <button
          onClick={() => setIsVisible(false)}
          style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="إغلاق"
        >×</button>
      </div>
      <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: '1.5', fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
        {quote}
      </p>
    </div>
  );
};

export default DailyQuote;
