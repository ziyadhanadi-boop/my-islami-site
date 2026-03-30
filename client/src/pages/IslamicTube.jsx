import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const IslamicTube = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('/api/videosList');
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <Loader message="جاري تجهيز المرئيات... 🎬" />;

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#ef4444', color: 'white', padding: '1rem', borderRadius: '1rem', fontSize: '2rem' }}>▶️</div>
        <div>
          <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>مرئيات إسلامية</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>منصة المقاطع المفيدة والنافعة</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {videos.map(video => (
          <a key={video._id} href={video.videoUrl} target="_blank" rel="noreferrer" className="card card-hover-effect" style={{ cursor: 'pointer', transition: '0.3s', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ position: 'relative' }}>
              <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.8rem' }}>{video.duration}</span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{video.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>👁️ {video.views} مشاهدة</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default IslamicTube;
