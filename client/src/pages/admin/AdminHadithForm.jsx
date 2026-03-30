import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';

const AdminHadithForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    text: '',
    source: '',
    isHidden: false
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (id) {
      const fetchHadith = async () => {
        setFetching(true);
        try {
          const res = await axios.get(`/api/hadith/${id}`);
          setFormData({
            text: res.data.text,
            source: res.data.source,
            isHidden: res.data.isHidden
          });
        } catch (error) {
          console.error('Error fetching hadith', error);
        } finally {
          setFetching(false);
        }
      };
      fetchHadith();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { 'x-auth-token': token } };

      if (id) {
        await axios.put(`/api/hadith/${id}`, formData, config);
      } else {
        await axios.post('/api/hadith', formData, config);
      }
      navigate('/admin/dashboard?tab=hadith');
    } catch (error) {
      console.error('Error saving hadith', error);
      alert('حدث خطأ أثناء حفظ الحديث');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader message="جاري جلب بيانات الحديث..." />;

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '700px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}>&rarr; عودة</button>
      
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-color)' }}>{id ? 'تعديل حديث' : 'إضافة حديث نبوي جديد'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>نص الحديث:</label>
            <textarea 
              className="form-control" 
              rows="5"
              required 
              value={formData.text} 
              onChange={e => setFormData({ ...formData, text: e.target.value })}
              placeholder="اكتب نص الحديث الشريف هنا..."
              style={{ padding: '0.75rem', fontSize: '1.1rem' }}
            ></textarea>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>المصدر (الراوي/الكتاب):</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={formData.source} 
              onChange={e => setFormData({ ...formData, source: e.target.value })}
              placeholder="مثال: رواه البخاري، مسلم، متفق عليه..."
              style={{ padding: '0.75rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="isHidden"
              checked={formData.isHidden} 
              onChange={e => setFormData({ ...formData, isHidden: e.target.checked })} 
            />
            <label htmlFor="isHidden" style={{ cursor: 'pointer' }}>إخفاء الحديث مؤقتاً</label>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }} disabled={loading}>
            {loading ? 'جاري الحفظ...' : (id ? 'تحديث الحديث' : 'حفظ الحديث')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminHadithForm;
