import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminZikrForm = () => {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('اذكار الصباح والمساء');
  const [count, setCountValue] = useState(1);
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
      const fetchZikr = async () => {
        try {
          const res = await axios.get(`/api/zikr?admin=true&t=${Date.now()}`, {
            headers: { 'x-auth-token': token }
          });
          // Find the specific zikr if get returns an array
          const zikr = Array.isArray(res.data) ? res.data.find(z => z._id === id) : res.data;
          if (zikr) {
            setText(zikr.text);
            setDescription(zikr.description || '');
            setCategory(zikr.category || 'عام');
            setCountValue(zikr.count || 1);
            setIsHidden(zikr.isHidden || false);
          }
        } catch (error) {
          console.error('Error fetching zikr', error);
        }
      };
      fetchZikr();
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const data = { text, description, category, count: parseInt(count), isHidden };

    try {
      if (isEditMode) {
        await axios.put(`/api/zikr/${id}`, data, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await axios.post('/api/zikr', data, {
          headers: { 'x-auth-token': token }
        });
      }
      navigate('/admin/dashboard?tab=zikr');
    } catch (error) {
      console.error('Error saving zikr', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)', fontSize: '2rem' }}>
        {isEditMode ? 'تعديل ذكر' : 'إضافة ذكر جديد'}
      </h2>
      <div className="card" style={{ padding: '2.5rem', borderRadius: '0.75rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>نص الذكر</label>
            <textarea className="form-control" rows="4" style={{ padding: '1rem', fontSize: '1.1rem', lineHeight: '1.6' }} value={text} onChange={e => setText(e.target.value)} required placeholder="اكتب نص الذكر هنا..."></textarea>
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>الوصف أو الفضل (اختياري)</label>
            <input type="text" className="form-control" style={{ padding: '0.75rem', fontSize: '1rem' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="مثال: مائة مرة، حطت خطاياه..." />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>التصنيف</label>
            <select className="form-control" style={{ padding: '0.75rem', fontSize: '1rem' }} value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="اذكار الصباح">أذكار الصباح</option>
              <option value="اذكار المساء">أذكار المساء</option>
              <option value="اذكار الصلاة">أذكار الصلاة</option>
              <option value="أذكار النوم">أذكار النوم</option>
              <option value="عام">عام</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>عدد التكرار (العدد المستهدف)</label>
            <input 
              type="number" 
              className="form-control" 
              min="1" 
              style={{ padding: '0.75rem', fontSize: '1.1rem' }} 
              value={count} 
              onChange={e => setCountValue(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="hidden" checked={isHidden} onChange={e => setIsHidden(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem' }} />
            <label htmlFor="hidden" className="form-label" style={{ margin: 0, fontSize: '1.125rem', cursor: 'pointer' }}>إخفاء هذا الذكر مؤقتاً</label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>حفظ</button>
            <button type="button" onClick={() => navigate('/admin/dashboard?tab=zikr')} className="btn" style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.75rem 2rem', fontSize: '1.125rem', border: '1px solid #cbd5e1' }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminZikrForm;
