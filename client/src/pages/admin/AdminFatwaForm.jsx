import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminFatwaForm = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await axios.get('/api/fatwaArchive?admin=true');
          const item = res.data.find(i => i._id === id);
          if (item) {
            setQuestion(item.question || '');
            setAnswer(item.answer || '');
            setCategory(item.category || '');
            setPosition(item.position || 0);
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
    const data = { question, answer, category, position: parseInt(position) || 0 };

    try {
      if (id) {
        await axios.put(`/api/fatwaArchive/${id}`, data, { headers: { 'x-auth-token': token } });
        alert('تم التحديث بنجاح');
      } else {
        await axios.post('/api/fatwaArchive', data, { headers: { 'x-auth-token': token } });
        alert('تمت الإضافة بنجاح');
      }
      navigate('/admin/dashboard?tab=fatwaArchive');
    } catch (error) {
      console.error('Error saving', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>{id ? 'تعديل فتوى للأرشيف' : 'إضافة فتوى للأرشيف'}</h1>
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">السؤال الفقهي</label>
          <input type="text" className="form-control" value={question} onChange={e => setQuestion(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">الجواب المفصل</label>
          <input type="text" className="form-control" value={answer} onChange={e => setAnswer(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">تصنيف الفتوى</label>
          <input type="text" className="form-control" value={category} onChange={e => setCategory(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">الترتيب / الأولوية (الأرقام الأعلى تظهر أولاً)</label>
          <input type="number" className="form-control" value={position} onChange={e => setPosition(e.target.value)} />
        </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button type="button" className="btn btn-danger" onClick={() => navigate('/admin/dashboard?tab=fatwaArchive')}>
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminFatwaForm;
