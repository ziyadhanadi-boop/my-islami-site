import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FileUploadField from '../../components/FileUploadField';

const TIBB_CATS = ['أعشاب', 'أطعمة وتوابل', 'وصفات', 'الحجامة', 'أخرى'];

const AdminTibbForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    name: '', category: 'أعشاب', imageUrl: '',
    hadith: '', hadithSource: '', benefits: '',
    scientificNote: '', usage: '', warning: '', isHidden: false
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/tibb/${id}`).then(r => {
        const d = r.data;
        setForm({ ...d, benefits: Array.isArray(d.benefits) ? d.benefits.join('\n') : '' });
      }).catch(() => alert('خطأ'));
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { 'x-auth-token': token };
      const payload = { ...form, benefits: form.benefits.split('\n').map(s => s.trim()).filter(Boolean) };
      if (isEdit) await axios.put(`/api/tibb/${id}`, payload, { headers });
      else await axios.post('/api/tibb', payload, { headers });
      setMsg('✅ تم الحفظ بنجاح');
      setTimeout(() => navigate('/admin/dashboard?tab=tibb'), 1200);
    } catch { setMsg('❌ حدث خطأ'); }
    setSaving(false);
  };

  const fieldStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.65rem', border: '1.5px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '0.4rem', color: 'var(--text-primary)', fontSize: '0.9rem' };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/dashboard?tab=tibb')} style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--text-primary)' }}>← رجوع</button>
        <h2 style={{ margin: 0, color: '#166534', fontFamily: 'var(--font-heading)' }}>🌿 {isEdit ? 'تعديل عنصر طب نبوي' : 'إضافة طب نبوي'}</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--surface-color)', borderRadius: '1.25rem', padding: '2rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>الاسم *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="الحبة السوداء، العسل، الزيتون..." required style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>التصنيف *</label>
            <select name="category" value={form.category} onChange={handleChange} required style={fieldStyle}>
              {TIBB_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* صورة مع رفع */}
        <FileUploadField
          label="صورة العنصر"
          value={form.imageUrl}
          onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
          accept="image"
          placeholder="https://... أو ارفع صورة"
        />

        <div>
          <label style={labelStyle}>الحديث النبوي المتعلق</label>
          <textarea name="hadith" value={form.hadith} onChange={handleChange}
            placeholder="في الحبة السوداء شفاء من كل داء إلا السام..." rows={3} style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>مصدر الحديث</label>
          <input name="hadithSource" value={form.hadithSource} onChange={handleChange}
            placeholder="رواه البخاري ومسلم" style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>الفوائد (كل فائدة في سطر منفصل)</label>
          <textarea name="benefits" value={form.benefits} onChange={handleChange}
            placeholder={`تعزز المناعة\nتقلل الالتهابات\nمفيدة للجهاز الهضمي`}
            rows={4} style={fieldStyle} />
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>📌 اكتب كل فائدة في سطر جديد</p>
        </div>

        <div>
          <label style={labelStyle}>الملاحظة العلمية الحديثة</label>
          <textarea name="scientificNote" value={form.scientificNote} onChange={handleChange}
            placeholder="أثبتت الدراسات أن..." rows={2} style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>طريقة الاستخدام</label>
          <input name="usage" value={form.usage} onChange={handleChange}
            placeholder="ملعقة صغيرة مع العسل على الريق..." style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>⚠️ تحذيرات (إن وجدت)</label>
          <input name="warning" value={form.warning} onChange={handleChange}
            placeholder="لا يُعطى للأطفال دون 2 سنة..." style={fieldStyle} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input type="checkbox" name="isHidden" checked={form.isHidden} onChange={handleChange} id="hidden" style={{ width: '18px', height: '18px' }} />
          <label htmlFor="hidden" style={{ ...labelStyle, marginBottom: 0 }}>إخفاء عن العامة</label>
        </div>

        {msg && <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: msg.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msg.includes('✅') ? '#059669' : '#dc2626', fontWeight: 'bold' }}>{msg}</div>}

        <button type="submit" disabled={saving} style={{ padding: '0.85rem', background: '#166534', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? '⏳ جاري الحفظ...' : `💾 ${isEdit ? 'حفظ التعديلات' : 'إضافة'}`}
        </button>
      </form>
    </div>
  );
};
export default AdminTibbForm;
