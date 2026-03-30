import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const DUA_CATEGORIES = ['الصباح والمساء','قبل النوم وعند الاستيقاظ','الكرب والهموم','السفر','الطعام والشراب','دخول المسجد وبعد الأذان','الاستخارة','المرض والشفاء','مواقف يومية','أدعية قرآنية'];

const CAT_EMOJIS = { 'الصباح والمساء':'🌄','قبل النوم وعند الاستيقاظ':'🌙','الكرب والهموم':'💧','السفر':'✈️','الطعام والشراب':'🍽️','دخول المسجد وبعد الأذان':'🕌','الاستخارة':'🤲','المرض والشفاء':'💊','مواقف يومية':'📆','أدعية قرآنية':'📖' };

const DuasPage = () => {
  const [duas, setDuas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQ, setSearchQ] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [aiSituation, setAiSituation] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [duasRes, catsRes] = await Promise.all([
          axios.get('/api/duas'),
          axios.get('/api/duas/categories'),
        ]);
        setDuas(duasRes.data);
        setCategories(['الكل', ...catsRes.data]);
      } catch { setDuas([]); }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const filtered = duas.filter(d => {
    const matchCat = activeCategory === 'الكل' || d.category === activeCategory;
    const matchSearch = !searchQ || d.title?.includes(searchQ) || d.arabicText?.includes(searchQ);
    return matchCat && matchSearch;
  });

  const handleAiGenerate = async () => {
    if (!aiSituation.trim()) return;
    setAiLoading(true); setAiResult(null);
    try {
      const res = await axios.post('/api/ai/dua-generator', { situation: aiSituation });
      setAiResult(res.data);
    } catch { alert('تعذر توليد الدعاء'); }
    setAiLoading(false);
  };

  if (loading) return <Loader message="جاري تحميل الأدعية..." />;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-color)', direction:'rtl' }}>
      {/* ═══ HERO ═══ */}
      <div style={{ background:'linear-gradient(135deg, #0f766e 0%, #134e4a 60%, #0a3330 100%)', padding:'clamp(2.5rem,6vw,4rem) 1.5rem 3.5rem', textAlign:'center', color:'white', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'220px', height:'220px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-70px', left:'-40px', width:'280px', height:'280px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

        <div style={{ fontSize:'clamp(2.5rem,6vw,3.5rem)', marginBottom:'0.75rem', lineHeight:1 }}>🤲</div>
        <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.5rem)', fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'0.6rem', textShadow:'0 2px 16px rgba(0,0,0,0.4)', color:'white' }}>مكتبة الأدعية المأثورة</h1>
        <p style={{ opacity:0.82, fontSize:'clamp(0.9rem,2vw,1.05rem)', maxWidth:'480px', margin:'0 auto 2rem', lineHeight:1.6 }}>أدعية مأثورة من القرآن الكريم والسنة النبوية لكل مناسبة</p>

        {/* Search */}
        <div style={{ maxWidth:'520px', margin:'0 auto', position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', background: searchFocused ? 'white' : 'rgba(255,255,255,0.96)', borderRadius:'3rem', boxShadow: searchFocused ? '0 0 0 3px rgba(255,255,255,0.4), 0 12px 40px rgba(0,0,0,0.25)' : '0 8px 32px rgba(0,0,0,0.2)', transition:'all 0.3s ease', overflow:'hidden', padding:'0.35rem 0.35rem 0.35rem 1.25rem' }}>
            <span style={{ fontSize:'1.1rem', color:'#0f766e', flexShrink:0 }}>🔍</span>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="ابحث عن دعاء..." style={{ flex:1, border:'none', outline:'none', padding:'0.6rem 0.75rem', fontSize:'1rem', background:'transparent', color:'#1e293b', fontFamily:'inherit', direction:'rtl' }} />
            {searchQ && <button onClick={() => setSearchQ('')} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:'28px', height:'28px', cursor:'pointer', color:'#64748b', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>}
            <button style={{ background:'#0f766e', color:'white', border:'none', borderRadius:'2.5rem', padding:'0.6rem 1.4rem', fontWeight:'bold', fontSize:'0.9rem', cursor:'pointer', flexShrink:0, marginRight:'4px', whiteSpace:'nowrap' }}>بحث</button>
          </div>
          {searchQ && <div style={{ marginTop:'0.6rem', fontSize:'0.82rem', color:'rgba(255,255,255,0.75)' }}>{filtered.length} نتيجة لـ «{searchQ}»</div>}
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1rem' }}>
        {/* AI Generator */}
        <div style={{ background:'linear-gradient(135deg,#1e293b,#0f172a)', borderRadius:'1.25rem', padding:'1.75rem', marginBottom:'2rem', border:'1px solid #334155' }}>
          <h2 style={{ color:'#38bdf8', fontFamily:'var(--font-heading)', marginBottom:'0.5rem', fontSize:'1.3rem' }}>✨ مولّد الدعاء بالذكاء الاصطناعي</h2>
          <p style={{ color:'#94a3b8', fontSize:'0.9rem', marginBottom:'1rem' }}>أخبرنا بموقفك وسنقترح لك الدعاء المناسب من السنة النبوية</p>
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
            <input value={aiSituation} onChange={e => setAiSituation(e.target.value)} onKeyDown={e => e.key==='Enter' && handleAiGenerate()} placeholder="مثال: أشعر بقلق قبل امتحان مهم..." style={{ flex:1, minWidth:'200px', padding:'0.75rem 1rem', borderRadius:'0.75rem', border:'1px solid #334155', background:'#1e293b', color:'white', fontSize:'0.95rem', outline:'none' }} />
            <button onClick={handleAiGenerate} disabled={aiLoading} style={{ padding:'0.75rem 1.5rem', background:'#0d9488', color:'white', border:'none', borderRadius:'0.75rem', fontWeight:'bold', cursor:'pointer', whiteSpace:'nowrap', opacity:aiLoading?0.7:1 }}>
              {aiLoading ? '⏳ جاري...' : '🤲 اقترح دعاء'}
            </button>
          </div>
          {aiResult && (
            <div style={{ marginTop:'1.25rem' }}>
              {aiResult.duas?.map((d,i) => (
                <div key={i} style={{ background:'rgba(13,148,136,0.1)', border:'1px solid rgba(13,148,136,0.3)', borderRadius:'0.75rem', padding:'1.25rem', marginBottom:'0.75rem' }}>
                  <p style={{ fontSize:'1.3rem', lineHeight:2.2, color:'#e2e8f0', fontFamily:'serif', marginBottom:'0.5rem' }}>{d.arabicText}</p>
                  <p style={{ color:'#94a3b8', fontSize:'0.85rem', marginBottom:'0.25rem' }}>📖 {d.meaning}</p>
                  <span style={{ fontSize:'0.75rem', color:'#0d9488', background:'rgba(13,148,136,0.1)', padding:'0.2rem 0.6rem', borderRadius:'2rem' }}>{d.source}</span>
                </div>
              ))}
              {aiResult.advice && <p style={{ color:'#fbbf24', fontSize:'0.9rem', marginTop:'0.75rem', padding:'0.75rem', background:'rgba(251,191,36,0.1)', borderRadius:'0.5rem' }}>💡 {aiResult.advice}</p>}
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div style={{ display:'flex', gap:'0.5rem', overflowX:'auto', paddingBottom:'0.75rem', marginBottom:'1.5rem', scrollbarWidth:'none' }}>
          {(categories.length > 1 ? categories : ['الكل',...DUA_CATEGORIES]).map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding:'0.45rem 1.1rem', borderRadius:'2rem', border:'2px solid', borderColor:activeCategory===cat?'var(--primary-color)':'var(--border-color)', background:activeCategory===cat?'var(--primary-color)':'var(--surface-color)', color:activeCategory===cat?'white':'var(--text-secondary)', fontWeight:'bold', fontSize:'0.85rem', cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.2s', flexShrink:0 }}>
              {CAT_EMOJIS[cat] || ''} {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🤲</div>
            <p>{searchQ ? `لا توجد نتائج لـ «${searchQ}»` : 'لا توجد أدعية في هذا القسم بعد'}</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'1.25rem' }}>
            {filtered.map(dua => (
              <div
                key={dua._id}
                onClick={() => navigate(`/duas/${dua._id}`)}
                style={{ background:'var(--surface-color)', borderRadius:'1.25rem', overflow:'hidden', border:'1.5px solid var(--border-color)', cursor:'pointer', transition:'all 0.25s', boxShadow:'0 2px 10px rgba(0,0,0,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(15,118,110,0.2)'; e.currentTarget.style.borderColor='#0f766e'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor='var(--border-color)'; }}
              >
                {/* Top gradient strip */}
                <div style={{ height:'6px', background:'linear-gradient(90deg, #0f766e, #0d9488)' }} />
                <div style={{ padding:'1.25rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.85rem' }}>
                    <span style={{ fontSize:'0.72rem', color:'#0f766e', background:'rgba(15,118,110,0.1)', padding:'0.2rem 0.65rem', borderRadius:'2rem', fontWeight:'bold', border:'1px solid rgba(15,118,110,0.2)' }}>
                      {CAT_EMOJIS[dua.category] || '🤲'} {dua.category}
                    </span>
                    <span style={{ fontSize:'1.25rem' }}>🤲</span>
                  </div>
                  {dua.title && <h3 style={{ fontSize:'0.95rem', color:'var(--text-primary)', marginBottom:'0.75rem', fontWeight:700 }}>{dua.title}</h3>}
                  <p style={{ fontSize:'1.15rem', color:'var(--text-primary)', lineHeight:2.1, fontFamily:'serif', marginBottom:'0.85rem', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {dua.arabicText}
                  </p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    {dua.source && <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>📚 {dua.source}</span>}
                    <span style={{ fontSize:'0.82rem', fontWeight:'bold', color:'#0f766e', marginRight:'auto', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                      اقرأ الدعاء <span>←</span>
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
export default DuasPage;
