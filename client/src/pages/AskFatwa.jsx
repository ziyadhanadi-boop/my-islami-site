import React, { useState } from 'react';
import axios from 'axios';

const AskFatwa = () => {
  const [formData, setFormData] = useState({ name: '', email: '', question: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await axios.post('/api/messages', formData);
      setStatus('success');
      setFormData({ name: '', email: '', question: '' });
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '700px' }}>
      <div className="card fade-up" style={{ padding: '3rem 2rem', borderTop: '5px solid var(--primary-color)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>
          أرسل سؤالك الشرعي
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.8' }}>
          هذا القسم مخصص لإرسال استفساراتكم وأسئلتكم الشرعية لإدارة المنصة. 
          سيتم دراسة السؤال والإجابة عليه بإذن الله في قسم "فتاوى" قريباً.
        </p>

        {status === 'success' && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', textAlign: 'center', border: '1px solid currentColor' }}>
            ✅ تم إرسال سؤالك بنجاح! سيتم نشر الإجابة حال توفرها.
          </div>
        )}
        {status === 'error' && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', textAlign: 'center', border: '1px solid currentColor' }}>
            ❌ حدث خطأ في إرسال السؤال، يرجى المحاولة لاحقاً.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">الاسم أو اللقب *</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              placeholder="اكتب اسمك..." 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">البريد الإلكتروني (اختياري)</label>
            <input 
              type="email" 
              className="form-control" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              placeholder="لإشعارك عند الإجابة..." 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label">السؤال أو الاستفسار *</label>
            <textarea 
              className="form-control" 
              required 
              rows="6" 
              value={formData.question} 
              onChange={e => setFormData({ ...formData, question: e.target.value })} 
              placeholder="اكتب سؤالك بالتفصيل هنا ليتمكن المفتي من إجابتك بدقة..." 
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
            {loading ? 'جاري الإرسال...' : 'إرسال السؤال الآن 📝'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskFatwa;
