import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const PROPHETS_META = [
  { name: 'آدم',     emoji: '🌿', color: '#059669' },
  { name: 'إدريس',   emoji: '⭐', color: '#6366f1' },
  { name: 'نوح',     emoji: '⛵', color: '#0369a1' },
  { name: 'هود',     emoji: '🌬️', color: '#0891b2' },
  { name: 'صالح',    emoji: '🐪', color: '#b45309' },
  { name: 'إبراهيم', emoji: '🔥', color: '#d97706' },
  { name: 'لوط',     emoji: '🏛️', color: '#7c3aed' },
  { name: 'إسماعيل', emoji: '🏹', color: '#dc2626' },
  { name: 'إسحاق',   emoji: '🌟', color: '#f59e0b' },
  { name: 'يعقوب',   emoji: '🌙', color: '#4f46e5' },
  { name: 'يوسف',    emoji: '👑', color: '#d97706' },
  { name: 'شعيب',    emoji: '🌾', color: '#15803d' },
  { name: 'موسى',    emoji: '🪄', color: '#7c3aed' },
  { name: 'هارون',   emoji: '🎺', color: '#0d9488' },
  { name: 'داود',    emoji: '🎵', color: '#1d4ed8' },
  { name: 'سليمان',  emoji: '💍', color: '#7c2d12' },
  { name: 'إيوب',    emoji: '💪', color: '#065f46' },
  { name: 'ذو الكفل',emoji: '⚖️', color: '#374151' },
  { name: 'يونس',    emoji: '🐋', color: '#0c4a6e' },
  { name: 'إلياس',   emoji: '⚡', color: '#6d28d9' },
  { name: 'اليسع',   emoji: '💧', color: '#155e75' },
  { name: 'زكريا',   emoji: '🌺', color: '#be185d' },
  { name: 'يحيى',    emoji: '🕊️', color: '#166534' },
  { name: 'عيسى',    emoji: '✨', color: '#0891b2' },
  { name: 'محمد',    emoji: '🌙', color: '#0f766e' },
];

const getMeta = (name) => PROPHETS_META.find(p => name?.includes(p.name)) || { emoji: '📜', color: '#7c3aed' };

const ProphetStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/prophet-stories')
      .then(r => setStories(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError('تعذر تحميل القصص.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = stories.filter(s =>
    !search || s.name?.includes(search) || s.title?.includes(search) || s.summary?.includes(search)
  );

  if (loading) return <Loader message="جاري تحميل قصص الأنبياء..." />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', direction: 'rtl' }}>

      {/* ═══ HERO ═══ */}
      <div style={{
        background: 'linear-gradient(135deg, #5b21b6 0%, #4c1d95 55%, #2e1065 100%)',
        padding: 'clamp(2.5rem,6vw,4rem) 1.5rem 3.5rem',
        textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'220px', height:'220px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-70px', left:'-40px', width:'280px', height:'280px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

        <div style={{ fontSize:'clamp(2.5rem,6vw,3.5rem)', marginBottom:'0.75rem', lineHeight:1 }}>📜</div>
        <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.5rem)', fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'0.6rem', textShadow:'0 2px 16px rgba(0,0,0,0.4)', color:'white' }}>
          قصص الأنبياء والمرسلين
        </h1>
        <p style={{ opacity:0.82, fontSize:'clamp(0.9rem,2vw,1.05rem)', maxWidth:'480px', margin:'0 auto 2rem', lineHeight:1.6 }}>
          ﴿وَكُلًّا نَّقُصُّ عَلَيْكَ مِنْ أَنبَاءِ الرُّسُلِ﴾
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth:'520px', margin:'0 auto', position:'relative' }}>
          <div style={{
            display:'flex', alignItems:'center',
            background: searchFocused ? 'white' : 'rgba(255,255,255,0.96)',
            borderRadius:'3rem',
            boxShadow: searchFocused ? '0 0 0 3px rgba(255,255,255,0.35), 0 12px 40px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.2)',
            transition:'all 0.3s ease', overflow:'hidden',
            padding:'0.35rem 0.35rem 0.35rem 1.25rem',
          }}>
            <span style={{ fontSize:'1.1rem', color:'#6d28d9', flexShrink:0 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="ابحث عن نبي أو قصة..."
              style={{ flex:1, border:'none', outline:'none', padding:'0.6rem 0.75rem', fontSize:'1rem', background:'transparent', color:'#1e293b', fontFamily:'inherit', direction:'rtl' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:'28px', height:'28px', cursor:'pointer', color:'#64748b', fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
            )}
            <button style={{ background:'#6d28d9', color:'white', border:'none', borderRadius:'2.5rem', padding:'0.6rem 1.4rem', fontWeight:'bold', fontSize:'0.9rem', cursor:'pointer', flexShrink:0, marginRight:'4px', whiteSpace:'nowrap' }}>
              بحث
            </button>
          </div>
          {search && (
            <div style={{ marginTop:'0.6rem', fontSize:'0.82rem', color:'rgba(255,255,255,0.78)' }}>
              {filtered.length > 0 ? `${filtered.length} نتيجة` : 'لا توجد نتائج'}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding:'2.5rem 1rem' }}>

        {/* Error */}
        {error && (
          <div style={{ textAlign:'center', padding:'3rem', background:'rgba(239,68,68,0.08)', borderRadius:'1rem', border:'1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ color:'#dc2626', fontWeight:'bold' }}>⚠️ {error}</p>
            <button onClick={() => window.location.reload()} style={{ marginTop:'1rem', padding:'0.6rem 1.25rem', background:'#dc2626', color:'white', border:'none', borderRadius:'0.5rem', cursor:'pointer' }}>إعادة المحاولة</button>
          </div>
        )}

        {/* Empty */}
        {!error && filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'5rem 2rem', color:'var(--text-muted)' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>📜</div>
            <h3 style={{ fontSize:'1.2rem', marginBottom:'0.5rem', color:'var(--text-secondary)' }}>
              {search ? 'لا توجد نتائج' : 'ترقّب إضافة قصص الأنبياء قريباً'}
            </h3>
            {search && (
              <button onClick={() => setSearch('')} style={{ marginTop:'1rem', padding:'0.6rem 1.5rem', background:'#7c3aed', color:'white', border:'none', borderRadius:'0.75rem', cursor:'pointer', fontWeight:'bold' }}>عرض الكل</button>
            )}
          </div>
        )}

        {/* ─── Cards Grid ─── */}
        {!error && filtered.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'1.5rem' }}>
            {filtered.map(story => {
              const meta = getMeta(story.name);
              const emoji = story.emoji || meta.emoji;
              const accent = meta.color;

              return (
                <div
                  key={story._id}
                  onClick={() => navigate(`/prophet-stories/${story._id}`)}
                  style={{
                    background:'var(--surface-color)',
                    borderRadius:'1.25rem',
                    overflow:'hidden',
                    border:'1.5px solid var(--border-color)',
                    cursor:'pointer',
                    transition:'all 0.25s',
                    boxShadow:'0 2px 10px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow=`0 14px 36px ${accent}25`; e.currentTarget.style.borderColor=accent; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor='var(--border-color)'; }}
                >
                  {/* Image or gradient header */}
                  {story.imageUrl ? (
                    <div style={{ height:'175px', overflow:'hidden', position:'relative' }}>
                      <img src={story.imageUrl} alt={story.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                      <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, ${accent}cc 0%, transparent 55%)` }} />
                      <div style={{ position:'absolute', bottom:'0.9rem', right:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                        <span style={{ fontSize:'1.75rem', lineHeight:1, filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}>{emoji}</span>
                        <span style={{ color:'white', fontWeight:'bold', fontSize:'0.9rem', textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>نبي الله {story.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ height:'100px', background:`linear-gradient(135deg, ${accent}cc, ${accent}88)`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 1.5rem' }}>
                      <span style={{ fontSize:'2.75rem', lineHeight:1 }}>{emoji}</span>
                      <span style={{ color:'rgba(255,255,255,0.9)', fontWeight:'bold', fontSize:'1.1rem', fontFamily:'var(--font-heading)' }}>نبي الله {story.name}</span>
                    </div>
                  )}

                  {/* Body */}
                  <div style={{ padding:'1.25rem' }}>
                    {!story.imageUrl && (
                      <span style={{ fontSize:'0.72rem', color:accent, background:`${accent}14`, padding:'0.2rem 0.65rem', borderRadius:'2rem', fontWeight:'bold', border:`1px solid ${accent}28`, display:'inline-block', marginBottom:'0.65rem' }}>
                        نبي الله {story.name}
                      </span>
                    )}
                    <h3 style={{ margin:'0 0 0.6rem', fontSize:'1.05rem', color:'var(--text-primary)', fontWeight:700, lineHeight:1.4 }}>
                      {story.title}
                    </h3>
                    <p style={{ margin:'0 0 1rem', fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.65, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {story.summary}
                    </p>

                    {/* Meta + CTA */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <div style={{ display:'flex', gap:'0.75rem', fontSize:'0.72rem', color:'var(--text-muted)' }}>
                        {story.era && <span>🕰️ {story.era}</span>}
                        {story.mentions > 0 && <span style={{ color:accent }}>📖 {story.mentions}× في القرآن</span>}
                      </div>
                      <span style={{ fontSize:'0.82rem', fontWeight:'bold', color:accent, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                        اقرأ القصة <span style={{ fontSize:'1rem' }}>←</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProphetStoriesPage;
