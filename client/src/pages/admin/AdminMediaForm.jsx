import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminMediaForm = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('video');
  const [category, setCategory] = useState('reciter');
  const [description, setDescription] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (isEditMode) {
      const fetchMedia = async () => {
        try {
          const res = await axios.get(`/api/media?admin=true&t=${Date.now()}`, {
            headers: { 'x-auth-token': token }
          });
          const media = Array.isArray(res.data) ? res.data.find(m => m._id === id) : res.data;
          if (media) {
            setTitle(media.title);
            setUrl(media.url);
            setType(media.type);
            setCategory(media.category);
            setDescription(media.description || '');
            setIsHidden(media.isHidden || false);
          }
        } catch (error) {
          console.error('Error fetching media', error);
        }
      };
      fetchMedia();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const data = { title, url, type, category, description, isHidden };

    try {
      if (isEditMode) {
        await axios.put(`/api/media/${id}`, data, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post('/api/media', data, {
          headers: { 'x-auth-token': token }
        });
      }
      navigate('/admin/dashboard?tab=media');
    } catch (error) {
      console.error('Error saving media', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)', fontSize: '2rem' }}>
        {isEditMode ? 'تعديل وسائط' : 'إضافة وسائط جديدة'}
      </h2>
      <div className="card" style={{ padding: '2.5rem', borderRadius: '0.75rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>العنوان</label>
            <input type="text" className="form-control" style={{ padding: '0.75rem', fontSize: '1rem' }} value={title} onChange={e => setTitle(e.target.value)} required placeholder="مثال: سورة البقرة بصوت الشيخ..." />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>الرابط (رابط يوتيوب أو ملف صوتي)</label>
            <input type="url" className="form-control" style={{ padding: '0.75rem', fontSize: '1rem' }} value={url} onChange={e => setUrl(e.target.value)} required placeholder="https://youtube.com/..." />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ fontSize: '1.125rem' }}>النوع</label>
              <select className="form-control" style={{ padding: '0.75rem' }} value={type} onChange={e => setType(e.target.value)}>
                <option value="video">مرئي (فيديو)</option>
                <option value="audio">صوتي</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ fontSize: '1.125rem' }}>التصنيف</label>
              <select className="form-control" style={{ padding: '0.75rem' }} value={category} onChange={e => setCategory(e.target.value)}>
                <option value="reciter">قراءة/قارئ</option>
                <option value="fatwa">فتوى/محاضرة</option>
              </select>
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>وصف (اختياري)</label>
            <textarea className="form-control" rows="3" style={{ padding: '1rem', fontSize: '1rem' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف قصير للوسائط..."></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="hidden" checked={isHidden} onChange={e => setIsHidden(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem' }} />
            <label htmlFor="hidden" className="form-label" style={{ margin: 0, fontSize: '1.125rem', cursor: 'pointer' }}>إخفاء من العرض العام</label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>حفظ</button>
            <button type="button" onClick={() => navigate('/admin/dashboard?tab=media')} className="btn" style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.75rem 2rem', fontSize: '1.125rem', border: '1px solid #cbd5e1' }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminMediaForm;
