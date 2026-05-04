import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const DuaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dua, setDua] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
    axios.get(`/api/duas/${id}`)
      .then(r => {
        let d = r.data;
        if (d.imageUrl && !d.imageUrl.startsWith('http')) d.imageUrl = `${API_BASE}${d.imageUrl}`;
        setDua(d);
      })
      .catch(() => setDua(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader message="جاري تحميل الدعاء..." />;
  if (!dua) return (
    <div style={{ textAlign:'center', padding:'5rem', color:'var(--text-muted)' }}>
      <p style={{ marginBottom:'1rem' }}>⚠️ الدعاء غير موجود</p>
      <Link to="/duas" style={{ color:'#0f766e', fontWeight:'bold' }}>← العودة للأدعية</Link>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-color)', direction:'rtl' }}>
      {/* ═══ HERO ═══ */}
      <div style={{ background:'linear-gradient(135deg, #0f766e 0%, #134e4a 60%, #0a3330 100%)', padding:'clamp(2.5rem,6vw,4.5rem) 1.5rem 3rem', color:'white', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'260px', height:'260px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-40px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

        <div className="container" style={{ padding:'0 1rem', position:'relative' }}>
          <button onClick={() => navigate('/duas')} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:'2rem', padding:'0.45rem 1rem', color:'white', cursor:'pointer', fontSize:'0.85rem', marginBottom:'1.75rem' }}>
            ← العودة لمكتبة الأدعية
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:'1.25rem', flexWrap:'wrap' }}>
            <div style={{ fontSize:'clamp(3rem,8vw,4.5rem)', lineHeight:1, filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>🤲</div>
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.15)', borderRadius:'2rem', padding:'0.3rem 0.9rem', fontSize:'0.82rem', fontWeight:'bold', marginBottom:'0.6rem' }}>
                📂 {dua.category}
              </div>
              <h1 style={{ margin:'0', fontSize:'clamp(1.5rem,4vw,2.25rem)', fontFamily:'var(--font-heading)', fontWeight:800, textShadow:'0 2px 16px rgba(0,0,0,0.25)', lineHeight:1.3 }}>
                {dua.title || `دعاء — ${dua.category}`}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2.5rem 1rem', maxWidth:'720px' }}>
        {/* Cover image */}
        {dua.imageUrl && (
          <div style={{ borderRadius:'1.25rem', overflow:'hidden', marginBottom:'2rem', boxShadow:'0 8px 32px rgba(0,0,0,0.12)' }}>
            <img src={dua.imageUrl} alt={dua.title} style={{ width:'100%', maxHeight:'340px', objectFit:'cover', display:'block' }} />
          </div>
        )}

        {/* ─ نص الدعاء ─ */}
        <div style={{ background:'linear-gradient(135deg, rgba(15,118,110,0.07), rgba(19,78,74,0.04))', border:'1.5px solid rgba(15,118,110,0.2)', borderRadius:'1.25rem', padding:'2rem', marginBottom:'1.75rem', textAlign:'center' }}>
          <p style={{ fontSize:'clamp(1.3rem,3.5vw,1.75rem)', lineHeight:2.4, color:'var(--text-primary)', fontFamily:'serif', margin:0 }}>
            {dua.arabicText}
          </p>
          {dua.transliteration && (
            <p style={{ fontSize:'0.9rem', color:'var(--text-muted)', marginTop:'1rem', fontStyle:'italic', letterSpacing:'0.03em' }}>
              {dua.transliteration}
            </p>
          )}
        </div>

        {/* ─ المعنى ─ */}
        {dua.meaning && (
          <div style={{ background:'var(--surface-color)', border:'1px solid var(--border-color)', borderRight:'5px solid #0f766e', borderRadius:'0.85rem', padding:'1.25rem 1.5rem', marginBottom:'1.25rem' }}>
            <h3 style={{ margin:'0 0 0.5rem', color:'#0f766e', fontSize:'1rem' }}>📖 المعنى والشرح</h3>
            <p style={{ margin:0, color:'var(--text-secondary)', lineHeight:1.8, fontSize:'0.95rem' }}>{dua.meaning}</p>
          </div>
        )}

        {/* ─ المصدر والمناسبة ─ */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.75rem' }}>
          {dua.source && (
            <div style={{ background:'var(--surface-color)', border:'1px solid var(--border-color)', borderRadius:'0.85rem', padding:'1rem 1.25rem' }}>
              <p style={{ margin:'0 0 0.35rem', fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:'bold' }}>📚 المصدر</p>
              <p style={{ margin:0, color:'var(--text-primary)', fontSize:'0.9rem', fontWeight:'bold' }}>{dua.source}</p>
            </div>
          )}
          {dua.occasion && (
            <div style={{ background:'var(--surface-color)', border:'1px solid var(--border-color)', borderRadius:'0.85rem', padding:'1rem 1.25rem' }}>
              <p style={{ margin:'0 0 0.35rem', fontSize:'0.82rem', color:'var(--text-muted)', fontWeight:'bold' }}>🕐 مناسبة القراءة</p>
              <p style={{ margin:0, color:'var(--text-primary)', fontSize:'0.9rem' }}>{dua.occasion}</p>
            </div>
          )}
        </div>

        {/* Back */}
        <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
          <Link to="/duas" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.75rem 2rem', background:'#0f766e', color:'white', borderRadius:'2rem', textDecoration:'none', fontWeight:'bold', boxShadow:'0 4px 16px rgba(15,118,110,0.35)' }}>
            ← أدعية أخرى
          </Link>
        </div>
      </div>
    </div>
  );
};
export default DuaDetailPage;
