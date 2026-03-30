import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminCampaign = () => {
  const [subject, setSubject] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('/api/newsletter', { headers: { 'x-auth-token': token } });
        setSubscribersCount(res.data.length);
      } catch(err) {
        console.error(err);
      }
    };
    fetchSubs();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (subscribersCount === 0) return alert('لا يوجد مشتركون لإرسال الإيميل لهم!');
    if (!subject || !htmlBody || htmlBody === '<p><br></p>') return alert('أدخل الموضوع والرسالة');
    
    if (window.confirm(`هل أنت متأكد من إرسال هذا الإيميل إلى ${subscribersCount} مشترك؟`)) {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        await axios.post('/api/newsletter/campaign', { subject, htmlBody }, {
          headers: { 'x-auth-token': token }
        });
        alert('تم إرسال الحملة بنجاح!');
        setSubject('');
        setHtmlBody('');
      } catch (err) {
        alert(err.response?.data?.msg || 'حدث خطأ أثناء الإرسال');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>حملة بريدية جديدة 📧</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>
        سيتم إرسال هذا البريد الإلكتروني سراً (Bcc) إلى <strong>{subscribersCount}</strong> مشترك مسجل في اللائحة.
      </p>

      <div className="card" style={{ padding: '2rem', borderTop: '5px solid #3b82f6' }}>
        <form onSubmit={handleSend}>
          <div className="form-group">
            <label className="form-label">موضوع الإرسال (Subject)</label>
            <input 
              type="text" 
              className="form-control" 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
              placeholder="مثال: مقراب جديد ومهم نزل على منصة إسلامي"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">محتوى البريد الإلكتروني</label>
            <div style={{ background: '#fff', color: '#000', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <ReactQuill 
                theme="snow" 
                value={htmlBody} 
                onChange={setHtmlBody} 
                style={{ height: '300px', marginBottom: '45px' }}
                placeholder="اكتب رسالتك المنمقة لزوارك هنا، ويمكنك إدراج روابط وصور وتلوين النص..."
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.3rem', background: '#3b82f6' }} disabled={loading || subscribersCount === 0}>
            {loading ? 'جاري الإرسال (يرجى الانتظار)...' : 'إرسال الحملة للكل الآن 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCampaign;
