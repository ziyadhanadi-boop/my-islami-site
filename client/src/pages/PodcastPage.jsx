import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const PodcastPage = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/podcasts').then(r => setPodcasts(r.data)).catch(() => setPodcasts([])).finally(() => setLoading(false));
  }, []);

  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  const podcastsWithUrls = podcasts.map(p => ({
    ...p,
    imageUrl: p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : `${API_BASE}${p.imageUrl}`) : p.imageUrl
  }));

  const categories = ['الكل', ...new Set(podcastsWithUrls.map(p => p.category).filter(Boolean))];
  const filtered = podcastsWithUrls.filter(p =>
    (activeCategory === 'الكل' || p.category === activeCategory) &&
    (!search || p.title?.includes(search) || p.speaker?.includes(search))
  );

  if (loading) return <Loader message="جاري تحميل البودكاست..." />;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-color)', direction:'rtl' }}>
      {/* ═══ HERO ═══ */}
      <div style={{ background:'linear-gradient(135deg, #3730a3 0%, #1e1b4b 60%, #0f0e2e 100%)', padding:'clamp(2.5rem,6vw,4rem) 1.5rem 3.5rem', textAlign:'center', color:'white', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'220px', height:'220px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-70px', left:'-40px', width:'280px', height:'280px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

        <div style={{ fontSize:'clamp(2.5rem,6vw,3.5rem)', marginBottom:'0.75rem', lineHeight:1 }}>🎙️</div>
        <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.5rem)', fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'0.6rem', textShadow:'0 2px 16px rgba(0,0,0,0.4)', color:'white' }}>البودكاست الإسلامي</h1>
        <p style={{ opacity:0.82, fontSize:'clamp(0.9rem,2vw,1.05rem)', maxWidth:'480px', margin:'0 auto 2rem', lineHeight:1.6 }}>محاضرات ودروس صوتية من علماء وشيوخ موثوقين</p>

        {/* Search */}
        <div style={{ maxWidth:'520px', margin:'0 auto', position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', background: searchFocused ? 'white' : 'rgba(255,255,255,0.96)', borderRadius:'3rem', boxShadow: searchFocused ? '0 0 0 3px rgba(255,255,255,0.35), 0 12px 40px rgba(0,0,0,0.25)' : '0 8px 32px rgba(0,0,0,0.2)', transition:'all 0.3s ease', overflow:'hidden', padding:'0.35rem 0.35rem 0.35rem 1.25rem' }}>
            <span style={{ fontSize:'1.1rem', color:'#4f46e5', flexShrink:0 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="ابحث عن محاضرة أو شيخ..." style={{ flex:1, border:'none', outline:'none', padding:'0.6rem 0.75rem', fontSize:'1rem', background:'transparent', color:'#1e293b', fontFamily:'inherit', direction:'rtl' }} />
            {search && <button onClick={() => setSearch('')} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:'28px', height:'28px', cursor:'pointer', color:'#64748b', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>}
            <button style={{ background:'#4f46e5', color:'white', border:'none', borderRadius:'2.5rem', padding:'0.6rem 1.4rem', fontWeight:'bold', fontSize:'0.9rem', cursor:'pointer', flexShrink:0, marginRight:'4px', whiteSpace:'nowrap' }}>بحث</button>
          </div>
          {search && <div style={{ marginTop:'0.6rem', fontSize:'0.82rem', color:'rgba(255,255,255,0.75)' }}>{filtered.length} نتيجة لـ «{search}»</div>}
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1rem' }}>
        {/* Category Tabs */}
        <div style={{ display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.75rem', marginBottom:'1.5rem', scrollbarWidth:'none' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding:'0.45rem 1rem', borderRadius:'2rem', border:'2px solid', borderColor:activeCategory===cat?'#4f46e5':'var(--border-color)', background:activeCategory===cat?'#4f46e5':'var(--surface-color)', color:activeCategory===cat?'white':'var(--text-secondary)', fontWeight:'bold', fontSize:'0.85rem', cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s' }}>
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎙️</div>
            <p>{search ? `لا توجد نتائج لـ «${search}»` : 'لا توجد محاضرات مضافة بعد.'}</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'1.25rem' }}>
            {filtered.map(pod => (
              <div
                key={pod._id}
                onClick={() => navigate(`/podcast/${pod._id}`)}
                style={{ background:'var(--surface-color)', borderRadius:'1.25rem', overflow:'hidden', border:'1.5px solid var(--border-color)', cursor:'pointer', transition:'all 0.25s', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(79,70,229,0.22)'; e.currentTarget.style.borderColor='#4f46e5'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor='var(--border-color)'; }}
              >
                {/* Thumbnail */}
                <div style={{ height:'140px', overflow:'hidden', position:'relative', flexShrink:0 }}>
                  {pod.imageUrl
                    ? <img src={pod.imageUrl} alt={pod.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                    : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#3730a3,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.5rem' }}>🎙️</div>
                  }
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(30,27,75,0.8), transparent 50%)' }} />
                  <div style={{ position:'absolute', bottom:'0.75rem', right:'1rem', left:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.88)', background:'rgba(79,70,229,0.6)', padding:'0.2rem 0.6rem', borderRadius:'1rem', backdropFilter:'blur(4px)' }}>{pod.category}</span>
                    {pod.duration && <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.8)' }}>⏱️ {pod.duration}</span>}
                  </div>
                  {/* Play overlay button */}
                  <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'42px', height:'42px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:'white' }}>▶</div>
                </div>

                {/* Info */}
                <div style={{ padding:'1.1rem 1.25rem', flex:1, display:'flex', flexDirection:'column' }}>
                  <h3 style={{ margin:'0 0 0.4rem', fontSize:'0.97rem', color:'var(--text-primary)', fontWeight:700, lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{pod.title}</h3>
                  {pod.speaker && <p style={{ margin:'0 0 0.65rem', fontSize:'0.82rem', color:'#4f46e5', fontWeight:'bold' }}>👤 {pod.speaker}</p>}
                  {pod.description && <p style={{ margin:'0 0 0.75rem', fontSize:'0.8rem', color:'var(--text-secondary)', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{pod.description}</p>}
                  <div style={{ marginTop:'auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    {pod.plays > 0 && <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>▶️ {pod.plays} استماع</span>}
                    <span style={{ fontSize:'0.82rem', fontWeight:'bold', color:'#4f46e5', marginRight:'auto', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                      استمع الآن <span>←</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default PodcastPage;
