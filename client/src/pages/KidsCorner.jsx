import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const categories = [
  { id: 'wudu', title: 'كيف أتوضأ؟', subtitle: 'خطوات الوضوء السهلة', emoji: '💧', bg: '#dcfce7', border: '#86efac', text: '#166534', subtext: '#15803d' },
  { id: 'salah', title: 'كيف أصلي؟', subtitle: 'هيا نتعلم الحركات معاً', emoji: '🕌', bg: '#dbeafe', border: '#93c5fd', text: '#1e3a8a', subtext: '#1d4ed8' },
  { id: 'adhkar', title: 'أذكاري الجميلة', subtitle: 'ماذا أقول كل يوم؟', emoji: '⭐', bg: '#fef3c7', border: '#fde047', text: '#92400e', subtext: '#b45309' },
  { id: 'stories', title: 'قصص الأنبياء', subtitle: 'حكايات رائعة قبل النوم', emoji: '📖', bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d', subtext: '#be185d' }
];

const KidsCorner = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchKidsContent = async () => {
      try {
        const res = await axios.get('/api/kidContent?t=' + Date.now());
        setItems(res.data);
      } catch (error) {
        console.error('Error fetching kids content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchKidsContent();
  }, []);

  if (loading) return <Loader message="جاري تجهيز الألعاب والدروس... 🧸" />;

  const renderActiveCategory = () => {
    const categoryInfo = categories.find(c => c.id === activeCategory);
    const categoryItems = items.filter(item => item.category === activeCategory).sort((a,b) => a.orderIndex - b.orderIndex);

    return (
      <div className="fade-up">
        <button 
          onClick={() => setActiveCategory(null)} 
          className="btn" 
          style={{ marginBottom: '2rem', padding: '0.75rem 1.5rem', background: '#e2e8f0', color: '#1e293b', borderRadius: '1rem', fontWeight: 'bold' }}
        >
          ⬅️ العودة للرئيسية
        </button>

        <div style={{ background: categoryInfo.bg, borderColor: categoryInfo.border, padding: '2rem', textAlign: 'center', borderRadius: '1.5rem', marginBottom: '3rem', border: '3px solid' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{categoryInfo.emoji}</div>
          <h2 style={{ color: categoryInfo.text, fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>{categoryInfo.title}</h2>
          <p style={{ color: categoryInfo.subtext, fontSize: '1.2rem', fontWeight: 'bold' }}>{categoryInfo.subtitle}</p>
        </div>

        {categoryItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '3rem' }}>🏃</span>
            <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>سنقوم بإضافة الدروس هنا قريباً جداً!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {categoryItems.map((item, index) => (
              <div key={item._id} className="card" style={{ padding: '0', overflow: 'hidden', border: `3px solid ${categoryInfo.border}`, borderRadius: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                {item.contentType === 'image' && item.coverImage && (
                  <img src={item.coverImage} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                )}
                {item.contentType === 'video' && item.coverImage && (
                  <iframe width="100%" height="220" src={item.coverImage} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                )}
                <div style={{ padding: '1.5rem', flexGrow: 1, backgroundColor: 'var(--surface-color)' }}>
                  <h3 style={{ fontSize: '1.3rem', color: categoryInfo.text, marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ backgroundColor: categoryInfo.bg, padding: '0.2rem 0.8rem', borderRadius: '50%', color: categoryInfo.subtext }}>{index + 1}</span>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                    {item.contentBody}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #fef08a, #fca5a5)', padding: '3rem 1rem', borderRadius: '2rem', textAlign: 'center', marginBottom: '4rem', boxShadow: '0 10px 25px rgba(252,165,165,0.3)' }}>
        <h1 style={{ color: '#b91c1c', fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>🎈 ركن المسلم الصغير 🧸</h1>
        <p style={{ color: '#991b1b', fontSize: 'clamp(1rem, 3vw, 1.3rem)', fontWeight: 'bold' }}>تعلم أساسيات دينك بمرح وسهولة!</p>
      </div>

      {!activeCategory ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
          {categories.map((cat) => (
            <div 
              key={cat.id}
              className="card" 
              onClick={() => setActiveCategory(cat.id)}
              style={{ 
                background: cat.bg, 
                border: `4px solid ${cat.border}`, 
                padding: '3rem 1.5rem', 
                textAlign: 'center', 
                borderRadius: '2rem', 
                cursor: 'pointer', 
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: `0 10px 20px ${cat.border}40`
              }} 
              onMouseOver={e => { e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.boxShadow=`0 15px 30px ${cat.border}80`; }} 
              onMouseOut={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow=`0 10px 20px ${cat.border}40`; }}
            >
              <div style={{ fontSize: '5rem', marginBottom: '1.5rem', animation: 'bounce 2s infinite' }}>{cat.emoji}</div>
              <h2 style={{ color: cat.text, fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>{cat.title}</h2>
              <p style={{ color: cat.subtext, fontSize: '1.1rem', fontWeight: 'bold' }}>{cat.subtitle}</p>
            </div>
          ))}
        </div>
      ) : (
        renderActiveCategory()
      )}

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-15px); }
          60% { transform: translateY(-7px); }
        }
      `}</style>
    </div>
  );
};

export default KidsCorner;
