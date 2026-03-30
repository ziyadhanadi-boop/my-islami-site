import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminKidContentForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('wudu');
  const [contentType, setContentType] = useState('text');
  const [contentBody, setContentBody] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await axios.get('/api/kidContent?admin=true');
          const item = res.data.find(i => i._id === id);
          if (item) {
            setTitle(item.title || '');
            setCategory(item.category || 'wudu');
            setContentType(item.contentType || 'text');
            setContentBody(item.contentBody || '');
            setCoverImage(item.coverImage || '');
            setOrderIndex(item.orderIndex || 0);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchItem();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const data = { title, category, contentType, contentBody, coverImage, orderIndex };

    try {
      if (id) {
        await axios.put(`/api/kidContent/${id}`, data, { headers: { 'x-auth-token': token } });
      } else {
        await axios.post('/api/kidContent', data, { headers: { 'x-auth-token': token } });
      }
      navigate('/admin/dashboard?tab=kidContent');
    } catch (error) {
      alert('Error saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>{id ? 'تعديل محتوى' : 'إضافة محتوى للأطفال'}</h1>
      <div className="card" style={{ padding: '2rem', borderTop: '5px solid #ef4444' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">العنوان (مثل: الخطوة الأولى في الوضوء النية)</label><input type="text" className="form-control" value={title} onChange={e=>setTitle(e.target.value)} required /></div>
          
          <div className="form-group">
            <label className="form-label">التصنيف</label>
            <select className="form-control" value={category} onChange={e=>setCategory(e.target.value)}>
               <option value="wudu">الوضوء 💧</option>
               <option value="salah">الصلاة 🕌</option>
               <option value="adhkar">أذكار 🌟</option>
               <option value="stories">قصص الأنبياء 📖</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">نوع الإضافة المرفقة</label>
            <select className="form-control" value={contentType} onChange={e=>setContentType(e.target.value)}>
               <option value="text">نص فقط (دعاء أو حكاية)</option>
               <option value="image">نص مع صورة توضيحية (للخطوات)</option>
               <option value="video">نص مع رابط فيديو يوتيوب</option>
            </select>
          </div>

          <div className="form-group">
             <label className="form-label">محتوى الدرس أو الخطوة التفصيلية</label>
             <textarea className="form-control" value={contentBody} onChange={e=>setContentBody(e.target.value)} required rows="5" placeholder="أدخل الشرح هنا للطفل بطريقة مبسطة..."></textarea>
          </div>

          {contentType !== 'text' && (
             <div className="form-group">
               <label className="form-label">{contentType === 'video' ? 'رابط يوتيوب (EmbedURL)' : 'رابط الصورة التوضيحية (.jpg/.png)'}</label>
               <input type="text" className="form-control" value={coverImage} onChange={e=>setCoverImage(e.target.value)} required={contentType !== 'text'} />
             </div>
          )}

          <div className="form-group"><label className="form-label">الترتيب الزمني (לخطوات الصلاة أو الوضوء)</label><input type="number" className="form-control" value={orderIndex} onChange={e=>setOrderIndex(e.target.value)} required /></div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{backgroundColor: '#ef4444'}} disabled={loading}>حفظ وإضافة لركن الأطفال 🧸</button>
            <button type="button" className="btn btn-danger" onClick={() => navigate('/admin/dashboard?tab=kidContent')}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminKidContentForm;
