import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FileUploadField from '../../components/FileUploadField';

const POD_CATS = ['عقيدة', 'فقه', 'تزكية', 'سيرة', 'تفسير', 'حديث', 'دعاء وذكر', 'عام'];

const AdminPodcastForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    title: '', description: '', speaker: '', category: 'عام',
    audioUrl: '', imageUrl: '', duration: '', isHidden: false
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isEdit) axios.get(`/api/podcasts/${id}`).then(r => setForm(r.data)).catch(() => alert('خطأ'));
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
      if (isEdit) await axios.put(`/api/podcasts/${id}`, form, { headers });
      else await axios.post('/api/podcasts', form, { headers });
      setMsg('✅ تم الحفظ بنجاح');
      setTimeout(() => navigate('/admin/dashboard?tab=podcasts'), 1200);
    } catch { setMsg('❌ حدث خطأ'); }
    setSaving(false);
  };

  const fieldStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '0.65rem', border: '1.5px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' };
  const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '0.4rem', color: 'var(--text-primary)', fontSize: '0.9rem' };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/admin/dashboard?tab=podcasts')} style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.5rem 1rem', cursor: 'pointer', color: 'var(--text-primary)' }}>← رجوع</button>
        <h2 style={{ margin: 0, color: '#4f46e5', fontFamily: 'var(--font-heading)' }}>🎙️ {isEdit ? 'تعديل بودكاست' : 'إضافة بودكاست جديد'}</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--surface-color)', borderRadius: '1.25rem', padding: '2rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <div>
          <label style={labelStyle}>عنوان المحاضرة / الحلقة *</label>
          <input name="title" value={form.title} onChange={handleChange}
            placeholder="شرح صحيح البخاري - الحلقة الأولى" required style={fieldStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>اسم المتحدث (الشيخ)</label>
            <input name="speaker" value={form.speaker} onChange={handleChange}
              placeholder="الشيخ محمد العريفي" style={fieldStyle} />
          </div>
          <div>
            <label style={labelStyle}>التصنيف *</label>
            <select name="category" value={form.category} onChange={handleChange} required style={fieldStyle}>
              {POD_CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* رفع الملف الصوتي */}
        <FileUploadField
          label="🎵 ملف الصوت (MP3) *"
          value={form.audioUrl}
          onChange={url => setForm(f => ({ ...f, audioUrl: url }))}
          accept="audio"
          placeholder="https://... أو ارفع ملف صوتي MP3"
        />

        <div>
          <label style={labelStyle}>وصف مختصر</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="يتناول هذا الدرس شرح حديث..." rows={3} style={fieldStyle} />
        </div>

        {/* صورة الغلاف */}
        <FileUploadField
          label="🖼️ صورة الغلاف (اختياري)"
          value={form.imageUrl}
          onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
          accept="image"
          placeholder="https://... أو ارفع صورة"
        />

        <div>
          <label style={labelStyle}>المدة الزمنية (مثال: 45:30)</label>
          <input name="duration" value={form.duration} onChange={handleChange}
            placeholder="45:30" style={{ ...fieldStyle, maxWidth: '200px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input type="checkbox" name="isHidden" checked={form.isHidden} onChange={handleChange} id="hidden" style={{ width: '18px', height: '18px' }} />
          <label htmlFor="hidden" style={{ ...labelStyle, marginBottom: 0 }}>إخفاء عن العامة</label>
        </div>

        {msg && <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: msg.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msg.includes('✅') ? '#059669' : '#dc2626', fontWeight: 'bold' }}>{msg}</div>}

        <button type="submit" disabled={saving} style={{ padding: '0.85rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? '⏳ جاري الحفظ...' : `💾 ${isEdit ? 'حفظ التعديلات' : 'إضافة البودكاست'}`}
        </button>
      </form>
    </div>
  );
};
export default AdminPodcastForm;
