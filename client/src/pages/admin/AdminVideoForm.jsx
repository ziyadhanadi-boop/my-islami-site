import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminVideoForm = () => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [views, setViews] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await axios.get('/api/videosList?admin=true');
          const item = res.data.find(i => i._id === id);
          if (item) {
        setTitle(item.title || '');
        setDuration(item.duration || '');
        setViews(item.views || '');
        setThumbnailUrl(item.thumbnailUrl || '');
        setVideoUrl(item.videoUrl || '');
          }
        } catch (error) {
          console.error('Error fetching item', error);
        }
      };
      fetchItem();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const data = { title, duration, views, thumbnailUrl, videoUrl };

    try {
      if (id) {
        await axios.put(`/api/videosList/${id}`, data, { headers: { 'x-auth-token': token } });
        alert('تم التحديث بنجاح');
      } else {
        await axios.post('/api/videosList', data, { headers: { 'x-auth-token': token } });
        alert('تمت الإضافة بنجاح');
      }
      navigate('/admin/dashboard?tab=videosList');
    } catch (error) {
      console.error('Error saving', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>{id ? 'تعديل فيديو' : 'إضافة فيديو'}</h1>
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">عنوان الفيديو</label>
          <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">مدة الفيديو (مثال: 12:05)</label>
          <input type="text" className="form-control" value={duration} onChange={e => setDuration(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">عدد المشاهدات (مثال: 15K)</label>
          <input type="text" className="form-control" value={views} onChange={e => setViews(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">رابط الصورة المصغرة للفيديو</label>
          <input type="text" className="form-control" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">رابط فيديو يوتيوب (Embed)</label>
          <input type="text" className="form-control" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required />
        </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button type="button" className="btn btn-danger" onClick={() => navigate('/admin/dashboard?tab=videosList')}>
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminVideoForm;
