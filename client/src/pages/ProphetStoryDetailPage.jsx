import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const PROPHETS_META = [
  { name: 'آدم',     emoji: '🌿', color: '#059669', colorDark: '#065f46' },
  { name: 'إدريس',   emoji: '⭐', color: '#6366f1', colorDark: '#4338ca' },
  { name: 'نوح',     emoji: '⛵', color: '#0369a1', colorDark: '#1e3a5f' },
  { name: 'هود',     emoji: '🌬️', color: '#0891b2', colorDark: '#0e4f6b' },
  { name: 'صالح',    emoji: '🐪', color: '#b45309', colorDark: '#7c3a00' },
  { name: 'إبراهيم', emoji: '🔥', color: '#d97706', colorDark: '#92400e' },
  { name: 'لوط',     emoji: '🏛️', color: '#7c3aed', colorDark: '#4c1d95' },
  { name: 'إسماعيل', emoji: '🏹', color: '#dc2626', colorDark: '#991b1b' },
  { name: 'إسحاق',   emoji: '🌟', color: '#f59e0b', colorDark: '#92400e' },
  { name: 'يعقوب',   emoji: '🌙', color: '#4f46e5', colorDark: '#3730a3' },
  { name: 'يوسف',    emoji: '👑', color: '#d97706', colorDark: '#7c3a00' },
  { name: 'شعيب',    emoji: '🌾', color: '#15803d', colorDark: '#14532d' },
  { name: 'موسى',    emoji: '🪄', color: '#7c3aed', colorDark: '#4c1d95' },
  { name: 'هارون',   emoji: '🎺', color: '#0d9488', colorDark: '#134e4a' },
  { name: 'داود',    emoji: '🎵', color: '#1d4ed8', colorDark: '#1e3a8a' },
  { name: 'سليمان',  emoji: '💍', color: '#7c2d12', colorDark: '#431407' },
  { name: 'إيوب',    emoji: '💪', color: '#065f46', colorDark: '#022c22' },
  { name: 'ذو الكفل',emoji: '⚖️', color: '#374151', colorDark: '#111827' },
  { name: 'يونس',    emoji: '🐋', color: '#0c4a6e', colorDark: '#082f49' },
  { name: 'إلياس',   emoji: '⚡', color: '#6d28d9', colorDark: '#4c1d95' },
  { name: 'اليسع',   emoji: '💧', color: '#155e75', colorDark: '#0c3547' },
  { name: 'زكريا',   emoji: '🌺', color: '#be185d', colorDark: '#831843' },
  { name: 'يحيى',    emoji: '🕊️', color: '#166534', colorDark: '#052e16' },
  { name: 'عيسى',    emoji: '✨', color: '#0891b2', colorDark: '#0e4f6b' },
  { name: 'محمد',    emoji: '🌙', color: '#0f766e', colorDark: '#134e4a' },
];

const getMeta = (name) => PROPHETS_META.find(p => name?.includes(p.name)) || { emoji: '📜', color: '#7c3aed', colorDark: '#4c1d95' };

const ProphetStoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    axios.get(`/api/prophet-stories/${id}`)
      .then(r => {
        let d = r.data;
        if (d.imageUrl && !d.imageUrl.startsWith('http')) d.imageUrl = `${API_BASE}${d.imageUrl}`;
        setStory(d);
      })
      .catch(() => setError('تعذّر تحميل القصة'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader message="جاري تحميل القصة..." />;
  if (error || !story) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>⚠️ {error || 'القصة غير موجودة'}</p>
      <Link to="/prophet-stories" style={{ color: '#7c3aed', fontWeight: 'bold' }}>← العودة للقائمة</Link>
    </div>
  );

  const meta = getMeta(story.name);
  const emoji = story.emoji || meta.emoji;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', direction: 'rtl' }}>

      {/* ═══ HERO BANNER ═══ */}
      <div style={{
        background: `linear-gradient(135deg, ${meta.color} 0%, ${meta.colorDark} 100%)`,
        padding: 'clamp(2.5rem,6vw,4.5rem) 1.5rem 3rem',
        color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'260px', height:'260px', borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-40px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

        <div className="container" style={{ padding: '0 1rem', position: 'relative' }}>
          {/* Back button */}
          <button onClick={() => navigate('/prophet-stories')} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:'2rem', padding:'0.45rem 1rem', color:'white', cursor:'pointer', fontSize:'0.85rem', marginBottom:'1.75rem', backdropFilter:'blur(8px)' }}>
            ← العودة لقصص الأنبياء
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', flexWrap:'wrap' }}>
            <div style={{ fontSize:'clamp(3rem,8vw,5rem)', lineHeight:1, filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}>
              {emoji}
            </div>
            <div>
              <p style={{ margin:'0 0 0.35rem', fontSize:'0.85rem', opacity:0.75, fontWeight:'bold', letterSpacing:'0.05em' }}>
                سلسلة قصص الأنبياء والمرسلين
              </p>
              <h1 style={{ margin:'0 0 0.5rem', fontSize:'clamp(1.75rem,5vw,2.75rem)', fontFamily:'var(--font-heading)', fontWeight:800, textShadow:'0 2px 16px rgba(0,0,0,0.25)', lineHeight:1.2 }}>
                {story.title}
              </h1>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.18)', borderRadius:'2rem', padding:'0.35rem 1rem', fontSize:'0.9rem', fontWeight:'bold', backdropFilter:'blur(6px)' }}>
                {emoji} نبي الله {story.name}
              </div>
            </div>
          </div>

          {/* Meta info */}
          <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap', marginTop:'1.5rem', fontSize:'0.82rem', opacity:0.85 }}>
            {story.era && <span>🕰️ {story.era}</span>}
            {story.mentions > 0 && <span>📖 ذُكر {story.mentions} مرة في القرآن الكريم</span>}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="container" style={{ padding:'2.5rem 1rem', maxWidth:'780px' }}>

        {/* Cover image */}
        {story.imageUrl && (
          <div style={{ borderRadius:'1.25rem', overflow:'hidden', marginBottom:'2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}>
            <img src={story.imageUrl} alt={story.title} style={{ width:'100%', maxHeight:'400px', objectFit:'cover', display:'block' }} />
          </div>
        )}

        {/* Summary card */}
        <div style={{ background:`${meta.color}0e`, border:`1.5px solid ${meta.color}25`, borderRight:`5px solid ${meta.color}`, borderRadius:'1rem', padding:'1.25rem 1.5rem', marginBottom:'2rem' }}>
          <p style={{ margin:0, fontSize:'1.05rem', lineHeight:1.85, color:'var(--text-primary)', fontStyle:'italic' }}>
            {story.summary}
          </p>
        </div>

        {/* Full story content */}
        {story.content ? (
          <div
            style={{ fontSize:'1rem', lineHeight:2, color:'var(--text-primary)', letterSpacing:'0.01em' }}
            className="prophet-story-content"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        ) : (
          <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)', background:'var(--surface-color)', borderRadius:'1rem', border:'1px solid var(--border-color)' }}>
            <p style={{ fontSize:'1.1rem' }}>📜 لم يُضف محتوى تفصيلي لهذه القصة بعد.</p>
          </div>
        )}

        {/* Quran verses */}
        {story.quranVerses?.length > 0 && (
          <div style={{ marginTop:'2.5rem', padding:'1.5rem', background:'var(--surface-color)', borderRadius:'1rem', border:'1px solid var(--border-color)' }}>
            <h3 style={{ margin:'0 0 1rem', color: meta.color, fontFamily:'var(--font-heading)' }}>📖 الآيات القرآنية المتعلقة</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {story.quranVerses.map((v, i) => (
                <div key={i} style={{ padding:'0.75rem 1rem', background:'var(--bg-color)', borderRadius:'0.65rem', borderRight:`3px solid ${meta.color}` }}>
                  <span style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{v.surah && `سورة ${v.surah} — `}{v.verse}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop:'3rem', textAlign:'center' }}>
          <Link to="/prophet-stories" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.75rem 2rem', background:meta.color, color:'white', borderRadius:'2rem', textDecoration:'none', fontWeight:'bold', boxShadow:`0 4px 16px ${meta.color}40` }}>
            ← قصص أخرى
          </Link>
        </div>
      </div>

      <style>{`
        .prophet-story-content h2, .prophet-story-content h3 {
          color: ${meta.color};
          font-family: var(--font-heading);
          margin: 1.75rem 0 0.75rem;
        }
        .prophet-story-content p { margin-bottom: 1.1rem; }
        .prophet-story-content blockquote {
          border-right: 4px solid ${meta.color};
          padding-right: 1rem;
          margin: 1.25rem 0;
          font-style: italic;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default ProphetStoryDetailPage;
