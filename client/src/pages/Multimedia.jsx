import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const Multimedia = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get('/api/media');
        const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
        const data = res.data.map(item => ({
          ...item,
          url: item.url && !item.url.startsWith('http') ? `${API_BASE}${item.url}` : item.url
        }));
        setMedia(data);
      } catch (err) {
        console.error('Error fetching media:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  if (loading) return <Loader message="جاري تحميل الوسائط..." />;

  const filteredMedia = activeTab === 'all' ? media : media.filter(m => m.type === activeTab);

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>🎧 المرئيات والصوتيات</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>محاضرات، دروس، وتلاوات مختارة</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('all')} 
          className={`btn ${activeTab === 'all' ? 'btn-primary' : ''}`}
          style={{ background: activeTab === 'all' ? 'var(--primary-color)' : 'var(--bg-color)', color: activeTab === 'all' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '2rem', padding: '0.5rem 1.5rem', fontWeight: 'bold' }}>
          📦 الكل
        </button>
        <button 
          onClick={() => setActiveTab('video')} 
          className={`btn ${activeTab === 'video' ? 'btn-primary' : ''}`}
          style={{ background: activeTab === 'video' ? 'var(--primary-color)' : 'var(--bg-color)', color: activeTab === 'video' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '2rem', padding: '0.5rem 1.5rem', fontWeight: 'bold' }}>
          🎬 مرئيات
        </button>
        <button 
          onClick={() => setActiveTab('audio')} 
          className={`btn ${activeTab === 'audio' ? 'btn-primary' : ''}`}
          style={{ background: activeTab === 'audio' ? 'var(--primary-color)' : 'var(--bg-color)', color: activeTab === 'audio' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '2rem', padding: '0.5rem 1.5rem', fontWeight: 'bold' }}>
          🎙️ صوتيات
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
        {filteredMedia.map(item => (
          <div key={item._id} className="card" style={{ padding: '1rem', overflow: 'hidden' }}>
            {item.type === 'video' ? (
              <div style={{ position: 'relative', paddingTop: '56.25%', marginBottom: '1rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <iframe 
                  src={item.url.includes('youtube.com') ? item.url.replace('watch?v=', 'embed/') : item.url}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  title={item.title}
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div style={{ 
                height: '180px', 
                background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))', 
                borderRadius: '0.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '1rem',
                fontSize: '4rem',
                color: 'rgba(255,255,255,0.3)',
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.1)'
              }}>
                🎙️
              </div>
            )}
            
            <div style={{ padding: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                {item.category === 'reciter' ? '📖 تلاوة' : '👨‍🏫 درس/فتوى'}
              </span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '0.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
              
              {item.type === 'audio' && (
                <div style={{ marginTop: 'auto' }}>
                  <audio controls style={{ width: '100%', borderRadius: '2rem' }}>
                    <source src={item.url} type="audio/mpeg" />
                    متصفحك لا يدعم مشغل الصوت.
                  </audio>
                </div>
              )}
              
              {item.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
      
      {filteredMedia.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--surface-color)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>لا يوجد محتوى في هذا القسم حالياً.</p>
        </div>
      )}
    </div>
  );
};

export default Multimedia;
