import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const FatwaArchive = () => {
  const [fatwas, setFatwas] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFatwas = async () => {
      try {
        const res = await axios.get('/api/fatwaArchive');
        setFatwas(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFatwas();
  }, []);

  if (loading) return <Loader message="جاري إحضار الفتاوى الموثوقة... ⚖️" />;

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--primary-color)' }}>⚖️ أرشيف الفتاوى</h1>
        <p style={{ color: 'var(--text-secondary)' }}>دليل الأسئلة الشائعة والإجابات الموثوقة</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {fatwas.map(fatwa => (
          <div key={fatwa._id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div 
              onClick={() => setActiveId(activeId === fatwa._id ? null : fatwa._id)}
              style={{ padding: '1.5rem', background: activeId === fatwa._id ? 'rgba(13,148,136,0.05)' : 'transparent', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: activeId === fatwa._id ? 'var(--primary-color)' : 'var(--text-primary)' }}>
                س: {fatwa.question}
              </h3>
              <span style={{ transition: 'transform 0.3s', transform: activeId === fatwa._id ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </div>
            {activeId === fatwa._id && (
              <div style={{ padding: '1.5rem', paddingTop: '0', color: 'var(--text-secondary)', lineHeight: '1.8', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ display: 'inline-block', backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.8rem', marginBottom: '0.5rem', float: 'left' }}>{fatwa.category}</span>
                <strong>الجواب: </strong> {fatwa.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FatwaArchive;
