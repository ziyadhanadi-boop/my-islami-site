import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminBookForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [pages, setPages] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await axios.get('/api/books?admin=true');
          const item = res.data.find(i => i._id === id);
          if (item) {
        setTitle(item.title || '');
        setAuthor(item.author || '');
        setCategory(item.category || '');
        setPages(item.pages || '');
        setCoverUrl(item.coverUrl || '');
        setPdfUrl(item.pdfUrl || '');
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
    const data = { title, author, category, pages, coverUrl, pdfUrl };

    try {
      if (id) {
        await axios.put(`/api/books/${id}`, data, { headers: { 'x-auth-token': token } });
        alert('تم التحديث بنجاح');
      } else {
        await axios.post('/api/books', data, { headers: { 'x-auth-token': token } });
        alert('تمت الإضافة بنجاح');
      }
      navigate('/admin/dashboard?tab=books');
    } catch (error) {
      console.error('Error saving', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>{id ? 'تعديل كتاب' : 'إضافة كتاب'}</h1>
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">عنوان الكتاب</label>
          <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">اسم المؤلف</label>
          <input type="text" className="form-control" value={author} onChange={e => setAuthor(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">التصنيف (مثال: سيرة، فقه)</label>
          <input type="text" className="form-control" value={category} onChange={e => setCategory(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">عدد الصفحات</label>
          <input type="text" className="form-control" value={pages} onChange={e => setPages(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">رابط غلاف الكتاب (صورة)</label>
          <input type="text" className="form-control" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">رابط ملف الـ PDF للتحميل</label>
          <input type="text" className="form-control" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} required />
        </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button type="button" className="btn btn-danger" onClick={() => navigate('/admin/dashboard?tab=books')}>
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminBookForm;
