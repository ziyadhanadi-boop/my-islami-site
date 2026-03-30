import React, { useState, useEffect } from 'react';

const HijriDate = ({ variant = 'default' }) => {
  const [hijri, setHijri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHijri = async () => {
      try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        
        const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`);
        const data = await response.json();
        if (data.code === 200) {
          setHijri(data.data.hijri);
        }
      } catch (err) {
        console.error('Error fetching Hijri date:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHijri();
  }, []);

  if (loading || !hijri) return <span style={{ opacity: 0.5 }}>...</span>;

  if (variant === 'hero') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
        <span style={{ fontSize: '1.25rem' }}>🌙</span>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}> {hijri.weekday.ar}، {hijri.day} {hijri.month.ar} {hijri.year}هـ </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ 
      padding: '0.75rem 1.5rem', 
      marginBottom: '2rem', 
      display: 'inline-flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      gap: '1.25rem', 
      border: '1px solid var(--accent-color)',
      backgroundColor: 'rgba(245, 158, 11, 0.05)',
      borderRadius: '2rem'
    }}>
      <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{hijri.day} {hijri.month.ar} {hijri.year}هـ</div>
      <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--accent-color)', opacity: 0.2 }}></div>
      <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>{hijri.weekday.ar}</div>
    </div>
  );
};

export default HijriDate;
