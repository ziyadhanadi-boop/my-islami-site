import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AudioContext } from '../context/AudioContext';

const MultimediaContent = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'reciter', 'fatwa'
  const { playTrack, currentTrack, isPlaying } = useContext(AudioContext);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get('/api/media');
        setMedia(res.data);
      } catch (error) {
        console.error('Error fetching media', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const filteredMedia = filter === 'all' ? media : media.filter(m => m.category === filter);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>جاري التحميل...</div>;
  if (media.length === 0) return null;

  const getYouTubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>🎧</span> تلاوات ومحاضرات مختارة
      </h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} className="btn" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', background: filter === 'all' ? 'var(--primary-color)' : 'var(--bg-color)', color: filter === 'all' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)' }}>الكل</button>
        <button onClick={() => setFilter('reciter')} className="btn" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', background: filter === 'reciter' ? 'var(--primary-color)' : 'var(--bg-color)', color: filter === 'reciter' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)' }}>تلاوات</button>
        <button onClick={() => setFilter('fatwa')} className="btn" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', background: filter === 'fatwa' ? 'var(--primary-color)' : 'var(--bg-color)', color: filter === 'fatwa' ? 'white' : 'var(--text-primary)', border: '1px solid var(--border-color)' }}>فتاوى ومحاضرات</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredMedia.map((item) => (
          <div key={item._id} style={{ 
            borderRadius: '0.75rem', 
            overflow: 'hidden', 
            background: 'var(--bg-color)', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {item.type === 'video' ? (
              <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  src={getYouTubeEmbedUrl(item.url)}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div style={{ padding: '1rem', background: 'var(--primary-color)', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem' }}>🔊</span>
              </div>
            )}
            
            <div style={{ padding: '1rem', flexGrow: 1 }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{item.description}</p>
              
              {item.type === 'audio' && (
                <button 
                  onClick={() => playTrack({ id: item._id, title: item.title, url: item.url, author: item.category })}
                  className="btn" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', background: (currentTrack?.url === item.url && isPlaying) ? 'var(--primary-dark)' : 'var(--primary-color)', color: 'white' }}
                >
                  {(currentTrack?.url === item.url && isPlaying) ? '⏸️ إيقاف' : '▶️ استماع'}
                </button>
              )}
            </div>
            
            <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
              {item.category === 'reciter' ? 'تلاوة' : 'فتوى/محاضرة'}
            </div>
          </div>
        ))}
      </div>
      
      {filteredMedia.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>لا توجد وسائط في هذا القسم حالياً.</p>}
    </div>
  );
};

export default MultimediaContent;
