import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import ReadingProgress from '../components/ReadingProgress';
import StarRating from '../components/StarRating';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css'; // Important for displaying Quill HTML correctly

const ArticleDetails = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(1.15); 
  const API_BASE = import.meta.env.VITE_API_URL || '';

  const fetchRelated = async (category, currentId) => {
    if (category) {
      try {
        const relRes = await axios.get(`/api/articles?category=${category}`);
        setRelated(relRes.data.filter(a => a._id !== currentId).slice(0, 3));
      } catch (e) { console.error('Error fetching related:', e); }
    }
  };

  // Helper: Update/create a meta tag dynamically
  const setMeta = (attr, value, content) => {
    let el = document.querySelector(`meta[${attr}="${value}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, value);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const updateMetaTags = (art) => {
    const title = `${art.title} | منصة إسلامي`;
    const desc = art.content.replace(/<[^>]*>/g, '').slice(0, 160) + '...';
    const imageUrl = art.imageUrl?.startsWith('http') ? art.imageUrl : (art.imageUrl ? `${window.location.origin}${art.imageUrl}` : '');
    const url = `${window.location.origin}/article/${art.slug}`;

    document.title = title;

    // Standard
    setMeta('name', 'description', desc);

    // Open Graph (WhatsApp / Facebook / Telegram)
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:locale', 'ar_AR');

    // Twitter / X Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', imageUrl);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        
        // 1. Try to get SSR data first (High Performance Hydration)
        const ssrScript = document.getElementById('ssr-data');
        if (ssrScript) {
          try {
            const data = JSON.parse(ssrScript.textContent);
            if (data && data.slug === slug) {
              setArticle(data);
              setLoading(false);
              updateMetaTags(data);
              // Clean up to ensure fresh data on internal navigation
              ssrScript.remove(); 
              fetchRelated(data.category, data._id);
              document.title = `${data.title} | منصة إسلامي`;
              return; // Exit, no need to fetch!
            }
          } catch (e) { console.error('SSR Hydration Error:', e); }
          ssrScript.remove();
        }

        // 2. Fallback to API if no SSR data or slug mismatch
        const res = await axios.get(`/api/articles/slug/${slug}`);
        setArticle(res.data);
        
        // Update SEO title + all OG meta tags for SPA navigation
        updateMetaTags(res.data);
        
        // Increment views
        const viewedKey = `viewed_${res.data._id}`;
        if (!sessionStorage.getItem(viewedKey)) {
          axios.post(`/api/articles/${res.data._id}/view`).catch(() => {});
          sessionStorage.setItem(viewedKey, '1');
        }
        
        // Fetch related articles
        fetchRelated(res.data.category, res.data._id);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = 'إسلامي | منصة إسلامية متكاملة';
    };
  }, [slug]);

  const changeFontSize = (delta) => {
    setFontSize(prev => Math.min(Math.max(prev + delta, 0.9), 2.5));
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `اقرأ هذا المقال الشيق: ${article.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('متصفحك لا يدعم المشاركة المباشرة. يمكنك نسخ الرابط من المتصفح.');
    }
  };

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (article) {
      const favs = JSON.parse(localStorage.getItem('fav_articles')) || [];
      setIsFav(favs.includes(article._id));
    }
  }, [article]);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem('fav_articles')) || [];
    let newFavs;
    if (favs.includes(article._id)) {
      newFavs = favs.filter(f => f !== article._id);
      setIsFav(false);
    } else {
      newFavs = [...favs, article._id];
      setIsFav(true);
    }
    localStorage.setItem('fav_articles', JSON.stringify(newFavs));
  };

  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const words = cleanText.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  if (loading) return <Loader message="جاري تجهيز المقال..." />;
  if (!article) return <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center', fontSize: '1.25rem' }}>المقال غير موجود.</div>;

  const currentUrl = window.location.href;
  const shareText = encodeURIComponent(`اقرأ هذا المقال: ${article.title}`);


  return (
    <article style={{ direction: 'rtl', textAlign: 'right', paddingBottom: '4rem', width: '100%', overflowX: 'hidden' }}>
      <ReadingProgress />

       {/* Hero Header Section */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '6rem 1rem',
        overflow: 'hidden',
        minHeight: '350px'
      }}>
        {/* Dynamic Background: Image blurred or Royal Gradient */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: article.imageUrl 
            ? `url("${article.imageUrl.startsWith('http') ? article.imageUrl : API_BASE + article.imageUrl}") center/cover no-repeat` 
            : 'linear-gradient(135deg, #0d9488 0%, #115e59 50%, #064e3b 100%)',
          filter: article.imageUrl ? 'blur(10px) brightness(0.35)' : 'none',
          transform: article.imageUrl ? 'scale(1.1)' : 'none',
          zIndex: 1
        }}></div>

        {/* Textured Overlay for more "Royal" feel */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          zIndex: 2 
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '850px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.45rem 1.75rem', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)' }}>
            {article.category}
          </span>
          
          <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', color: 'white', lineHeight: '1.3', fontFamily: 'var(--font-heading)', textShadow: '0 4px 20px rgba(0,0,0,0.5)', marginBottom: '2.5rem', fontWeight: '800' }}>
            {article.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'rgba(255,255,255,0.9)', fontSize: '1rem', flexWrap: 'wrap', justifyContent: 'center', fontWeight: '500' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', direction: 'rtl' }}>
              <span>تاريخ النشر:</span>
              <span style={{ fontWeight: 'bold' }}>{new Date(article.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
            </div>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', opacity: 0.8 }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', direction: 'rtl' }}>
              <span style={{ fontSize: '1.3rem' }}>⏱️</span>
              {calculateReadTime(article.content)} دقيقة قراءة
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="container article-layout-container">
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Interaction Bar */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          {/* Share & Favorite Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button onClick={toggleFavorite} className="btn" style={{ padding: '0.6rem 1.25rem', background: isFav ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface-color)', border: '1px solid var(--border-color)', color: isFav ? '#ef4444' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
              <span>{isFav ? '❤️' : '🤍'}</span> {isFav ? 'مفضلة' : 'حفظ'}
            </button>
            <a href={`https://wa.me/?text=${shareText}%20${currentUrl}`} target="_blank" rel="noreferrer" className="btn" style={{ padding: '0.6rem 1.25rem', background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', border: '1px solid currentColor', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              <span style={{ fontSize: '1.1rem' }}>💬</span> واتساب
            </a>
            {navigator.share && (
              <button onClick={handleNativeShare} className="btn" style={{ padding: '0.6rem 1.25rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <span>📤</span> مشاركة
              </button>
            )}
          </div>

          {/* Accessibility Controls */}
          <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '2rem', display: 'flex', alignItems: 'center', padding: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <button onClick={() => changeFontSize(0.15)} style={{ background: 'none', border: 'none', padding: '6px 16px', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold' }} title="تكبير الخط">A+</button>
            <span style={{ borderLeft: '1px solid var(--border-color)', height: '20px' }}></span>
            <button onClick={() => changeFontSize(-0.15)} style={{ background: 'none', border: 'none', padding: '6px 16px', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold' }} title="تصغير الخط">A-</button>
          </div>
        </div>

        {article.imageUrl && (
          <img src={article.imageUrl.startsWith('http') ? article.imageUrl : `${API_BASE}${article.imageUrl}`} alt={article.title} loading="lazy" style={{ width: '100%', height: 'auto', borderRadius: '1.25rem', marginBottom: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
        )}

        {/* Article Body */}
        <div 
          className="article-body ql-editor ql-snow"
          style={{ 
            fontSize: `${fontSize}rem`, 
            lineHeight: '2.2', 
            color: 'var(--text-primary)',
            direction: 'rtl',
            textAlign: 'right',
            padding: 0
          }} 
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content, { ADD_ATTR: ['target'] }) }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }} className="no-print">
            {article.tags.map(tag => (
               <Link key={tag} to={`/search?q=${tag}`} style={{ backgroundColor: 'var(--surface-color)', color: 'var(--primary-color)', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '1rem', textDecoration: 'none', border: '1px solid var(--primary-color)', transition: '0.2s', fontWeight: 'bold' }}>
                 #{tag}
               </Link>
            ))}
          </div>
        )}

        {/* Post-Article Info */}
        {/* Post-Article Info */}
        <div className="no-print" style={{ marginTop: '3rem', padding: '2rem', backgroundColor: 'var(--surface-color)', borderRadius: '1.25rem', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
          {/* Star Rating */}
          <StarRating articleId={article._id} />
        </div>
        </div> {/* End Main Content Area */}

        <aside className="no-print sidebar-sticky">
          {/* Related Articles Section */}
          {related.length > 0 && (
            <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '2rem', borderRight: '4px solid var(--primary-color)', paddingRight: '1rem', fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-primary)' }}>اقرأ أيضاً</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 {related.map(rel => (
                   <Link key={rel._id} className="card-hover-effect" to={`/article/${rel.slug || rel._id}`} style={{ textDecoration: 'none', padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                      {rel.imageUrl ? (
                        <img src={rel.imageUrl.startsWith('http') ? rel.imageUrl : `${API_BASE}${rel.imageUrl}`} alt={rel.title} loading="lazy" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '0.75rem', marginBottom: '1rem' }} />
                      ) : (
                        <div style={{ width: '100%', height: '140px', background: 'linear-gradient(135deg, var(--surface-color), var(--border-color))', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>🕌</div>
                      )}
                      <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.5', fontFamily: 'var(--font-heading)', fontWeight: 'bold' }}>{rel.title}</h4>
                   </Link>
                 ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <style>{`
        .article-layout-container {
           max-width: 1200px;
           margin: 0 auto;
           padding: 2rem 1rem;
           display: grid;
           grid-template-columns: 1fr;
           gap: 3rem;
           align-items: start;
        }
        @media (min-width: 992px) {
           .article-layout-container {
              grid-template-columns: 1fr 340px; /* Right column is Main Content, Left is Sidebar due to RTL */
           }
        }
        .sidebar-sticky {
           position: sticky;
           top: 100px;
           z-index: 10;
        }
        .card-hover-effect {
           transition: transform 0.2s, box-shadow 0.2s;
        }
        .card-hover-effect:hover {
           transform: translateY(-5px);
           box-shadow: 0 10px 25px rgba(0,0,0,0.1);
           border-color: var(--primary-color) !important;
        }
        /* Standardizing fonts with CSS variables */
        .article-body {
           font-family: var(--font-family);
           text-align: right;
           line-height: 1.8;
        }
        .article-body h1, .article-body h2, .article-body h3 {
          color: var(--primary-color);
          font-family: var(--font-heading);
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }
        
        .article-body p {
          margin-bottom: 1.5rem;
        }
        
        .article-body blockquote {
          border-right: 5px solid var(--accent-color);
          border-left: none;
          padding-right: 1.5rem;
          padding-left: 0;
          margin: 2rem 0;
          font-style: italic;
          color: var(--text-secondary);
          background-color: var(--surface-color);
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .article-body img {
          max-width: 100%;
          border-radius: 1rem;
          margin: 2rem 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .article-body a {
          color: var(--primary-color);
          text-decoration: underline;
        }
        
        .article-body ul, .article-body ol {
          padding-right: 0;
          margin-bottom: 2rem;
          list-style: none; /* Hide default black dots */
        }
        
        .article-body li {
          margin-bottom: 0.75rem;
          position: relative;
          padding-right: 1.75rem;
        }

        .article-body ul li::before {
          content: "✦"; /* Elegant Islamic-star-like bullet */
          position: absolute;
          right: 0;
          color: var(--primary-color);
          font-size: 0.8rem;
          top: 0.2rem;
        }

        .article-body ol {
          counter-reset: article-counter;
        }

        .article-body ol li {
          counter-increment: article-counter;
        }

        .article-body ol li::before {
          content: counter(article-counter) ".";
          position: absolute;
          right: 0;
          color: var(--primary-color);
          font-weight: bold;
          font-size: 0.9rem;
        }

        .article-body .ql-align-center { text-align: center !important; }
        .article-body .ql-align-left { text-align: left !important; }
        .article-body .ql-align-right { text-align: right !important; }
        .article-body .ql-align-justify { text-align: justify !important; }

        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; padding: 1cm !important; }
          .container { width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .article-body { font-size: 14pt !important; text-align: justify !important; }
        }
      `}</style>
    </article>
  );
};

export default ArticleDetails;
