import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import ArticleCard from '../components/ArticleCard';

const Search = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setAiResult(null);
        setAiError('');
        if (!query) return;
        const res = await axios.get(`/api/articles/search?q=${encodeURIComponent(query)}`);
        setArticles(res.data);
      } catch (error) {
        console.error('Error searching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  const handleAiSearch = async () => {
    if (!query) return;
    setAiLoading(true);
    setAiError('');
    setAiResult(null);
    try {
      const res = await axios.post('/api/ai/smart-search', { query });
      setAiResult(res.data);
    } catch (err) {
      setAiError('تعذّر الاتصال بالمساعد الذكي، تأكد من تشغيل السيرفر.');
    } finally {
      setAiLoading(false);
    }
  };

  const confidenceColor = { 'عالي': '#10b981', 'متوسط': '#f59e0b', 'منخفض': '#ef4444' };

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center', color: 'var(--primary-color)', fontSize: 'clamp(1.3rem, 4vw, 2rem)' }}>
        🔍 نتائج البحث عن: &quot;{query}&quot;
      </h2>

      {/* AI Smart Search CTA */}
      {query && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(13,148,136,0.08), rgba(99,102,241,0.08))',
          border: '1px solid rgba(13,148,136,0.2)',
          borderRadius: '1.25rem',
          padding: '1.5rem 2rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.3rem' }}>✨</span>
              <strong style={{ color: 'var(--primary-color)', fontSize: '1rem' }}>المساعد الإسلامي الذكي</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              يبحث داخل مقالات وفتاوى الموقع ويقدم لك إجابة ملخصة مع مصادر
            </p>
          </div>
          <button
            onClick={handleAiSearch}
            disabled={aiLoading}
            style={{
              background: aiLoading ? 'var(--text-muted)' : 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.75rem 1.5rem',
              fontWeight: 'bold',
              cursor: aiLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {aiLoading ? '⏳ جاري التحليل...' : '🤖 اسأل المساعد الذكي'}
          </button>
        </div>
      )}

      {/* AI loading */}
      {aiLoading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🧠</div>
          <p>المساعد يبحث في محتوى الموقع...<br /><small>يقرأ المقالات والفتاوى ويحلّلها</small></p>
        </div>
      )}

      {/* AI error */}
      {aiError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.75rem', padding: '1rem 1.5rem', marginBottom: '2rem', color: '#ef4444' }}>
          ⚠️ {aiError}
        </div>
      )}

      {/* AI Result Card */}
      {aiResult && (
        <div className="card fade-up" style={{
          marginBottom: '2.5rem',
          border: '1px solid rgba(13,148,136,0.3)',
          borderRight: '5px solid var(--primary-color)',
          padding: '1.75rem',
          background: 'var(--surface-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.5rem' }}>🤖</span>
            <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.1rem' }}>
              إجابة المساعد الإسلامي الذكي
            </h3>
            {aiResult.confidence && (
              <span style={{
                marginRight: 'auto', fontSize: '0.75rem', fontWeight: 'bold',
                color: confidenceColor[aiResult.confidence] || '#f59e0b',
                background: `${confidenceColor[aiResult.confidence]}20`,
                padding: '0.2rem 0.75rem', borderRadius: '2rem'
              }}>
                دقة: {aiResult.confidence}
              </span>
            )}
          </div>

          <p style={{ lineHeight: '1.9', color: 'var(--text-primary)', fontSize: '1rem', margin: '0 0 1.5rem 0' }}>
            {aiResult.answer}
          </p>

          {aiResult.sources && aiResult.sources.length > 0 && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>📚 المصادر في الموقع:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {aiResult.sources.map((src, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', background: 'var(--bg-color)', borderRadius: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem' }}>{src.type === 'فتوى' ? '⚖️' : '📝'}</span>
                    {src.link && src.link !== 'null' ? (
                      <Link to={src.link} style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.9rem', textDecoration: 'none' }}>
                        {src.title} ←
                      </Link>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{src.title}</span>
                    )}
                    <span style={{ marginRight: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--border-color)', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>{src.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', marginBottom: 0 }}>
            ⚠️ هذه إجابة ذكاء اصطناعي مستندة لمحتوى الموقع — للفتاوى المهمة يُرجى الرجوع لأهل العلم.
          </p>
        </div>
      )}

      {/* Regular Results */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>📋 نتائج المقالات</h3>
        {articles.length > 0 && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{articles.length} نتيجة</span>}
      </div>

      {loading ? (
        <Loader message={`جاري البحث عن "${query}"...`} fullPage={false} />
      ) : articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>لم نجد أي مقالات تطابق بحثك.</p>
          <p style={{ fontSize: '0.9rem' }}>جرّب المساعد الذكي أعلاه للحصول على إجابة مباشرة!</p>
        </div>
      ) : (
        <div className="search-results-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2.5rem'
        }}>
          <style>{`
            @media (max-width: 640px) {
              .search-results-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
            }
          `}</style>
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
