import React, { useState } from 'react';
import axios from 'axios';

const COLORS = { green: '#16a34a', red: '#dc2626', orange: '#d97706', yellow: '#ca8a04', blue: '#0891b2' };
const EXAMPLES = ['هل الموسيقى حلال أم حرام؟','حكم بيع الذهب أونلاين','هل الاشتراك في Netflix جائز؟','حكم العمل في البنك','هل رسوم الكريديت كارد ربا؟'];

const HalalCheckPage = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleCheck = async () => {
    if (!question.trim()) return;
    setLoading(true); setResult(null);
    try {
      const res = await axios.post('/api/ai/halal-check', { question });
      setResult(res.data);
      setHistory(prev => [{ question, result: res.data }, ...prev.slice(0, 4)]);
    } catch { alert('تعذر الاستفسار، حاول مرة أخرى'); }
    setLoading(false);
  };

  const verdictEmoji = { 'حلال': '✅', 'حرام': '❌', 'مختلف فيه': '⚖️', 'مكروه': '🟡', 'يحتاج تفصيل': '🔵' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', direction: 'rtl' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0c4a6e, #075985)', padding: '3rem 1.5rem', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⚖️</div>
        <h1 style={{ fontSize: 'clamp(1.75rem,5vw,2.5rem)', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.75rem' }}>حلال أم حرام؟</h1>
        <p style={{ opacity: 0.85, fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>اسأل عن حكم أي شيء، سيُقدّم لك المساعد الذكي الحكم الشرعي مع دليله من القرآن والسنة</p>
      </div>

      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '760px' }}>
        {/* Disclaimer */}
        <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#b45309' }}>
          ⚠️ <strong>تنبيه:</strong> هذه الأداة للاستفادة العلمية فقط. للفتوى الشخصية المُلزِمة استشر عالماً متخصصاً.
        </div>

        {/* Input */}
        <div style={{ background: 'var(--surface-color)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
          <label style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'block', marginBottom: '0.75rem' }}>📝 اكتب سؤالك:</label>
          <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="مثال: هل العمل في مجال التأمين جائز؟" rows={3} style={{ width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: '2px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor = '#0891b2'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />

          {/* Quick Examples */}
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => setQuestion(ex)} style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '2rem', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s' }}>
                {ex}
              </button>
            ))}
          </div>

          <button onClick={handleCheck} disabled={loading || !question.trim()} style={{ marginTop: '1rem', width: '100%', padding: '0.85rem', background: '#0891b2', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', opacity: loading || !question.trim() ? 0.65 : 1, transition: 'all 0.2s' }}>
            {loading ? '⏳ جاري البحث في المصادر الشرعية...' : '⚖️ استفسر عن الحكم'}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div style={{ background: 'var(--surface-color)', borderRadius: '1.25rem', padding: '1.75rem', border: `2px solid ${COLORS[result.verdictColor] || '#0891b2'}`, marginBottom: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{verdictEmoji[result.verdict] || '⚖️'}</span>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>الحكم الشرعي</p>
                <h2 style={{ margin: 0, fontSize: '1.75rem', color: COLORS[result.verdictColor] || '#0891b2', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{result.verdict}</h2>
              </div>
            </div>

            {result.explanation && (
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.75rem', lineHeight: 1.8, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {result.explanation}
              </div>
            )}

            {result.evidence && (
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.4rem', fontSize: '0.9rem' }}>📚 الدليل الشرعي:</p>
                <blockquote style={{ borderRight: '4px solid #0891b2', paddingRight: '1rem', margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.8, fontSize: '0.9rem' }}>
                  {result.evidence}
                </blockquote>
              </div>
            )}

            {result.conditions && result.conditions !== 'لا توجد' && result.conditions !== 'لا يوجد' && (
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(8,145,178,0.08)', borderRadius: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                📌 <strong>شروط وقيود:</strong> {result.conditions}
              </div>
            )}

            {result.disclaimer && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', margin: 0 }}>⚖️ {result.disclaimer}</p>
            )}
          </div>
        )}

        {/* Recent History */}
        {history.length > 1 && (
          <div style={{ background: 'var(--surface-color)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1rem' }}>🕐 أسئلتك الأخيرة</h3>
            {history.slice(1).map((h, i) => (
              <div key={i} onClick={() => { setQuestion(h.question); setResult(h.result); }} style={{ padding: '0.6rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', background: 'var(--bg-color)', transition: 'all 0.15s' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.question}</span>
                <span style={{ color: COLORS[h.result?.verdictColor] || '#64748b', flexShrink: 0, fontWeight: 'bold', fontSize: '0.8rem', marginRight: '0.5rem' }}>{h.result?.verdict}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HalalCheckPage;
