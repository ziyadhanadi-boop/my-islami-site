import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FileUploadField from '../../components/FileUploadField';

// ─── قائمة الأنبياء مع الإيموجي واللون ───
const PROPHETS = [
  { name: 'آدم',      emoji: '🌿', color: '#059669', desc: 'أبو البشرية' },
  { name: 'إدريس',    emoji: '⭐', color: '#6366f1', desc: 'النبي الحكيم' },
  { name: 'نوح',      emoji: '⛵', color: '#0369a1', desc: 'نبي الطوفان' },
  { name: 'هود',      emoji: '🌬️', color: '#0891b2', desc: 'نبي عاد' },
  { name: 'صالح',     emoji: '🐪', color: '#b45309', desc: 'نبي ثمود' },
  { name: 'إبراهيم',  emoji: '🔥', color: '#d97706', desc: 'خليل الله' },
  { name: 'لوط',      emoji: '🏛️', color: '#7c3aed', desc: 'نبي سدوم' },
  { name: 'إسماعيل',  emoji: '🏹', color: '#dc2626', desc: 'ابن إبراهيم' },
  { name: 'إسحاق',    emoji: '🌟', color: '#f59e0b', desc: 'ابن إبراهيم' },
  { name: 'يعقوب',    emoji: '🌙', color: '#4f46e5', desc: 'إسرائيل' },
  { name: 'يوسف',     emoji: '👑', color: '#d97706', desc: 'الصديق الأمين' },
  { name: 'شعيب',     emoji: '🌾', color: '#15803d', desc: 'نبي مدين' },
  { name: 'موسى',     emoji: '🪄', color: '#7c3aed', desc: 'كليم الله' },
  { name: 'هارون',    emoji: '🎺', color: '#0d9488', desc: 'وزير موسى' },
  { name: 'داود',     emoji: '🎵', color: '#1d4ed8', desc: 'النبي الملك' },
  { name: 'سليمان',   emoji: '💍', color: '#7c2d12', desc: 'ملك الأنبياء' },
  { name: 'إيوب',     emoji: '💪', color: '#065f46', desc: 'نبي الصبر' },
  { name: 'ذو الكفل', emoji: '⚖️', color: '#374151', desc: 'الملتزم بالوعد' },
  { name: 'يونس',     emoji: '🐋', color: '#0c4a6e', desc: 'صاحب الحوت' },
  { name: 'إلياس',    emoji: '⚡', color: '#6d28d9', desc: 'نبي بني إسرائيل' },
  { name: 'اليسع',    emoji: '💧', color: '#155e75', desc: 'خليفة إلياس' },
  { name: 'زكريا',    emoji: '🌺', color: '#be185d', desc: 'والد يحيى' },
  { name: 'يحيى',     emoji: '🕊️', color: '#166534', desc: 'المبشّر بعيسى' },
  { name: 'عيسى',     emoji: '✨', color: '#0891b2', desc: 'روح الله' },
  { name: 'محمد',    emoji: '🌙', color: '#0f766e', desc: 'خاتم الأنبياء ﷺ', salah: true },
];

const AdminProphetStoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', emoji: '', title: '', summary: '',
    content: '', imageUrl: '', era: '', mentions: 0, order: 0, isHidden: false
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/prophet-stories/${id}`)
        .then(r => setForm(r.data))
        .catch(() => alert('خطأ في جلب البيانات'));
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectProphet = (prophet) => {
    setForm(f => ({ ...f, name: prophet.name, emoji: prophet.emoji }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name) { setMsg('❌ يرجى اختيار اسم النبي'); return; }
    setSaving(true); setMsg('');
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'x-auth-token': token };
      if (isEdit) await axios.put(`/api/prophet-stories/${id}`, form, { headers });
      else await axios.post('/api/prophet-stories', form, { headers });
      setMsg('✅ تم الحفظ بنجاح');
      setTimeout(() => navigate('/admin/dashboard?tab=prophetStories'), 1200);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.msg || 'حدث خطأ أثناء الحفظ'));
    }
    setSaving(false);
  };

  const fieldStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.65rem',
    border: '1.5px solid var(--border-color)', background: 'var(--bg-color)',
    color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'inherit',
    boxSizing: 'border-box', outline: 'none'
  };
  const labelStyle = {
    display: 'block', fontWeight: 'bold', marginBottom: '0.4rem',
    color: 'var(--text-primary)', fontSize: '0.9rem'
  };
  const selectedProphet = PROPHETS.find(p => p.name === form.name);

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '760px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/admin/dashboard?tab=prophetStories')}
          style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
          ← رجوع
        </button>
        <h2 style={{ margin: 0, color: '#7c3aed', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selectedProphet ? <span style={{ fontSize: '1.75rem' }}>{selectedProphet.emoji}</span> : '📜'}
          {isEdit ? 'تعديل قصة نبي' : 'إضافة قصة نبي'}
          {selectedProphet && <span style={{ fontSize: '1rem', color: selectedProphet.color }}>— نبي الله {selectedProphet.name}</span>}
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--surface-color)', borderRadius: '1.25rem', padding: '2rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ─── اختيار النبي المرئي ─── */}
        <div>
          <label style={{ ...labelStyle, fontSize: '1rem', marginBottom: '0.75rem' }}>
            اختر النبي * {form.name && <span style={{ color: selectedProphet?.color, fontWeight: 'bold' }}>— {form.name} {selectedProphet?.emoji}</span>}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px,1fr))', gap: '0.6rem' }}>
            {PROPHETS.map(prophet => {
              const isSelected = form.name === prophet.name;
              return (
                <button
                  key={prophet.name}
                  type="button"
                  onClick={() => handleSelectProphet(prophet)}
                  title={prophet.desc}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '0.3rem', padding: '0.65rem 0.5rem', borderRadius: '0.85rem',
                    border: `2px solid ${isSelected ? prophet.color : 'var(--border-color)'}`,
                    background: isSelected ? `${prophet.color}14` : 'var(--bg-color)',
                    cursor: 'pointer', transition: 'all 0.18s',
                    boxShadow: isSelected ? `0 4px 14px ${prophet.color}30` : 'none',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  }}
                  onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = prophet.color; e.currentTarget.style.background = `${prophet.color}08`; }}}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-color)'; }}}
                >
                  <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{prophet.emoji}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: isSelected ? prophet.color : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>
                    {prophet.name}
                  </span>
                  {prophet.salah && (
                    <span style={{ fontSize: '0.6rem', color: isSelected ? prophet.color : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.1, opacity: 0.85 }}>
                      صلى الله عليه وسلم
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info strip for selected prophet */}
        {selectedProphet && (
          <div style={{ padding: '0.85rem 1.25rem', borderRadius: '0.75rem', background: `${selectedProphet.color}10`, border: `1px solid ${selectedProphet.color}30`, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{selectedProphet.emoji}</span>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', color: selectedProphet.color }}>نبي الله {selectedProphet.name}</p>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedProphet.desc}</p>
            </div>
          </div>
        )}

        {/* ─── عنوان القصة ─── */}
        <div>
          <label style={labelStyle}>عنوان القصة *</label>
          <input name="title" value={form.title} onChange={handleChange}
            placeholder="مثال: قصة نبي الله نوح وسفينة النجاة" required style={fieldStyle} />
        </div>

        {/* ─── ملخص ─── */}
        <div>
          <label style={labelStyle}>ملخص قصير * <span style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>(يظهر في بطاقة القصة)</span></label>
          <textarea name="summary" value={form.summary} onChange={handleChange}
            placeholder="وصف مختصر يجذب القارئ..." required rows={3} style={fieldStyle} />
        </div>

        {/* ─── المحتوى الكامل ─── */}
        <div>
          <label style={labelStyle}>المحتوى الكامل <span style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>(يدعم HTML — اختياري)</span></label>
          <textarea name="content" value={form.content} onChange={handleChange}
            placeholder="<h3>البداية</h3><p>في زمن بعيد...</p><p>يمكنك كتابة القصة كاملة هنا</p>"
            rows={10} style={{ ...fieldStyle, lineHeight: 1.6, fontFamily: 'monospace', fontSize: '0.88rem' }} />
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
            💡 يمكن استخدام وسوم HTML مثل &lt;h3&gt;&lt;p&gt;&lt;strong&gt;&lt;br&gt;
          </p>
        </div>

        {/* ─── صورة القصة ─── */}
        <FileUploadField
          label="صورة القصة"
          value={form.imageUrl}
          onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
          accept="image"
          placeholder="https://... أو ارفع صورة"
        />

        {/* ─── حقبة + ترتيب ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>الحقبة الزمنية</label>
            <input name="era" value={form.era} onChange={handleChange}
              placeholder="قبل الإسلام بـ 3000 سنة" style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>الترتيب في القائمة</label>
            <input name="order" type="number" value={form.order} onChange={handleChange} min={0} style={fieldStyle} />
          </div>
        </div>

        {/* ─── ذكر في القرآن ─── */}
        <div>
          <label style={labelStyle}>عدد مرات الذكر في القرآن الكريم</label>
          <input name="mentions" type="number" value={form.mentions} onChange={handleChange} min={0} style={{ ...fieldStyle, maxWidth: '200px' }} />
        </div>

        {/* ─── إخفاء ─── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input type="checkbox" name="isHidden" checked={form.isHidden} onChange={handleChange} id="hidden" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
          <label htmlFor="hidden" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>إخفاء عن العامة</label>
        </div>

        {/* ─── رسالة ─── */}
        {msg && (
          <div style={{ padding: '0.85rem', borderRadius: '0.6rem', background: msg.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msg.includes('✅') ? '#059669' : '#dc2626', fontWeight: 'bold' }}>
            {msg}
          </div>
        )}

        {/* ─── زر الحفظ ─── */}
        <button type="submit" disabled={saving} style={{
          padding: '0.9rem', background: selectedProphet?.color || '#7c3aed',
          color: 'white', border: 'none', borderRadius: '0.75rem',
          fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
          opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s'
        }}>
          {saving ? '⏳ جاري الحفظ...' : `💾 ${isEdit ? 'حفظ التعديلات' : 'إضافة القصة'}`}
        </button>
      </form>
    </div>
  );
};

export default AdminProphetStoryForm;
