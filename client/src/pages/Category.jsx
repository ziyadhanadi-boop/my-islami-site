import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import ArticleCard from '../components/ArticleCard';

const Category = () => {
  const { categoryName } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/api/articles?t=' + Date.now());
        const filtered = res.data.filter(a => a.category === categoryName);
        setArticles(filtered);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [categoryName]);

  if (loading) return <Loader message={`جاري تحميل مقالات قسم ${categoryName}...`} />;

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <h2 style={{ marginBottom: '2.5rem', textAlign: 'center', color: 'var(--secondary-color)', fontSize: '2.5rem' }}>
        قسم: {categoryName}
      </h2>
      {articles.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.125rem' }}>لا توجد مقالات في هذا القسم حالياً.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
