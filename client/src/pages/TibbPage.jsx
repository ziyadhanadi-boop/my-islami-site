import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const CAT_COLORS = { 'أعشاب':'#166534','أطعمة وتوابل':'#b45309','وصفات':'#0891b2','الحجامة':'#7c3aed','أخرى':'#374151' };
const CAT_EMOJIS = { 'أعشاب':'🌿','أطعمة وتوابل':'🍯','وصفات':'🧴','الحجامة':'🩸','أخرى':'✦' };

const TibbPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/tibb').then(r => setItems(r.data)).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const categories = ['الكل', ...new Set(items.map(i => i.category).filter(Boolean))];
  const filtered = items.filter(item => {
    const matchCat = activeCategory === 'الكل' || item.category === activeCategory;
    const matchSearch = !search || item.name?.includes(search);
    return matchCat && matchSearch;
  });

  if (loading) return <Loader message="جاري تحميل الطب النبوي..." />;

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-color)', direction:'rtl' }}>
      {/* ═══ HERO ═══ */}
      <div style={{ background:'linear-gradient(135deg, #166534 0%, #14532d 60%, #052e16 100%)', padding:'clamp(2.5rem,6vw,4rem) 1.5rem 3.5rem', textAlign:'center', color:'white', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'220px', height:'220px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-70px', left:'-40px', width:'280px', height:'280px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

        <div style={{ fontSize:'clamp(2.5rem,6vw,3.5rem)', marginBottom:'0.75rem', lineHeight:1 }}>🌿</div>
        <h1 style={{ fontSize:'clamp(1.6rem,4vw,2.5rem)', fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'0.6rem', textShadow:'0 2px 16px rgba(0,0,0,0.4)', color:'white' }}>الطب النبوي</h1>
        <p style={{ opacity:0.82, fontSize:'clamp(0.9rem,2vw,1.05rem)', maxWidth:'480px', margin:'0 auto 2rem', lineHeight:1.6 }}>أعشاب وأطعمة ووصفات من هدي النبي ﷺ مع الدليل العلمي الحديث</p>

        {/* Search */}
        <div style={{ maxWidth:'520px', margin:'0 auto', position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', background: searchFocused ? 'white' : 'rgba(255,255,255,0.96)', borderRadius:'3rem', boxShadow: searchFocused ? '0 0 0 3px rgba(255,255,255,0.35), 0 12px 40px rgba(0,0,0,0.25)' : '0 8px 32px rgba(0,0,0,0.2)', transition:'all 0.3s ease', overflow:'hidden', padding:'0.35rem 0.35rem 0.35rem 1.25rem' }}>
            <span style={{ fontSize:'1.1rem', color:'#166534', flexShrink:0 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="ابحث... (حبة البركة، العسل...)" style={{ flex:1, border:'none', outline:'none', padding:'0.6rem 0.75rem', fontSize:'1rem', background:'transparent', color:'#1e293b', fontFamily:'inherit', direction:'rtl' }} />
            {search && <button onClick={() => setSearch('')} style={{ background:'#f1f5f9', border:'none', borderRadius:'50%', width:'28px', height:'28px', cursor:'pointer', color:'#64748b', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>}
            <button style={{ background:'#166534', color:'white', border:'none', borderRadius:'2.5rem', padding:'0.6rem 1.4rem', fontWeight:'bold', fontSize:'0.9rem', cursor:'pointer', flexShrink:0, marginRight:'4px', whiteSpace:'nowrap' }}>بحث</button>
          </div>
          {search && <div style={{ marginTop:'0.6rem', fontSize:'0.82rem', color:'rgba(255,255,255,0.75)' }}>{filtered.length} نتيجة لـ «{search}»</div>}
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1rem' }}>
        {/* Category Tabs */}
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding:'0.45rem 1rem', borderRadius:'2rem', border:'2px solid', borderColor:activeCategory===cat?'#166534':'var(--border-color)', background:activeCategory===cat?'#166534':'var(--surface-color)', color:activeCategory===cat?'white':'var(--text-secondary)', fontWeight:'bold', fontSize:'0.85rem', cursor:'pointer', transition:'all 0.2s' }}>
              {CAT_EMOJIS[cat] || ''} {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🌿</div>
            <p>{search ? `لا توجد نتائج لـ «${search}»` : 'لا يوجد محتوى في هذا القسم بعد.'}</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'1.25rem' }}>
            {filtered.map(item => {
              const accent = CAT_COLORS[item.category] || '#166534';
              const emoji = CAT_EMOJIS[item.category] || '🌿';
              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/tibb-nabawi/${item._id}`)}
                  style={{ background:'var(--surface-color)', borderRadius:'1.25rem', overflow:'hidden', border:'1.5px solid var(--border-color)', cursor:'pointer', transition:'all 0.25s', boxShadow:'0 2px 10px rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 12px 32px ${accent}25`; e.currentTarget.style.borderColor=accent; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor='var(--border-color)'; }}
                >
                  {/* Image or gradient */}
                  {item.imageUrl ? (
                    <div style={{ height:'160px', overflow:'hidden', position:'relative' }}>
                      <img src={item.imageUrl} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                      <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, ${accent}cc, transparent 55%)` }} />
                      <div style={{ position:'absolute', bottom:'0.75rem', right:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                        <span style={{ color:'white', fontWeight:'bold', fontSize:'0.9rem', textShadow:'0 1px 4px rgba(0,0,0,0.5)' }}>{item.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ height:'80px', background:`linear-gradient(135deg, ${accent}cc, ${accent}88)`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 1.5rem' }}>
                      <span style={{ fontSize:'2.25rem' }}>{emoji}</span>
                      <span style={{ color:'rgba(255,255,255,0.9)', fontWeight:'bold', fontSize:'1.1rem', fontFamily:'var(--font-heading)' }}>{item.name}</span>
                    </div>
                  )}

                  <div style={{ padding:'1.1rem 1.25rem' }}>
                    {!item.imageUrl && (
                      <span style={{ fontSize:'0.7rem', color:accent, background:`${accent}14`, padding:'0.2rem 0.6rem', borderRadius:'2rem', fontWeight:'bold', border:`1px solid ${accent}28`, display:'inline-block', marginBottom:'0.6rem' }}>{item.category}</span>
                    )}
                    {item.imageUrl && (
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.6rem' }}>
                        <h3 style={{ margin:0, fontSize:'1rem', color:'var(--text-primary)', fontWeight:700 }}>{item.name}</h3>
                        <span style={{ fontSize:'0.7rem', color:accent, background:`${accent}14`, padding:'0.2rem 0.6rem', borderRadius:'2rem', fontWeight:'bold' }}>{item.category}</span>
                      </div>
                    )}
                    {item.hadith && (
                      <p style={{ margin:'0 0 0.8rem', fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.6, fontStyle:'italic', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                        «{item.hadith}»
                      </p>
                    )}
                    {item.benefits?.length > 0 && (
                      <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'0.75rem' }}>
                        {item.benefits.slice(0,3).map((b,i) => (
                          <span key={i} style={{ fontSize:'0.7rem', color:accent, background:`${accent}0e`, padding:'0.15rem 0.5rem', borderRadius:'1rem', border:`1px solid ${accent}20` }}>• {b.length>18?b.slice(0,18)+'...':b}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ display:'flex', justifyContent:'flex-start', alignItems:'center' }}>
                      <span style={{ fontSize:'0.82rem', fontWeight:'bold', color:accent, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                        اقرأ التفاصيل <span>←</span>
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
export default TibbPage;
