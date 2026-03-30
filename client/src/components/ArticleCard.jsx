import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  const imageUrl = article.imageUrl
    ? (article.imageUrl.startsWith('http') ? article.imageUrl : `${API_BASE}${article.imageUrl}`)
    : `https://source.unsplash.com/featured/?islamic,mosque,${article.category}`;

  const dateStr = new Date(article.createdAt).toLocaleDateString('ar-EG', {
    day: 'numeric', month: 'numeric', year: 'numeric'
  });

  return (
    <div
      className="card card-hover-effect"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        borderRadius: '1rem',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--surface-color)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
    >
      {/* Featured Badge */}
      {article.isFeatured && (
        <div style={{
          position: 'absolute', top: '0.6rem', right: '0.6rem',
          backgroundColor: 'var(--accent-color)', color: 'white',
          padding: '0.2rem 0.65rem', borderRadius: '2rem',
          fontSize: '0.7rem', fontWeight: 'bold', zIndex: 5,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}>
          ✨ مميز
        </div>
      )}

      {/* Image */}
      <div style={{ overflow: 'hidden', height: '140px', position: 'relative', flexShrink: 0 }}>
        <img
          src={imageUrl}
          alt={article.title}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="card-image"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)',
          zIndex: 1
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: '0.9rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

        {/* Category + Date row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            color: 'var(--primary-color)', fontSize: '0.7rem', fontWeight: 'bold',
            backgroundColor: 'rgba(13,148,136,0.08)', padding: '0.15rem 0.55rem',
            borderRadius: '2rem', border: '1px solid rgba(13,148,136,0.12)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '65%'
          }}>
            {article.category}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>
            {dateStr}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          margin: 0,
          fontSize: '0.95rem',
          lineHeight: '1.45',
          fontFamily: 'var(--font-heading)',
          color: 'var(--text-primary)',
          fontWeight: '700',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flexGrow: 1,
        }}>
          {article.title}
        </h3>

        {/* Read more link */}
        <Link
          to={`/article/${article.slug || article._id}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--primary-color)',
            fontWeight: 'bold',
            border: '1px solid var(--border-color)',
            textDecoration: 'none',
            fontSize: '0.8rem',
            transition: 'all 0.2s',
            marginTop: 'auto',
          }}
          className="card-link-btn"
        >
          اقرأ المزيد <span>←</span>
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
