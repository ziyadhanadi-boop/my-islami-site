import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import { AudioContext } from '../context/AudioContext';

const PodcastDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = useContext(AudioContext);

  useEffect(() => {
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    axios.get(`/api/podcasts/${id}`)
      .then(r => {
        const pod = r.data;
        if (pod.imageUrl && !pod.imageUrl.startsWith('http')) pod.imageUrl = `${API_BASE}${pod.imageUrl}`;
        if (pod.audioUrl && !pod.audioUrl.startsWith('http')) pod.audioUrl = `${API_BASE}${pod.audioUrl}`;
        setPodcast(pod);
      })
      .catch(() => setPodcast(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePlay = async () => {
    playTrack({ id: podcast._id, title: podcast.title, url: podcast.audioUrl, author: podcast.speaker });
    try { await axios.post(`/api/podcasts/${podcast._id}/play`); } catch {}
  };

  if (loading) return <Loader message="جاري التحميل..." />;
  if (!podcast) return (
    <div style={{ textAlign:'center', padding:'5rem', color:'var(--text-muted)' }}>
      <p style={{ marginBottom:'1rem' }}>⚠️ المحاضرة غير موجودة</p>
      <Link to="/podcast" style={{ color:'#4f46e5', fontWeight:'bold' }}>← العودة للبودكاست</Link>
    </div>
  );

  const isActive = currentTrack?.id === podcast._id;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-color)', direction:'rtl' }}>
      {/* ═══ HERO ═══ */}
      <div style={{ background:'linear-gradient(135deg, #3730a3 0%, #1e1b4b 60%, #0f0e2e 100%)', padding:'clamp(2.5rem,6vw,4.5rem) 1.5rem 3rem', color:'white', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'260px', height:'260px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-40px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

        <div className="container" style={{ padding:'0 1rem', position:'relative' }}>
          <button onClick={() => navigate('/podcast')} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:'2rem', padding:'0.45rem 1rem', color:'white', cursor:'pointer', fontSize:'0.85rem', marginBottom:'1.75rem' }}>
            ← العودة للبودكاست
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' }}>
            {/* Cover or default */}
            <div style={{ width:'110px', height:'110px', borderRadius:'1.15rem', overflow:'hidden', flexShrink:0, boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>
              {podcast.imageUrl
                ? <img src={podcast.imageUrl} alt={podcast.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>🎙️</div>
              }
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'inline-flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.6rem' }}>
                <span style={{ background:'rgba(255,255,255,0.15)', borderRadius:'2rem', padding:'0.3rem 0.9rem', fontSize:'0.78rem', fontWeight:'bold' }}>📂 {podcast.category}</span>
                {podcast.duration && <span style={{ background:'rgba(255,255,255,0.12)', borderRadius:'2rem', padding:'0.3rem 0.9rem', fontSize:'0.78rem' }}>⏱️ {podcast.duration}</span>}
              </div>
              <h1 style={{ margin:'0 0 0.5rem', fontSize:'clamp(1.4rem,4vw,2.25rem)', fontFamily:'var(--font-heading)', fontWeight:800, textShadow:'0 2px 16px rgba(0,0,0,0.25)', lineHeight:1.3 }}>
                {podcast.title}
              </h1>
              {podcast.speaker && (
                <p style={{ margin:0, fontSize:'1rem', opacity:0.85 }}>👤 {podcast.speaker}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2.5rem 1rem', maxWidth:'720px' }}>
        {/* ─ Audio Player ─ */}
        {podcast.audioUrl ? (
          <div style={{ background:'var(--surface-color)', border:'1px solid var(--border-color)', borderRadius:'1.25rem', padding:'2rem', marginBottom:'2rem', textAlign:'center' }}>
            <h3 style={{ margin:'0 0 1.25rem', color:'#4f46e5', fontSize:'1.05rem' }}>🎵 استمع للمحاضرة</h3>
            <button
              onClick={handlePlay}
              style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.75rem', padding:'1rem 2.5rem', background: isActive && isPlaying ? '#ef4444' : '#4f46e5', color:'white', border:'none', borderRadius:'3rem', fontSize:'1.1rem', fontWeight:'bold', cursor:'pointer', boxShadow:`0 6px 24px ${isActive && isPlaying ? 'rgba(239,68,68,0.4)' : 'rgba(79,70,229,0.4)'}`, transition:'all 0.25s', marginBottom:'1.25rem' }}
            >
              {isActive && isPlaying ? '⏸ إيقاف مؤقت' : '▶ تشغيل المحاضرة'}
            </button>
            {/* Native audio fallback */}
            <div style={{ marginTop:'0.5rem' }}>
              <audio controls src={podcast.audioUrl} style={{ width:'100%', borderRadius:'0.5rem' }} />
            </div>
            {podcast.plays > 0 && (
              <p style={{ margin:'0.75rem 0 0', fontSize:'0.8rem', color:'var(--text-muted)' }}>▶️ {podcast.plays} استماع</p>
            )}
          </div>
        ) : (
          <div style={{ background:'rgba(79,70,229,0.07)', border:'1px solid rgba(79,70,229,0.2)', borderRadius:'1rem', padding:'1.5rem', marginBottom:'2rem', textAlign:'center', color:'var(--text-muted)' }}>
            <p>🔇 لم يُضَف رابط الصوت لهذه المحاضرة بعد</p>
          </div>
        )}

        {/* ─ الوصف ─ */}
        {podcast.description && (
          <div style={{ background:'var(--surface-color)', border:'1px solid var(--border-color)', borderRight:'5px solid #4f46e5', borderRadius:'0.85rem', padding:'1.25rem 1.5rem', marginBottom:'1.25rem' }}>
            <h3 style={{ margin:'0 0 0.6rem', color:'#4f46e5', fontSize:'1rem' }}>📝 نبذة عن المحاضرة</h3>
            <p style={{ margin:0, color:'var(--text-secondary)', lineHeight:1.85, fontSize:'0.95rem' }}>{podcast.description}</p>
          </div>
        )}

        {/* ─ معلومات ─ */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px,1fr))', gap:'1rem', marginBottom:'1.75rem' }}>
          {podcast.speaker && (
            <div style={{ background:'var(--surface-color)', border:'1px solid var(--border-color)', borderRadius:'0.85rem', padding:'1rem 1.25rem' }}>
              <p style={{ margin:'0 0 0.35rem', fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:'bold' }}>👤 المتحدث</p>
              <p style={{ margin:0, color:'var(--text-primary)', fontWeight:'bold' }}>{podcast.speaker}</p>
            </div>
          )}
          {podcast.category && (
            <div style={{ background:'var(--surface-color)', border:'1px solid var(--border-color)', borderRadius:'0.85rem', padding:'1rem 1.25rem' }}>
              <p style={{ margin:'0 0 0.35rem', fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:'bold' }}>📂 التصنيف</p>
              <p style={{ margin:0, color:'#4f46e5', fontWeight:'bold' }}>{podcast.category}</p>
            </div>
          )}
          {podcast.duration && (
            <div style={{ background:'var(--surface-color)', border:'1px solid var(--border-color)', borderRadius:'0.85rem', padding:'1rem 1.25rem' }}>
              <p style={{ margin:'0 0 0.35rem', fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:'bold' }}>⏱️ المدة</p>
              <p style={{ margin:0, color:'var(--text-primary)', fontWeight:'bold' }}>{podcast.duration}</p>
            </div>
          )}
        </div>

        {/* Back */}
        <div style={{ textAlign:'center', marginTop:'2rem' }}>
          <Link to="/podcast" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.75rem 2rem', background:'#4f46e5', color:'white', borderRadius:'2rem', textDecoration:'none', fontWeight:'bold', boxShadow:'0 4px 16px rgba(79,70,229,0.35)' }}>
            ← محاضرات أخرى
          </Link>
        </div>
      </div>
    </div>
  );
};
export default PodcastDetailPage;
