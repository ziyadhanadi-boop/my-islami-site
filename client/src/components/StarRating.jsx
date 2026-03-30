import React, { useState } from 'react';
import axios from 'axios';

const StarRating = ({ articleId }) => {
  const ratedKey = `rated_${articleId}`;
  const [rated, setRated] = useState(!!localStorage.getItem(ratedKey));
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(parseInt(localStorage.getItem(ratedKey)) || 0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRate = async (stars) => {
    if (rated || loading) return;
    setLoading(true);
    setSelected(stars);
    try {
      const res = await axios.post(`/api/articles/${articleId}/rate`, { stars });
      localStorage.setItem(ratedKey, stars);
      setRated(true);
      setResult(res.data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem', marginTop: '1rem' }}>
      <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
        {rated ? '✅ شكراً على تقييمك!' : '✨ كيف تقيّم هذا المقال؟'}
      </h4>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', direction: 'ltr' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !rated && setHover(star)}
            onMouseLeave={() => setHover(0)}
            disabled={rated || loading}
            style={{
              fontSize: '2rem',
              background: 'none',
              border: 'none',
              cursor: rated ? 'default' : 'pointer',
              color: star <= (hover || selected) ? '#f59e0b' : 'var(--border-color)',
              transition: 'transform 0.15s, color 0.15s',
              transform: !rated && hover === star ? 'scale(1.3)' : 'scale(1)'
            }}
          >★</button>
        ))}
      </div>
      {result && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          متوسط التقييم: ⭐ {result.avg} من أصل {result.count} تقييم
        </p>
      )}
    </div>
  );
};

export default StarRating;
