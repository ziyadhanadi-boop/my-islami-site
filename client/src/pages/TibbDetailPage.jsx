import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const TibbDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    axios.get(`/api/tibb/${id}`)
      .then(r => {
        let d = r.data;
        if (d.imageUrl && !d.imageUrl.startsWith('http')) d.imageUrl = `${API_BASE}${d.imageUrl}`;
        setItem(d);
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader message="جاري التحميل..." />;
  if (!item) return (
    <div style={{ textAlign:'center', padding:'5rem', color:'var(--text-muted)' }}>
      <p style={{ marginBottom:'1rem' }}>⚠️ العنصر غير موجود</p>
      <Link to="/tibb-nabawi" style={{ color:'#166534', fontWeight:'bold' }}>← العودة للطب النبوي</Link>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-color)', direction:'rtl' }}>
      {/* ═══ HERO ═══ */}
      <div style={{ background:'linear-gradient(135deg, #166534 0%, #14532d 60%, #052e16 100%)', padding:'clamp(2.5rem,6vw,4.5rem) 1.5rem 3rem', color:'white', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'260px', height:'260px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-40px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

        <div className="container" style={{ padding:'0 1rem', position:'relative' }}>
          <button onClick={() => navigate('/tibb-nabawi')} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:'2rem', padding:'0.45rem 1rem', color:'white', cursor:'pointer', fontSize:'0.85rem', marginBottom:'1.75rem' }}>
            ← العودة للطب النبوي
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', flexWrap:'wrap' }}>
            {item.imageUrl ? (
              <div style={{ width:'90px', height:'90px', borderRadius:'1rem', overflow:'hidden', flexShrink:0, boxShadow:'0 4px 16px rgba(0,0,0,0.3)' }}>
                <img src={item.imageUrl} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
            ) : (
              <div style={{ fontSize:'clamp(3rem,8vw,4.5rem)', lineHeight:1, filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>🌿</div>
            )}
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.15)', borderRadius:'2rem', padding:'0.3rem 0.9rem', fontSize:'0.82rem', fontWeight:'bold', marginBottom:'0.6rem' }}>
                🌿 {item.category}
              </div>
              <h1 style={{ margin:0, fontSize:'clamp(1.75rem,5vw,2.75rem)', fontFamily:'var(--font-heading)', fontWeight:800, textShadow:'0 2px 16px rgba(0,0,0,0.25)' }}>
                {item.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2.5rem 1rem', maxWidth:'760px' }}>
        {/* Cover image large */}
        {item.imageUrl && (
          <div style={{ borderRadius:'1.25rem', overflow:'hidden', marginBottom:'2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}>
            <img src={item.imageUrl} alt={item.name} style={{ width:'100%', maxHeight:'360px', objectFit:'cover', display:'block' }} />
          </div>
        )}

        {/* ─ الحديث الشريف ─ */}
        {item.hadith && (
          <div style={{ background:'linear-gradient(135deg, rgba(22,101,52,0.08), rgba(5,46,22,0.04))', border:'1.5px solid rgba(22,101,52,0.2)', borderRadius:'1.25rem', padding:'1.75rem', marginBottom:'1.75rem' }}>
            <h3 style={{ margin:'0 0 1rem', color:'#166534', fontSize:'1.05rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>📿 الحديث النبوي الشريف</h3>
            <blockquote style={{ margin:0, fontSize:'clamp(1rem,3vw,1.25rem)', lineHeight:2.2, color:'var(--text-primary)', fontFamily:'serif', fontStyle:'italic' }}>
              «{item.hadith}»
            </blockquote>
            {item.hadithSource && (
              <p style={{ margin:'0.75rem 0 0', fontSize:'0.85rem', color:'#166534', fontWeight:'bold' }}>— {item.hadithSource}</p>
            )}
          </div>
        )}

        {/* ─ الفوائد ─ */}
        {item.benefits?.length > 0 && (
          <div style={{ background:'var(--surface-color)', border:'1px solid var(--border-color)', borderRadius:'1.25rem', padding:'1.5rem', marginBottom:'1.5rem' }}>
            <h3 style={{ margin:'0 0 1rem', color:'#166534', fontSize:'1.05rem' }}>✦ الفوائد الصحية</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:'0.65rem' }}>
              {item.benefits.map((b, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.6rem', padding:'0.6rem 0.85rem', background:'rgba(22,101,52,0.07)', borderRadius:'0.65rem', border:'1px solid rgba(22,101,52,0.12)' }}>
                  <span style={{ color:'#166534', fontWeight:'bold', flexShrink:0, marginTop:'1px' }}>•</span>
                  <span style={{ fontSize:'0.875rem', color:'var(--text-secondary)', lineHeight:1.5 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─ الدليل العلمي ─ */}
        {item.scientificNote && (
          <div style={{ background:'rgba(8,145,178,0.07)', border:'1px solid rgba(8,145,178,0.2)', borderRight:'4px solid #0891b2', borderRadius:'0.85rem', padding:'1.25rem 1.5rem', marginBottom:'1.25rem' }}>
            <h3 style={{ margin:'0 0 0.5rem', color:'#0891b2', fontSize:'1rem' }}>🔬 الدليل العلمي الحديث</h3>
            <p style={{ margin:0, color:'var(--text-secondary)', lineHeight:1.8, fontSize:'0.95rem' }}>{item.scientificNote}</p>
          </div>
        )}

        {/* ─ الاستخدام والتحذير ─ */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
          {item.usage && (
            <div style={{ background:'var(--surface-color)', border:'1px solid var(--border-color)', borderRadius:'0.85rem', padding:'1rem 1.25rem' }}>
              <p style={{ margin:'0 0 0.35rem', fontSize:'0.82rem', color:'#166534', fontWeight:'bold' }}>💊 طريقة الاستخدام</p>
              <p style={{ margin:0, color:'var(--text-secondary)', fontSize:'0.88rem', lineHeight:1.6 }}>{item.usage}</p>
            </div>
          )}
          {item.warning && (
            <div style={{ background:'rgba(180,83,9,0.07)', border:'1px solid rgba(180,83,9,0.2)', borderRadius:'0.85rem', padding:'1rem 1.25rem' }}>
              <p style={{ margin:'0 0 0.35rem', fontSize:'0.82rem', color:'#b45309', fontWeight:'bold' }}>⚠️ تحذيرات مهمة</p>
              <p style={{ margin:0, color:'var(--text-secondary)', fontSize:'0.88rem', lineHeight:1.6 }}>{item.warning}</p>
            </div>
          )}
        </div>

        {/* Back */}
        <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
          <Link to="/tibb-nabawi" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.75rem 2rem', background:'#166534', color:'white', borderRadius:'2rem', textDecoration:'none', fontWeight:'bold', boxShadow:'0 4px 16px rgba(22,101,52,0.35)' }}>
            ← عناصر أخرى
          </Link>
        </div>
      </div>
    </div>
  );
};
export default TibbDetailPage;
