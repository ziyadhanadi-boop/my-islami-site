import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const Zikr = () => {
  const [zikrs, setZikrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const fetchZikrs = async () => {
      try {
        const res = await axios.get('/api/zikr');
        setZikrs(res.data);
        // Initialize counts from the zikr data
        const initialCounts = {};
        res.data.forEach(z => {
          initialCounts[z._id] = z.count || 1;
        });
        setCounts(initialCounts);
      } catch (err) {
        console.error('Error fetching zikrs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchZikrs();
  }, []);

  const handleDecrement = (id) => {
    if (counts[id] > 0) {
      setCounts({ ...counts, [id]: counts[id] - 1 });
      // Play a very subtle click sound if possible, or just haptic feedback
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }
  };

  const resetCount = (id, originalCount) => {
    setCounts({ ...counts, [id]: originalCount });
  };

  if (loading) return <Loader message="جاري تحميل الأذكار..." />;

  const categories = [...new Set(zikrs.map(z => z.category))];

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>📿 الأذكار اليومية</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>ردد الأذكار وتابع تسبيحك بكل سهولة</p>
      </div>

      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, color: 'var(--secondary-color)', fontSize: '1.5rem', borderRight: '4px solid var(--secondary-color)', paddingRight: '1rem' }}>
              {cat === 'morning' ? 'أذكار الصباح' : cat === 'evening' ? 'أذكار المساء' : cat === 'general' ? 'أذكار عامة' : cat}
            </h2>
          </div>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {zikrs.filter(z => z.category === cat).map(zikr => (
              <div key={zikr._id} className="card" style={{ 
                padding: '1.5rem', 
                position: 'relative',
                border: counts[zikr._id] === 0 ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                opacity: counts[zikr._id] === 0 ? 0.7 : 1,
                transition: 'all 0.3s'
              }}>
                <p style={{ 
                  fontSize: '1.25rem', 
                  lineHeight: '1.8', 
                  marginBottom: '1.5rem', 
                  textAlign: 'center',
                  fontWeight: '500',
                  color: 'var(--text-primary)'
                }}>
                  {zikr.text}
                </p>
                
                {zikr.description && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                    {zikr.description}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                  <div 
                    onClick={() => handleDecrement(zikr._id)}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: counts[zikr._id] === 0 ? 'var(--primary-color)' : 'var(--bg-color)',
                      border: '3px solid var(--primary-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      userSelect: 'none',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      color: counts[zikr._id] === 0 ? 'white' : 'var(--primary-color)',
                      transition: 'all 0.2s'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{counts[zikr._id]}</span>
                    <span style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>{counts[zikr._id] === 0 ? 'تم' : 'بقي'}</span>
                  </div>

                  {counts[zikr._id] < (zikr.count || 1) && (
                    <button 
                      onClick={() => resetCount(zikr._id, zikr.count || 1)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                      title="إعادة ضبط"
                    >
                      🔄
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Zikr;
