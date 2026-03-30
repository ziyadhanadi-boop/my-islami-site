import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';

const AdminDailyQuoteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    text: '',
    category: 'عام',
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
      const fetchQuote = async () => {
        setFetching(true);
        try {
          const res = await axios.get(`/api/daily-quotes/${id}`);
          setFormData({
            text: res.data.text,
            category: res.data.category || 'عام',
            isHidden: res.data.isHidden
          });
        } catch (error) {
          console.error('Error fetching quote', error);
        } finally {
          setFetching(false);
        }
      };
      fetchQuote();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { 'x-auth-token': token } };

      if (id) {
        await axios.put(`/api/daily-quotes/${id}`, formData, config);
      } else {
        await axios.post('/api/daily-quotes', formData, config);
      }
      navigate('/admin/dashboard?tab=dailyQuotes');
    } catch (error) {
      console.error('Error saving quote', error);
      alert('حدث خطأ أثناء حفظ الرسالة');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader message="جاري جلب بيانات الرسالة..." />;

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '700px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 'bold' }}>&rarr; عودة</button>
      
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-color)' }}>{id ? 'تعديل رسالة اليوم' : 'إضافة رسالة يومية جديدة'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>نص الرسالة:</label>
            <textarea 
              className="form-control" 
              rows="5"
              required 
              value={formData.text} 
              onChange={e => setFormData({ ...formData, text: e.target.value })}
              placeholder="اكتب نص رسالة اليوم هنا..."
              style={{ padding: '0.75rem', fontSize: '1.1rem' }}
            ></textarea>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>التصنيف:</label>
            <select 
              className="form-control" 
              required 
              value={formData.category} 
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              style={{ padding: '0.75rem' }}
            >
              <option value="عام">عام</option>
              <option value="قرآن">قرآن كريم</option>
              <option value="حديث">حديث شريف</option>
              <option value="إيمانيات">إيمانيات</option>
              <option value="أذكار">أذكار</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="isHidden"
              checked={formData.isHidden} 
              onChange={e => setFormData({ ...formData, isHidden: e.target.checked })} 
            />
            <label htmlFor="isHidden" style={{ cursor: 'pointer' }}>إخفاء الرسالة مؤقتاً</label>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }} disabled={loading}>
            {loading ? 'جاري الحفظ...' : (id ? 'تحديث الرسالة' : 'حفظ الرسالة')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDailyQuoteForm;
