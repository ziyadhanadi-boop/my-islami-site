import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const Favorites = () => {
  const [favoriteIds, setFavoriteIds] = useState(JSON.parse(localStorage.getItem('fav_articles')) || []);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/articles');
        const favs = res.data.filter(a => favoriteIds.includes(a._id));
        setArticles(favs);
      } catch (error) {
        console.error('Error fetching favorites', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [favoriteIds]);

  const toggleFav = (id) => {
    const newFavs = favoriteIds.filter(fid => fid !== id);
    setFavoriteIds(newFavs);
    localStorage.setItem('fav_articles', JSON.stringify(newFavs));
  };

  if (loading) return <Loader message="جاري جلب مقالاتك المفضلة..." />;

  const API_BASE = import.meta.env.VITE_API_URL || '';

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>❤️ مقالاتي المفضلة</h1>
        <p style={{ color: 'var(--text-secondary)' }}>جميع الموضوعات التي قمت بحفظها للرجوع إليها لاحقاً</p>
      </header>

      {articles.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {articles.map(article => (
            <div key={article._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.25rem' }}>
              {article.imageUrl && (
                <Link to={`/article/${article._id}`}>
                  <img src={`${API_BASE}${article.imageUrl}`} alt={article.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '0.75rem', marginBottom: '1.25rem' }} />
                </Link>
              )}
              <div style={{ flex: 1 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>{article.category}</span>
                    <button onClick={() => toggleFav(article._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }} title="إزالة من المفضلة">❌</button>
                 </div>
                 <Link to={`/article/${article._id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '1rem', lineHeight: '1.4' }}>{article.title}</h3>
                 </Link>
              </div>
              <footer style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(article.createdAt).toLocaleDateString('ar-EG')}</span>
                 <Link to={`/article/${article._id}`} style={{ fontWeight: 'bold' }}>اقرأ المزيد &larr;</Link>
              </footer>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
           <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📑</div>
           <p style={{ fontSize: '1.25rem' }}>لم تقم بحفظ أي مقالات بعد. ابدأ رحلتك في القراءة واحفظ ما يعجبك!</p>
           <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>تصفح المقالات ورؤية الجديد</Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
