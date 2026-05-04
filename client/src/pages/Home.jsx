import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import ArticleCard from '../components/ArticleCard';
import PrayerTimesComponent from '../components/PrayerTimes';
import HijriDate from '../components/HijriDate';
import { AudioContext } from '../context/AudioContext';
import LiveKhatmahWidget from '../components/LiveKhatmahWidget';
import DeenPlannerWidget from '../components/DeenPlannerWidget';
import Azkar from '../components/Azkar';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [mostRead, setMostRead] = useState([]);
  const [fatwas, setFatwas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articlesError, setArticlesError] = useState(null);
  const [salatCount, setSalatCount] = useState(parseInt(localStorage.getItem('salat_count')) || 0);
  const [khatmah, setKhatmah] = useState(JSON.parse(localStorage.getItem('khatmah_progress')) || null);
  const { playTrack, currentTrack, isPlaying } = useContext(AudioContext);
  const radioUrl = "https://qurango.net/radio/mix";
  const sectionRefs = React.useRef({}); // Map of category-name -> DOM el
  const carouselRef = React.useRef(null); // for مقالات متنوعة section

  // Helper: arrow button style - Professional Glassmorphism Design
  const arrowBtn = (side) => ({
    position: 'absolute', top: '50.1%',
    [side]: '-22px',
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: '46px', height: '46px', borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(13, 148, 136, 0.95)', // var(--primary-color) with opacity
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontSize: '1.4rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
  });

  const onArrowHoverIn = e => { 
    e.currentTarget.style.background = 'var(--primary-dark)'; 
    e.currentTarget.style.transform = 'translateY(-50%) scale(1.15)';
    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.25)';
  };
  const onArrowHoverOut = e => { 
    e.currentTarget.style.background = 'rgba(13, 148, 136, 0.95)'; 
    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)';
  };

  // trackStyle for every carousel
  const CARD_W = 'min(220px, 80vw)';
  const trackStyle = {
    display: 'flex', gap: '1rem',
    overflowX: 'auto', scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
    padding: '0.5rem 0.25rem 0.75rem',
    cursor: 'grab', scrollbarWidth: 'none', msOverflowStyle: 'none',
  };

  const [dailyHadith, setDailyHadith] = useState({ text: "«من دل على خير فله مثل أجر فاعله»", source: "رواه مسلم" });
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('/api/articles?t=' + Date.now());
        const all = res.data;
        const visible = all.filter(a => !a.isHidden);
        setFeatured(visible.filter(a => a.isFeatured));
        setArticles(visible);
        // fetch most read
        const mrRes = await axios.get('/api/articles/most-read');
        setMostRead(mrRes.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setArticlesError('عذراً، فشل الاتصال بالسيرفر. يرجى التأكد من تشغيل السيرفر.');
      }
    };

    const fetchFatwas = async () => {
      try {
        const res = await axios.get('/api/fatwaArchive');
        setFatwas(res.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching fatwas:', error);
      }
    };

    const fetchRandomHadith = async () => {
      try {
        const res = await axios.get('/api/hadith/random');
        if (res.data) setDailyHadith(res.data);
      } catch (error) {
        console.error('Error fetching random hadith:', error);
      }
    };

    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchArticles(), fetchFatwas(), fetchRandomHadith()]);
      setLoading(false);
    };
    loadAll();

    // Dynamic greeting calculation
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('صباح يتنفس بذكر الله 🌤️');
    else if (hour >= 12 && hour < 15) setGreeting('طاب نهارك بطاعة الرحمن ☀️');
    else if (hour >= 15 && hour < 18) setGreeting('مساء السكينة والطمأنينة 🌅');
    else setGreeting('ليلة تحفها رحمات الله 🌙');
  }, []);

  const handleSalat = () => {
    const newCount = salatCount + 1;
    setSalatCount(newCount);
    localStorage.setItem('salat_count', newCount);
    if (window.navigator.vibrate) window.navigator.vibrate(30);
  };

  if (loading) return <Loader message="جاري تحميل المحتوى..." />;

  const renderMostRead = (className) => (
    mostRead.length > 0 && (
      <div className={`card ${className}`} style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
        <h4 style={{ marginBottom: '1.25rem', color: 'var(--primary-color)', fontSize: '1.1rem', borderRight: '4px solid var(--primary-color)', paddingRight: '0.75rem' }}>🔥 الأكثر قراءة</h4>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {mostRead.map((art, i) => (
            <li key={art._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : 'var(--text-muted)', lineHeight: 1, flexShrink: 0 }}>{i + 1}</span>
              <Link to={`/article/${art.slug || art._id}`} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.4', fontWeight: '500' }}>
                {art.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    )
  );

  const renderCategorySection = (title, emoji, categoryName) => {
    const categoryArticles = articles.filter(a => a.category === categoryName);
    if (categoryArticles.length === 0) return null;

    const scrollLeft = () => sectionRefs.current[categoryName]?.scrollBy({ left: -240, behavior: 'smooth' });
    const scrollRight = () => sectionRefs.current[categoryName]?.scrollBy({ left: 240, behavior: 'smooth' });

    return (
      <div key={categoryName} style={{ marginBottom: '0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--primary-color)' }}>{title}</h2>
          <div style={{ flexGrow: 1 }} />
          <Link to={`/category/${categoryName}`} style={{ fontSize: '0.9rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold', whiteSpace: 'nowrap' }}>عرض الكل ←</Link>
        </div>

        {/* Carousel */}
        <div style={{ position: 'relative' }}>
          {/* RTL: Next is on the Left (end of stream), Prev is on the Right (start of stream) */}
          <button 
            className="carousel-arrow" 
            style={arrowBtn('right')} 
            onMouseEnter={onArrowHoverIn} 
            onMouseLeave={onArrowHoverOut} 
            onClick={scrollRight}
            aria-label="السابق"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>
          
          <button 
            className="carousel-arrow" 
            style={arrowBtn('left')} 
            onMouseEnter={onArrowHoverIn} 
            onMouseLeave={onArrowHoverOut} 
            onClick={scrollLeft}
            aria-label="التالي"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          <div style={{ overflow: 'hidden' }}>
            <div
              className="articles-carousel"
              ref={el => { sectionRefs.current[categoryName] = el; }}
              style={trackStyle}
              onMouseDown={e => { const el = sectionRefs.current[categoryName]; if (!el) return; el.isDragging = true; el.startX = e.pageX - el.offsetLeft; el.scrollLeftStart = el.scrollLeft; el.style.cursor = 'grabbing'; }}
              onMouseMove={e => { const el = sectionRefs.current[categoryName]; if (!el || !el.isDragging) return; e.preventDefault(); el.scrollLeft = el.scrollLeftStart - (e.pageX - el.offsetLeft - el.startX); }}
              onMouseUp={e => { const el = sectionRefs.current[categoryName]; if (el) { el.isDragging = false; el.style.cursor = 'grab'; } }}
              onMouseLeave={e => { const el = sectionRefs.current[categoryName]; if (el) { el.isDragging = false; el.style.cursor = 'grab'; } }}
            >
              {categoryArticles.map((article) => (
                <div key={article._id} style={{ minWidth: CARD_W, maxWidth: CARD_W, scrollSnapAlign: 'start', flexShrink: 0 }}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ padding: '1.5rem 1rem' }}>

      {/* Grand Hero Section */}
      <div className="fade-up hero-responsive" style={{
        position: 'relative',
        borderRadius: '2rem',
        marginBottom: '2rem',
        overflow: 'hidden',
        minHeight: '360px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        backgroundColor: 'var(--primary-deep)', /* Deep fallback */
        padding: '2rem 0'
      }}>
        <style>{`
          @media (max-width: 768px) {
            .hero-responsive { min-height: 260px !important; margin-bottom: 1.5rem !important; }
            .hero-content { padding: 1.5rem 1rem !important; }
            .hero-title { font-size: 1.8rem !important; margin-bottom: 0.75rem !important; }
            .hero-p { font-size: 0.95rem !important; margin-bottom: 1.5rem !important; }
            .hero-btns { gap: 1rem !important; }
            .hero-btn-main { padding: 0.75rem 1.5rem !important; fontSize: 1rem !important; }
          }
        `}</style>
        {/* Background Image with Parallax-like effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.28) contrast(1.1)', /* Much darker for contrast */
          zIndex: 1
        }}></div>

        {/* Geometric Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(13,148,136,0.4) 0%, rgba(19,78,74,0.6) 100%)',
          zIndex: 2
        }}></div>

        <div className="hero-content" style={{ position: 'relative', zIndex: 10, padding: '2.5rem 2rem', textAlign: 'center', maxWidth: '850px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'rgba(0,0,0,0.35)',
            padding: '0.5rem 1.5rem',
            borderRadius: '3rem',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white'
          }}>
            <span style={{ fontSize: '1.1rem' }}>✨</span> {greeting}
          </div>

          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 7vw, 3.2rem)', fontWeight: '800', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)', color: 'white', textShadow: '0 4px 20px rgba(0,0,0,0.8)', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
            نورٌ ومعرفة.. <br />في رحاب الشريعة
          </h1>
          <p className="hero-p" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', opacity: 0.9, maxWidth: '650px', margin: '0 auto 2rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
            دليلك الشامل للمقالات الإسلامية الموثوقة، أوقات الصلاة، وأذكار اليوم الموثقة.
          </p>

          <div className="hero-btns" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/zikr" className="btn btn-primary hero-btn-main" style={{ padding: '1rem 3rem', borderRadius: '3rem', fontSize: '1.15rem', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>📿</span> اذكر الله يذكرك
            </Link>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.85rem 2rem', borderRadius: '3rem', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <HijriDate variant="hero" />
            </div>
          </div>
        </div>
      </div>

      {/* 📿 Separate Azkar Sections Removed */}


      <style>{`
        @media (max-width: 1024px) {
          .main-grid-responsive { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .sidebar-stack { order: 2; border-top: 1px solid var(--border-color); padding-top: 2rem; }
          .articles-section { order: 1; }
        }
      `}</style>
      <div className="main-grid-responsive" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '1.5rem',
        alignItems: 'start',
        minWidth: 0
      }}>
        <div className="articles-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', minWidth: 0 }}>
          {/* Targeted Category Rows */}
          {renderCategorySection('قسم السيرة والتاريخ', '📜', 'السيرة والتاريخ')}
          {renderCategorySection('فقه العبادات والمعاملات', '⚖️', 'فقه الصلاة')}
          {renderCategorySection('علوم القرآن الكريم', '📖', 'علوم القرآن')}
          {renderCategorySection('العقيدة والتوحيد', '🕌', 'العقيدة والتوحيد')}
          {renderCategorySection('نماء وتزكية', '🌱', 'نماء وتزكية')}

          {/* Remaining Articles — Horizontal Carousel */}
          {articles.filter(a => !['السيرة والتاريخ', 'فقه الصلاة', 'علوم القرآن', 'العقيدة والتوحيد', 'نماء وتزكية'].includes(a.category)).length > 0 && (
            <>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', marginTop: '0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📚</span>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--primary-color)' }}>مقالات متنوعة</h2>
                <div style={{ flexGrow: 1 }} />
                <Link to="/search" style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none', whiteSpace: 'nowrap' }}>عرض الكل ←</Link>
              </div>

              {/* Carousel */}
              <div style={{ position: 'relative' }}>
                <button className="carousel-arrow" style={arrowBtn('right')} onMouseEnter={onArrowHoverIn} onMouseLeave={onArrowHoverOut}
                  onClick={() => carouselRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}>
                  <ChevronRight size={24} strokeWidth={2.5} />
                </button>
                <button className="carousel-arrow" style={arrowBtn('left')} onMouseEnter={onArrowHoverIn} onMouseLeave={onArrowHoverOut}
                  onClick={() => carouselRef.current?.scrollBy({ left: -240, behavior: 'smooth' })}>
                  <ChevronLeft size={24} strokeWidth={2.5} />
                </button>

                <div style={{ overflow: 'hidden' }}>
                  <div
                    ref={carouselRef}
                    className="articles-carousel"
                    style={trackStyle}
                    onMouseDown={e => { const el = carouselRef.current; if (!el) return; el.isDragging = true; el.startX = e.pageX - el.offsetLeft; el.scrollLeftStart = el.scrollLeft; el.style.cursor = 'grabbing'; }}
                    onMouseMove={e => { const el = carouselRef.current; if (!el || !el.isDragging) return; e.preventDefault(); el.scrollLeft = el.scrollLeftStart - (e.pageX - el.offsetLeft - el.startX); }}
                    onMouseUp={() => { const el = carouselRef.current; if (el) { el.isDragging = false; el.style.cursor = 'grab'; } }}
                    onMouseLeave={() => { const el = carouselRef.current; if (el) { el.isDragging = false; el.style.cursor = 'grab'; } }}
                  >
                    {articles
                      .filter(a => !['السيرة والتاريخ', 'فقه الصلاة', 'علوم القرآن', 'العقيدة والتوحيد', 'نماء وتزكية'].includes(a.category))
                      .map((article) => (
                        <div key={article._id} style={{ minWidth: CARD_W, maxWidth: CARD_W, scrollSnapAlign: 'start', flexShrink: 0 }}>
                          <ArticleCard article={article} />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>


          )}

          {articles.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--surface-color)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
              <p style={{ color: articlesError ? 'var(--danger-color)' : 'var(--text-muted)', fontSize: '1.125rem' }}>
                {articlesError ? articlesError : 'لا توجد مقالات حالياً.'}
              </p>
              {articlesError && (
                <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ marginTop: '1rem' }}>إعادة المحاولة 🔄</button>
              )}
            </div>
          )}

          {/* ═══ NEW SECTIONS SHOWCASE ═══ */}
          <div style={{ marginTop: '2rem' }}>
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🌟</span>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--primary-color)' }}>أقسام متميزة</h2>
            </div>

            <div className="sections-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>

              {/* 🤲 الأدعية */}
              <Link to="/duas" style={{ textDecoration: 'none' }}>
                <div style={{
                  borderRadius: '1.25rem', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
                  padding: '1.75rem 1.5rem', cursor: 'pointer',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  boxShadow: '0 4px 18px rgba(13,118,110,0.25)',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  position: 'relative', minHeight: '160px'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(13,118,110,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(13,118,110,0.25)'; }}>
                  <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🤲</div>
                  <div>
                    <h3 style={{ margin: '0 0 0.35rem', color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>مكتبة الأدعية</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.5 }}>أدعية مأثورة من القرآن والسنة لكل مناسبة</p>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>استكشف الأدعية</span><span>←</span>
                  </div>
                  {/* Decorative circle */}
                  <div style={{ position: 'absolute', left: '-20px', bottom: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                </div>
              </Link>

              {/* 📜 قصص الأنبياء */}
              <Link to="/prophet-stories" style={{ textDecoration: 'none' }}>
                <div style={{
                  borderRadius: '1.25rem', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
                  padding: '1.75rem 1.5rem', cursor: 'pointer',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  boxShadow: '0 4px 18px rgba(109,40,217,0.25)',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  position: 'relative', minHeight: '160px'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(109,40,217,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(109,40,217,0.25)'; }}>
                  <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>📜</div>
                  <div>
                    <h3 style={{ margin: '0 0 0.35rem', color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>قصص الأنبياء</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.5 }}>سير وقصص الأنبياء والمرسلين عليهم السلام</p>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>اقرأ القصص</span><span>←</span>
                  </div>
                  <div style={{ position: 'absolute', left: '-20px', bottom: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                </div>
              </Link>

              {/* 🌿 الطب النبوي */}
              <Link to="/tibb-nabawi" style={{ textDecoration: 'none' }}>
                <div style={{
                  borderRadius: '1.25rem', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #15803d 0%, #14532d 100%)',
                  padding: '1.75rem 1.5rem', cursor: 'pointer',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  boxShadow: '0 4px 18px rgba(21,128,61,0.25)',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  position: 'relative', minHeight: '160px'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(21,128,61,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(21,128,61,0.25)'; }}>
                  <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🌿</div>
                  <div>
                    <h3 style={{ margin: '0 0 0.35rem', color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>الطب النبوي</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.5 }}>أعشاب وأطعمة من هدي النبي ﷺ مع الدليل العلمي</p>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>اكتشف الطب النبوي</span><span>←</span>
                  </div>
                  <div style={{ position: 'absolute', left: '-20px', bottom: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                </div>
              </Link>

              {/* 🎙️ البودكاست */}
              <Link to="/podcast" style={{ textDecoration: 'none' }}>
                <div style={{
                  borderRadius: '1.25rem', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #3730a3 0%, #1e1b4b 100%)',
                  padding: '1.75rem 1.5rem', cursor: 'pointer',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  boxShadow: '0 4px 18px rgba(55,48,163,0.25)',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                  position: 'relative', minHeight: '160px'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(55,48,163,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(55,48,163,0.25)'; }}>
                  <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🎙️</div>
                  <div>
                    <h3 style={{ margin: '0 0 0.35rem', color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>البودكاست الإسلامي</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', lineHeight: 1.5 }}>محاضرات ودروس صوتية من أبرز العلماء</p>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem', fontWeight: 'bold' }}>
                    <span>استمع الآن</span><span>←</span>
                  </div>
                  <div style={{ position: 'absolute', left: '-20px', bottom: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                </div>
              </Link>

              {/* ⚖️ حلال أم حرام — Full Width */}
              <Link to="/halal-check" className="section-card-full" style={{ textDecoration: 'none', gridColumn: 'span 2' }}>
                <div style={{
                  borderRadius: '1.25rem', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)',
                  padding: '1.5rem 2rem', cursor: 'pointer',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                  boxShadow: '0 4px 18px rgba(12,74,110,0.25)',
                  display: 'flex', alignItems: 'center', gap: '1.5rem',
                  position: 'relative',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(12,74,110,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(12,74,110,0.25)'; }}>
                  <div style={{ fontSize: '3rem', lineHeight: 1, flexShrink: 0 }}>⚖️</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.35rem', color: 'white', fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>حلال أم حرام؟</h3>
                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.78)', fontSize: '0.88rem', lineHeight: 1.5 }}>اسأل عن حكم أي شيء — المساعد الذكي يقدم الحكم الشرعي مع دليله من القرآن والسنة</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.9)', fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 }}>
                    <span>ابدأ الاستفسار</span><span>←</span>
                  </div>
                  <div style={{ position: 'absolute', left: '-20px', bottom: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                </div>
              </Link>

            </div>
          </div>
          {/* ═══ END NEW SECTIONS ═══ */}

        </div>


        <aside className="sidebar-stack" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Featured Articles Sidebar Widget */}
          <div className="card fade-up" style={{ padding: '1.5rem', background: 'var(--surface-color)', borderRight: '5px solid var(--accent-color)' }}>
            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>✨</span> مقالات مميزة
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {featured
                .sort((a, b) => {
                  if (a.featuredPosition > 0 && b.featuredPosition > 0) return a.featuredPosition - b.featuredPosition;
                  if (a.featuredPosition > 0) return -1;
                  if (b.featuredPosition > 0) return 1;
                  return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .slice(0, 5)
                .map((art) => (
                  <Link key={art._id} to={`/article/${art.slug || art._id}`} style={{ display: 'flex', gap: '0.75rem', textDecoration: 'none', transition: 'all 0.2s' }} className="sidebar-featured-item">
                    <div style={{ flexShrink: 0, width: '60px', height: '60px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                      <img src={art.imageUrl || 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=200'} alt={art.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', lineHeight: '1.4', color: 'var(--text-primary)', fontWeight: 'bold', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{art.title}</h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>{art.category}</span>
                    </div>
                  </Link>
                ))}
            </div>
            <Link to="/search" style={{ display: 'block', marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: '0.5rem' }} className="more-btn-hover">
              شاهد المزيد من المميز ←
            </Link>
          </div>

          {/* Fatwa Archive Widget */}
          {fatwas.length > 0 && (
            <div className="card fade-up" style={{ padding: '1.5rem', background: 'var(--surface-color)', borderRight: '5px solid #8b5cf6' }}>
              <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>⚖️</span> أرشيف الفتاوى
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {fatwas.map((fatwa) => (
                  <div key={fatwa._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>Q: {fatwa.question}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary-color)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>A: {fatwa.answer}</p>
                  </div>
                ))}
              </div>
              <Link to="/fatwa-archive" style={{ display: 'block', marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 'bold', textDecoration: 'none' }}>
                عرض الأرشيف الكامل ←
              </Link>
            </div>
          )}

          <PrayerTimesComponent />

          {/* Global Live Khatmah Widget */}
          <LiveKhatmahWidget />

          {/* Deen Planner Widget */}
          <DeenPlannerWidget />

          {/* Khatmah Progress Widget (Personal) */}
          {khatmah && (
            <div className="card fade-up" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'var(--surface-color)', border: '1px solid var(--primary-color)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📖</span> ختمتك الحالية
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                لقد توقفت عند <strong style={{ color: 'var(--text-primary)' }}>سورة {khatmah.surahName}</strong>
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                <span>الآية {khatmah.ayahNumber}</span>
                <span>تحديث: {new Date(khatmah.timestamp).toLocaleDateString()}</span>
              </div>
              <Link to="/quran" className="btn btn-primary" style={{ width: '100%', fontSize: '0.95rem' }}>
                استئناف القراءة 📍
              </Link>
            </div>
          )}

          {/* Salat on Prophet Counter */}
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(to bottom, var(--surface-color), var(--bg-color))' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>صلِّ على النبي ﷺ</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>من صلى علي واحدة صلى الله عليه بها عشراً</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{salatCount}</div>
            <button
              onClick={handleSalat}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>
              اللهمَّ صلِّ على محمَّد ﷺ
            </button>
          </div>

          {/* Most Read Widget */}
          {renderMostRead('most-read-desktop')}

          {/* Daily Hadith Widget */}

          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-color)', borderRight: '5px solid var(--secondary-color)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--secondary-color)', fontSize: '1.1rem' }}>🔖 حديث اليوم</h4>
            <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.8', fontStyle: 'italic', marginBottom: '0.75rem' }}>{dailyHadith.text}</p>
            <p style={{ fontSize: '0.8rem', textAlign: 'left', color: 'var(--text-muted)' }}>— {dailyHadith.source}</p>
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>📻 إذاعة القرآن الكريم (بث مباشر)</h4>
            <button
              onClick={() => playTrack({ id: 'live-radio', title: 'إذاعة القرآن الكريم (مباشر)', url: radioUrl, author: 'منوع' })}
              className="btn"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', background: (currentTrack?.url === radioUrl && isPlaying) ? 'var(--primary-dark)' : 'var(--primary-color)', color: 'white' }}
            >
              {(currentTrack?.url === radioUrl && isPlaying) ? '⏸️ إيقاف البث' : '▶️ استماع للبث المباشر'}
            </button>
          </div>

        </aside>
      </div>

      <style>{`
        .most-read-mobile { display: none !important; }
        .most-read-desktop { display: block !important; }

        @media (max-width: 1024px) {
          .main-grid-responsive { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .sidebar-stack { order: 2; border-top: 1px solid var(--border-color); padding-top: 2rem; }
          .articles-section { order: 1; }
        }

        @media (max-width: 768px) {
          .container { padding: 1rem 0.5rem !important; overflow-x: hidden !important; }
          
          /* Hero Section Adjustments */
          .hero-responsive { 
            min-height: auto !important; 
            padding: 2rem 1rem !important; 
            border-radius: 1.5rem !important; 
            width: 100% !important;
          }
          .hero-content { padding: 1rem 0 !important; width: 100% !important; }
          .hero-title { font-size: 1.6rem !important; margin-bottom: 1rem !important; }
          .hero-p { font-size: 0.88rem !important; line-height: 1.5 !important; margin-bottom: 1.5rem !important; }
          .hero-btns { flex-direction: column !important; align-items: stretch !important; gap: 0.75rem !important; }
          .hero-btn-main { justify-content: center !important; padding: 0.85rem !important; font-size: 0.95rem !important; width: 100% !important; }

          /* Carousel Fixes */
          .articles-carousel { 
            gap: 0.75rem !important; 
            padding-left: 1rem !important; 
            padding-right: 1rem !important; 
            margin-right: -0.5rem !important;
            margin-left: -0.5rem !important;
          }
          .carousel-arrow { display: none !important; } /* Hide arrows on mobile touch */

          /* Grid Fixes */
          .sections-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .section-card-full { grid-column: span 1 !important; width: 100% !important; }
          .section-card-full > div { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; padding: 1.5rem !important; }
          .section-card-full h3 { font-size: 1.2rem !important; }
          
          .main-grid-responsive { gap: 1.5rem !important; width: 100% !important; }
          .articles-section { width: 100% !important; }
          .sidebar-stack { width: 100% !important; }

          /* Category Header */
          .articles-section h2 { font-size: 1.15rem !important; }
        }

        /* Helper to hide arrows on mobile */
        @media (pointer: coarse) {
          .carousel-arrow { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
