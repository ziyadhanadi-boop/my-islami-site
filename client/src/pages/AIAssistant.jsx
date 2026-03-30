import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'أهلاً بك يا أخي الكريم.. أنا مساعدك الإسلامي الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن التاريخ، السيرة، الأذكار أو أي معلومات إسلامية.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', { prompt: userText });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'عذراً، حدث خطأ في الاتصال بالخدمة. يرجى المحاولة لاحقاً.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', height: '85vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--primary-color)', fontSize: '1.8rem' }}>🤖 المساعد الإسلامي الذكي</h2>
        <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>⚠️ تنبيه: هذا الرد آلي (ذكاء اصطناعي)، ولا يعتبر مصدراً للفتوى الشرعية.</p>
      </header>

      <div ref={scrollRef} style={{ 
        flex: 1, 
        backgroundColor: 'var(--surface-color)', 
        borderRadius: '1rem', 
        padding: '1.5rem', 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid var(--border-color)'
      }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ 
            alignSelf: m.role === 'user' ? 'flex-start' : 'flex-end',
            maxWidth: '85%',
            padding: '0.8rem 1.25rem',
            borderRadius: '1.25rem',
            backgroundColor: m.role === 'user' ? 'var(--primary-color)' : 'var(--bg-color)',
            color: m.role === 'user' ? 'white' : 'var(--text-primary)',
            fontSize: '1rem',
            lineHeight: '1.6',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
            border: m.role === 'assistant' ? '1px solid var(--border-color)' : 'none'
          }}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-end', color: 'var(--text-muted)', fontSize: '0.9rem' }}>جاري التفكير... ✍️</div>
        )}
      </div>

      <form onSubmit={handleSend} style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          style={{ 
            flex: 1, 
            padding: '1rem', 
            borderRadius: '2rem', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'var(--surface-color)',
            color: 'var(--text-primary)'
          }}
        />
        <button type="submit" disabled={loading} style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--primary-color)', 
          border: 'none', 
          color: 'white', 
          fontSize: '1.5rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? '...' : '✈️'}
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
