import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminQuizForm = () => {
  const [question, setQuestion] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [answerIndex, setAnswerIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        try {
          const res = await axios.get('/api/quizzes');
          const item = res.data.find(i => i._id === id);
          if (item) {
            setQuestion(item.question);
            setOpt1(item.options[0] || '');
            setOpt2(item.options[1] || '');
            setOpt3(item.options[2] || '');
            setOpt4(item.options[3] || '');
            setAnswerIndex(item.answerIndex || 0);
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
    const data = { question, options: [opt1, opt2, opt3, opt4].filter(Boolean), answerIndex: parseInt(answerIndex) };

    try {
      if (id) {
        await axios.put(`/api/quizzes/${id}`, data, { headers: { 'x-auth-token': token } });
      } else {
        await axios.post('/api/quizzes', data, { headers: { 'x-auth-token': token } });
      }
      navigate('/admin/dashboard?tab=quizzes');
    } catch (error) {
      alert('Error saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>{id ? 'تعديل سؤال' : 'إضافة سؤال لمسابقة تختبر معلوماتك'}</h1>
      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">السؤال</label><input type="text" className="form-control" value={question} onChange={e=>setQuestion(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">الخيار الأول (سيحمل رقم 0)</label><input type="text" className="form-control" value={opt1} onChange={e=>setOpt1(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">الخيار الثاني (سيحمل رقم 1)</label><input type="text" className="form-control" value={opt2} onChange={e=>setOpt2(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">الخيار الثالث (سيحمل رقم 2)</label><input type="text" className="form-control" value={opt3} onChange={e=>setOpt3(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">الخيار الرابع (سيحمل رقم 3)</label><input type="text" className="form-control" value={opt4} onChange={e=>setOpt4(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">رقم الإجابة الصحيحة (0, 1, 2, 3)</label><input type="number" min="0" max="3" className="form-control" value={answerIndex} onChange={e=>setAnswerIndex(e.target.value)} required /></div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>حفظ</button>
            <button type="button" className="btn btn-danger" onClick={() => navigate('/admin/dashboard?tab=quizzes')}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminQuizForm;
