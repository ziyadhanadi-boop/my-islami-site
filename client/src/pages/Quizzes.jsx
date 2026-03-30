import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const Quizzes = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('/api/quizzes');
        setQuizQuestions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleAnswer = (index) => {
    if (index === quizQuestions[currentQ].answerIndex) setScore(score + 1);
    
    if (currentQ + 1 < quizQuestions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
  };

  if (loading) return <Loader message="تجهيز أسئلة المسابقة... 🎮" />;
  if (quizQuestions.length === 0) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}><h2>لا توجد أسئلة حالياً</h2></div>;

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '600px' }}>
      <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary-color)', marginBottom: '2rem' }}>🎮 اختبر معلوماتك</h1>
        
        {showResult ? (
          <div>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{score >= 2 ? '🏆' : '📚'}</div>
            <h2>نتيجتك: {score} من {quizQuestions.length}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {score === quizQuestions.length ? 'ممتاز! لديك ثقافة إسلامية رائعة.' : 'ابدأ من جديد لتوسيع معرفتك الإسلامية!'}
            </p>
            <button className="btn btn-primary" onClick={reset}>إعادة الاختبار 🔄</button>
          </div>
        ) : (
          <div>
            <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>السؤال {currentQ + 1} من {quizQuestions.length}</div>
            <h2 style={{ marginBottom: '2rem', lineHeight: '1.5' }}>{quizQuestions[currentQ].question}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {quizQuestions[currentQ].options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(i)}
                  className="btn"
                  style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '1rem', justifyContent: 'flex-start', fontSize: '1rem' }}
                >
                  {i + 1}. {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
