import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'أهلاً بك! أنا مساعدك الإسلامي الذكي 🌙\nيمكنني مساعدتك في أسئلة التاريخ الإسلامي، الأذكار، السيرة النبوية وأكثر.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const widgetRef = useRef(null);

  // Dragging State
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  // Persistent Position
  useEffect(() => {
    const savedPos = localStorage.getItem('chat_widget_pos');
    if (savedPos) {
      try {
        const parsed = JSON.parse(savedPos);
        const x = Math.min(Math.max(20, parsed.x), window.innerWidth - 80);
        const y = Math.min(Math.max(20, parsed.y), window.innerHeight - 80);
        setPosition({ x, y });
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const handleMove = (e) => handleDrag(e);
    const handleEnd = () => handleDragEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragStart, position]);

  const [isSnapping, setIsSnapping] = useState(false);

  const handleDragStart = (e) => {
    setIsSnapping(false);
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  const handleDrag = (e) => {
    if (!isDragging) return;
    
    if (e.type === 'touchmove') {
       e.preventDefault();
    }

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;

    const boundedX = Math.min(Math.max(10, newX), window.innerWidth - 60);
    const boundedY = Math.min(Math.max(10, newY), window.innerHeight - 60);

    if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
        setHasMoved(true);
    }

    setPosition({ x: boundedX, y: boundedY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Magnetic Snapping to left or right edges
    setIsSnapping(true);
    const screenWidth = window.innerWidth;
    const centerX = screenWidth / 2;
    const widgetWidth = 50;
    
    let finalX = position.x < centerX ? 15 : screenWidth - widgetWidth - 15;
    const finalY = position.y;

    setPosition({ x: finalX, y: finalY });
    localStorage.setItem('chat_widget_pos', JSON.stringify({ x: finalX, y: finalY }));
    
    // Clear snapping class after animation 
    setTimeout(() => setIsSnapping(false), 400);
  };

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
      const errMsg = err.response?.data?.msg || err.message || 'حدث خطأ في الاتصال';
      setMessages(prev => [...prev, { role: 'assistant', text: `عذراً: ${errMsg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ['ما معنى سورة الفاتحة؟', 'من هو أول الخلفاء الراشدين؟', 'ما هي أركان الإسلام؟'];

  return (
    <>
      <style>{`
        .chat-widget-btn {
          width: 50px; height: 50px; border-radius: 50%;
          background: linear-gradient(135deg, #0d9488, #0891b2);
          color: white; border: none;
          box-shadow: 0 4px 20px rgba(13,148,136,0.45);
          cursor: pointer; font-size: 1.4rem;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
        }
        .chat-widget-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(13,148,136,0.6); }
        .chat-widget-btn .pulse-ring {
          position: absolute; width: 100%; height: 100%; border-radius: 50%;
          border: 3px solid rgba(13,148,136,0.5);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .chat-window {
          position: absolute; bottom: 80px; right: 0;
          width: min(380px, 93vw);
          height: 520px;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; flex-direction: column;
          animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: var(--surface-color);
        }
        @keyframes slideUp {
          from { transform: translateY(30px) scale(0.9); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        .chat-header {
          padding: 1.1rem 1.25rem;
          background: linear-gradient(135deg, #0d9488 0%, #0891b2 100%);
          color: white;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .chat-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; flex-shrink: 0;
        }
        .chat-header-info h4 { margin: 0; font-size: 1rem; }
        .chat-header-info span { font-size: 0.75rem; opacity: 0.85; }
        .online-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #4ade80; display: inline-block;
          margin-left: 5px; animation: blink 1.5s infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .messages-area {
          flex: 1; padding: 1rem; overflow-y: auto;
          display: flex; flex-direction: column; gap: 0.6rem;
          scrollbar-width: thin;
        }
        .msg-bubble {
          max-width: 82%; padding: 0.7rem 1rem;
          border-radius: 1.25rem;
          font-size: 0.9rem; line-height: 1.55;
          white-space: pre-wrap;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .msg-user {
          align-self: flex-start;
          background: linear-gradient(135deg, #0d9488, #0891b2);
          color: white; border-bottom-right-radius: 0.35rem;
        }
        .msg-assistant {
          align-self: flex-end;
          background: var(--bg-color);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-bottom-left-radius: 0.35rem;
        }
        .typing-indicator { display: flex; gap: 5px; align-items: center; padding: 0.75rem 1rem; }
        .typing-indicator span {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--primary-color); display: inline-block;
          animation: bounce 1.2s infinite;
        }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        .suggestions { padding: 0 1rem 0.75rem; display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .suggestion-chip {
          padding: 0.35rem 0.75rem; border-radius: 1rem; font-size: 0.78rem;
          border: 1px solid var(--primary-color); color: var(--primary-color);
          background: transparent; cursor: pointer; transition: all 0.2s;
        }
        .suggestion-chip:hover { background: var(--primary-color); color: white; }
        .chat-input-area {
          padding: 0.75rem 1rem;
          border-top: 1px solid var(--border-color);
          display: flex; gap: 8px; align-items: center;
        }
        .chat-input {
          flex: 1; padding: 0.65rem 1rem;
          border-radius: 1.5rem;
          border: 1.5px solid var(--border-color);
          background: var(--bg-color);
          color: var(--text-primary);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .chat-input:focus { border-color: var(--primary-color); }
        .send-btn {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, #0d9488, #0891b2);
          border: none; color: white; cursor: pointer;
          font-size: 1.1rem;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s, opacity 0.2s;
          flex-shrink: 0;
        }
        .send-btn:hover { transform: scale(1.1); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .disclaimer { text-align: center; padding: 0.4rem; font-size: 0.68rem; color: var(--text-muted); }
      `}</style>

      <div 
        ref={widgetRef}
        style={{ 
          position: 'fixed', 
          top: position.y + 'px', 
          left: position.x + 'px', 
          zIndex: 9999, 
          direction: 'rtl',
          bottom: 'auto',
          right: 'auto',
          cursor: isDragging ? 'grabbing' : 'auto',
          touchAction: 'none',
          transition: isSnapping ? 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
        }} 
        className="no-print"
      >
        {/* Toggle Button */}
        <button 
           className="chat-widget-btn" 
           onMouseDown={handleDragStart}
           onTouchStart={(e) => {
             if (window.navigator.vibrate) window.navigator.vibrate(5);
             handleDragStart(e);
           }}
           onClick={() => { if (!hasMoved) setIsOpen(o => !o); }} 
           aria-label="فتح المساعد الذكي"
        >
          {!isOpen && <div className="pulse-ring" />}
          <span style={{ transition: 'transform 0.3s', pointerEvents: 'none', transform: isOpen ? 'rotate(45deg)' : 'none' }}>
            {isOpen ? '✕' : '🤖'}
          </span>
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div className="chat-window" style={{ 
              bottom: position.y < window.innerHeight / 2 ? 'auto' : '80px',
              top: position.y < window.innerHeight / 2 ? '80px' : 'auto',
              right: position.x < window.innerWidth / 2 ? 'auto' : '0',
              left: position.x < window.innerWidth / 2 ? '0' : 'auto',
          }}>
            {/* Header */}
            <div className="chat-header">
              <div className="chat-avatar">🕌</div>
              <div className="chat-header-info">
                <h4>المساعد الإسلامي الذكي</h4>
                <span><span className="online-dot" />متصل الآن</span>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-area" ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} className={`msg-bubble ${m.role === 'user' ? 'msg-user' : 'msg-assistant'}`}>
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="msg-bubble msg-assistant" style={{ padding: '0.5rem 1rem' }}>
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="suggestions">
                {suggestions.map((s, i) => (
                  <button key={i} className="suggestion-chip" onClick={() => { setInput(s); }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="disclaimer">⚠️ رد آلي — ليس مصدراً للفتوى الشرعية</div>

            {/* Input */}
            <form className="chat-input-area" onSubmit={handleSend}>
              <input
                className="chat-input"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="اكتب سؤالك هنا..."
                dir="rtl"
              />
              <button className="send-btn" type="submit" disabled={loading || !input.trim()} aria-label="إرسال">
                ➤
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatWidget;
