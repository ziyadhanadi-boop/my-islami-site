import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FileUploadField from '../../components/FileUploadField';

const DUA_CATEGORIES = ['الصباح والمساء','قبل النوم وعند الاستيقاظ','الكرب والهموم','السفر','الطعام والشراب','دخول المسجد وبعد الأذان','الاستخارة','المرض والشفاء','مواقف يومية','أدعية قرآنية','أخرى'];

const AdminDuaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    title: '', arabicText: '', transliteration: '', meaning: '',
    source: '', category: 'الكرب والهموم', occasion: '', imageUrl: '', isHidden: false
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/duas/${id}`).then(r => setForm(r.data)).catch(() => alert('خطأ في جلب البيانات'));
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
      if (isEdit) await axios.put(`/api/duas/${id}`, form, { headers });
      else await axios.post('/api/duas', form, { headers });
      setMsg('✅ تم الحفظ بنجاح');
      setTimeout(() => navigate('/admin/dashboard?tab=duas'), 1200);
    } catch { setMsg('❌ حدث خطأ أثناء الحفظ'); }
    setSaving(false);
  };

  const fieldStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.65rem', border: '1.5px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '0.4rem', color: 'var(--text-primary)', fontSize: '0.9rem' };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/dashboard?tab=duas')} style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--text-primary)' }}>← رجوع</button>
        <h2 style={{ margin: 0, color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>🤲 {isEdit ? 'تعديل دعاء' : 'إضافة دعاء جديد'}</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--surface-color)', borderRadius: '1.25rem', padding: '2rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <div>
          <label style={labelStyle}>العنوان (اختياري)</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="مثال: دعاء الكرب" style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>التصنيف *</label>
          <select name="category" value={form.category} onChange={handleChange} required style={fieldStyle}>
            {DUA_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>نص الدعاء بالعربية *</label>
          <textarea name="arabicText" value={form.arabicText} onChange={handleChange}
            placeholder="اللهم إني أسألك..." required rows={4}
            style={{ ...fieldStyle, lineHeight: 2, fontSize: '1.15rem' }} />
        </div>

        <div>
          <label style={labelStyle}>المعنى / الشرح</label>
          <textarea name="meaning" value={form.meaning} onChange={handleChange}
            placeholder="يعني هذا الدعاء..." rows={2} style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>المصدر</label>
          <input name="source" value={form.source} onChange={handleChange}
            placeholder="رواه البخاري، سورة البقرة آية..." style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>مناسبة القراءة</label>
          <input name="occasion" value={form.occasion} onChange={handleChange}
            placeholder="عند الكرب والضيق، قبل النوم..." style={fieldStyle} />
        </div>

        <div>
          <label style={labelStyle}>النقحرة (Transliteration) - اختياري</label>
          <input name="transliteration" value={form.transliteration} onChange={handleChange}
            placeholder="Allahumma inni as'aluka..." style={fieldStyle} />
        </div>

        {/* صورة توضيحية — رفع أو رابط */}
        <FileUploadField
          label="صورة توضيحية (اختياري)"
          value={form.imageUrl}
          onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
          accept="image"
          placeholder="https://... أو ارفع صورة"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input type="checkbox" name="isHidden" checked={form.isHidden} onChange={handleChange} id="hidden" style={{ width: '18px', height: '18px' }} />
          <label htmlFor="hidden" style={{ ...labelStyle, marginBottom: 0 }}>إخفاء عن العامة</label>
        </div>

        {msg && <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: msg.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msg.includes('✅') ? '#059669' : '#dc2626', fontWeight: 'bold' }}>{msg}</div>}

        <button type="submit" disabled={saving} style={{ padding: '0.85rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? '⏳ جاري الحفظ...' : `💾 ${isEdit ? 'حفظ التعديلات' : 'إضافة الدعاء'}`}
        </button>
      </form>
    </div>
  );
};
export default AdminDuaForm;
