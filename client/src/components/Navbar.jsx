import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [openMobileMenuId, setOpenMobileMenuId] = useState(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setIsMenuOpen(false);
      setIsMobileSearchOpen(false);
    }
  };

  const toggleMobileAccordion = (id) => {
    setOpenMobileMenuId(openMobileMenuId === id ? null : id);
  };

  const iconBtnStyle = {
    width: '38px', height: '38px',
    borderRadius: '50%',
    border: '1.5px solid var(--border-color)',
    backgroundColor: 'var(--surface-color)',
    cursor: 'pointer',
    fontSize: '1.05rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.2s, border-color 0.2s',
    flexShrink: 0,
  };

  return (
    <>
      <style>{`
        .mobile-search-bar {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.3s;
          padding: 0 1rem;
          background: var(--surface-color);
          border-bottom: 1px solid var(--border-color);
        }
        .mobile-search-bar.open {
          max-height: 80px;
          padding: 0.65rem 1rem;
        }
        .mobile-search-inner {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--bg-color);
          border: 1.5px solid var(--border-color);
          border-radius: 2rem;
          padding: 0.45rem 1rem;
          width: 100%;
          transition: border-color 0.2s;
        }
        .mobile-search-inner:focus-within {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(13,148,136,0.15);
        }
        .mobile-search-inner input {
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 1rem;
          outline: none;
          direction: rtl;
        }
        .mobile-search-inner input::placeholder { color: var(--text-muted); }
        .mobile-search-close {
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); font-size: 1.1rem; padding: 0; line-height: 1;
        }
        .icon-btn:hover {
          background: var(--bg-color) !important;
          border-color: var(--primary-color) !important;
        }
        .icon-btn.active {
          background: var(--primary-color) !important;
          border-color: var(--primary-color) !important;
          color: white !important;
        }

        /* Desktop Dropdown Styles */
        .nav-item {
          position: relative;
          padding: 0.5rem 0;
        }
        .nav-link {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: var(--primary-color);
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          min-width: 220px;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          padding: 0.5rem 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          z-index: 1050;
        }
        .nav-item:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1.25rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 600;
          transition: background 0.2s, color 0.2s;
        }
        .dropdown-item:hover {
          background: rgba(13,148,136,0.08);
          color: var(--primary-color);
        }
        .dropdown-arrow {
          font-size: 0.7rem;
          transition: transform 0.3s;
        }
        .nav-item:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        /* Mega Menu Styles */
        .mega-menu {
          position: absolute;
          top: 100%;
          right: -150px; /* Adjust to center properly */
          width: 600px;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
          padding: 1.5rem;
          opacity: 0;
          visibility: hidden;
          transform: translateY(15px);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          z-index: 1050;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .nav-item:hover .mega-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .mega-col h4 {
          color: var(--primary-color);
          font-size: 1.05rem;
          margin-bottom: 0.8rem;
          padding-bottom: 0.4rem;
          border-bottom: 1.5px solid var(--border-color);
          font-family: var(--font-heading);
        }
        .mega-col a {
          display: block;
          padding: 0.4rem 0.5rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 0.4rem;
          transition: all 0.2s;
        }
        .mega-col a:hover {
          background: rgba(13,148,136,0.08);
          color: var(--primary-color);
          padding-right: 1rem;
        }

        /* Mobile Accordion Styles */
        .mobile-accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          font-weight: bold;
          font-size: 1.1rem;
          color: var(--text-primary);
          cursor: pointer;
          border-bottom: 1px solid var(--border-color);
        }
        .mobile-accordion-content {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.4s ease;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding-right: 1rem;
        }
        .mobile-accordion-content.open {
          max-height: 500px;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .mobile-accordion-item {
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.4rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mobile-accordion-item:hover {
          color: var(--primary-color);
        }
        .mobile-accordion-icon {
          transition: transform 0.3s;
        }
        .mobile-accordion-icon.open {
          transform: rotate(180deg);
        }
      `}</style>

      {/* Overlay */}
      <div className={`mobile-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>

      {/* Mobile Sidebar */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} style={{ overflowY: 'auto', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <Link to="/" onClick={() => { setIsMenuOpen(false); window.location.href = '/'; }} className="luxury-logo-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {/* Dual Rotating Rings for Mobile */}
               <svg width="42" height="42" viewBox="0 0 100 100" style={{ position: 'absolute', animation: 'logoRotate 25s linear infinite', opacity: 0.2 }}>
                  <circle cx="50" cy="50" r="48" stroke="var(--primary-dark)" strokeWidth="1.5" strokeDasharray="5 10" fill="none" />
                </svg>
                <svg width="36" height="36" viewBox="0 0 100 100" style={{ position: 'absolute', animation: 'logoRotateReverse 15s linear infinite', opacity: 0.3 }}>
                  <circle cx="50" cy="50" r="45" stroke="var(--primary-color)" strokeWidth="1.5" strokeDasharray="8 8" fill="none" />
                </svg>
              <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 80C15 80 25 20 50 20C75 20 85 80 85 80" stroke="var(--primary-dark)" strokeWidth="9" strokeLinecap="round"/>
                <path d="M30 80C30 80 35 45 50 45C65 45 70 80 70 80" stroke="var(--primary-dark)" strokeWidth="7" strokeLinecap="round" opacity="0.6"/>
                <circle cx="50" cy="30" r="6" fill="var(--primary-dark)"/>
              </svg>
            </div>
            <span style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--primary-dark)', fontFamily: "'El Messiri', sans-serif" }}>إسلامي</span>
          </Link>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--text-primary)', cursor: 'pointer' }}>×</button>
        </div>

        {/* Search inside sidebar */}
        <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
          <div className="mobile-search-inner" style={{ background: 'var(--bg-color)' }}>
            <span style={{ color: 'var(--text-muted)' }}>🔍</span>
            <input type="text" placeholder="ابحث في الموقع..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-header" style={{ border: 'none' }}>
            <span>🏠 الرئيسية</span>
          </Link>
          
          {/* Categories Accordion */}
          <div>
            <div className="mobile-accordion-header" onClick={() => toggleMobileAccordion('categories')}>
              <span>📚 أقسام إسلامية</span>
              <span className={`mobile-accordion-icon ${openMobileMenuId === 'categories' ? 'open' : ''}`}>▼</span>
            </div>
            <div className={`mobile-accordion-content ${openMobileMenuId === 'categories' ? 'open' : ''}`} style={{ maxHeight: openMobileMenuId === 'categories' ? '1200px' : '0' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', margin: '0.5rem 0' }}>⚖️ الشريعة والفقه</div>
              <Link to="/category/فقه الصلاة" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">الصلاة في الإسلام</Link>
              <Link to="/category/فقه الزكاة" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">أحكام الزكاة والصدقات</Link>
              <Link to="/category/فقه الصيام" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">الصيام والحج</Link>
              <Link to="/category/المعاملات المالية" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">المعاملات المالية</Link>
              
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', margin: '0.5rem 0', marginTop: '1rem' }}>📖 القرآن والحديث</div>
              <Link to="/category/علوم القرآن" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">علوم وتفسير القرآن</Link>
              <Link to="/category/الحديث النبوي" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">الحديث والشروح</Link>
              <Link to="/category/الهدي النبوي" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">الهدي النبوي والسنن</Link>

              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', margin: '0.5rem 0', marginTop: '1rem' }}>🕌 العقيدة والروح</div>
              <Link to="/category/العقيدة والتوحيد" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">أركان الإيمان والتوحيد</Link>
              <Link to="/category/نماء وتزكية" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">نماء وتزكية وإصلاح القلوب</Link>
              <Link to="/category/فضل الدعاء" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">فضل الذكر والدعاء</Link>

              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', margin: '0.5rem 0', marginTop: '1rem' }}>📜 عامة</div>
              <Link to="/category/السيرة والتاريخ" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">السيرة النبوية والتاريخ</Link>
              <Link to="/category/الأسرة والمجتمع" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">الأسرة والتربية</Link>
              <Link to="/fatwa-archive" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">⚖️ أرشيف الفتاوى</Link>
              <Link to="/ask-fatwa" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>💬 اسأل سؤالك / فتوى</Link>
              <Link to="/ruqyah" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item" style={{ color: 'var(--primary-color)' }}>🛡️ الرقية الشرعية</Link>
              <Link to="/halal-check" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>⚖️ حلال أم حرام؟</Link>
              <Link to="/duas" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">🤲 مكتبة الأدعية</Link>
              <Link to="/prophet-stories" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">📜 قصص الأنبياء</Link>
              <Link to="/tibb-nabawi" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">🌿 الطب النبوي</Link>
              <Link to="/podcast" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">🎙️ البودكاست</Link>
            </div>
          </div>

          {/* Tools Accordion */}
          <div>
            <div className="mobile-accordion-header" onClick={() => toggleMobileAccordion('tools')}>
              <span>🛠️ الأدوات والمكتبة</span>
              <span className={`mobile-accordion-icon ${openMobileMenuId === 'tools' ? 'open' : ''}`}>▼</span>
            </div>
            <div className={`mobile-accordion-content ${openMobileMenuId === 'tools' ? 'open' : ''}`}>
              <Link to="/library" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item" style={{ color: 'var(--primary-color)' }}>📚 المكتبة الإسلامية PDF</Link>
              <Link to="/islamic-tube" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item" style={{ color: 'var(--primary-color)' }}>🎬 مرئيات إسلامية</Link>
              <Link to="/quizzes" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item" style={{ color: 'var(--primary-color)' }}>🎮 اختبر معلوماتك</Link>
              <Link to="/quran" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">📖 المصحف الشريف</Link>
              <Link to="/zikr" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">📿 الأذكار اليومية</Link>
              <Link to="/names-of-allah" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">✨ أسماء الله الحسنى</Link>
              <Link to="/multimedia" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">🎧 الصوتيات والمرئيات</Link>
              <Link to="/qibla" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">🕋 اتجاه القبلة</Link>
              <Link to="/zakat-calculator" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">💰 حاسبة الزكاة</Link>
              <Link to="/inheritance-calculator" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">⚖️ المواريث</Link>
              <Link to="/hijri-calendar" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-item">🗓️ التقويم الهجري</Link>
            </div>
          </div>

          <Link to="/kids-corner" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-header" style={{ color: '#ef4444' }}>
            <span>🧸 ركن الأطفال</span>
          </Link>

          <Link to="/ai-assistant" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-header" style={{ color: 'var(--primary-color)' }}>
            <span>🤖 المساعد الذكي</span>
          </Link>
          
          <Link to="/favorites" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-header">
            <span>❤️ مفضلاتي</span>
          </Link>

          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="mobile-accordion-header">
            <span>ℹ️ من نحن</span>
          </Link>

          <div style={{ marginTop: '1.5rem' }}>
            <div onClick={() => { toggleDarkMode(); setIsMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', justifyContent: 'center', fontWeight: 'bold' }}>
              <span>{isDark ? '☀️ الوضع المضيء' : '🌙 الوضع المظلم'}</span>
            </div>
          </div>
        </div>
      </div>

      <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        {/* Main Nav Bar */}
        <nav style={{ backgroundColor: 'var(--surface-color)', padding: '0.7rem 0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>

            {/* Deep-Tone Wavy Logo with Dual Orbital Animation */}
            <Link to="/" className="luxury-logo-link" onClick={() => { window.location.href = '/'; }} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              textDecoration: 'none'
            }}>
              {/* Dual Orbital Rings Container */}
              <div className="logo-orbital-container" style={{ position: 'relative', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="52" height="52" viewBox="0 0 100 100" style={{ position: 'absolute', animation: 'logoRotate 25s linear infinite', opacity: 0.2 }}>
                  <circle cx="50" cy="50" r="48" stroke="var(--primary-dark)" strokeWidth="1" strokeDasharray="5 15" fill="none" />
                </svg>
                <svg width="46" height="46" viewBox="0 0 100 100" style={{ position: 'absolute', animation: 'logoRotateReverse 15s linear infinite', opacity: 0.3 }}>
                  <circle cx="50" cy="50" r="45" stroke="var(--primary-color)" strokeWidth="1.5" strokeDasharray="10 10" fill="none" />
                </svg>
                
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 80C15 80 25 20 50 20C75 20 85 80 85 80" stroke="var(--primary-dark)" strokeWidth="9" strokeLinecap="round"/>
                  <path d="M30 80C30 80 35 45 50 45C65 45 70 80 70 80" stroke="var(--primary-dark)" strokeWidth="7" strokeLinecap="round" opacity="0.6"/>
                  <circle cx="50" cy="30" r="6" fill="var(--primary-dark)"/>
                </svg>
              </div>

              {/* Wavy Styled Name with Enhanced Hover Shine */}
              <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <span className="premium-shimmer-text" style={{ 
                  fontSize: '1.9rem', 
                  fontWeight: '700', 
                  color: 'var(--primary-dark)',
                  fontFamily: "'El Messiri', sans-serif",
                  letterSpacing: '0',
                  display: 'inline-block',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  إسلامي
                </span>
                
                {/* Custom SVG Wave Underline */}
                <svg width="80" height="10" viewBox="0 0 80 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: '-8px', right: 0 }}>
                  <path className="wave-line" d="M0 5C10 5 15 2 25 2C35 2 45 8 55 8C65 8 70 5 80 5" stroke="var(--primary-dark)" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>

              <style>{`
                @keyframes logoRotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes logoRotateReverse {
                  from { transform: rotate(360deg); }
                  to { transform: rotate(0deg); }
                }
                @keyframes textShine {
                  0% { background-position: 200% center; }
                  100% { background-position: -200% center; }
                }
                
                .luxury-logo-link:hover .logo-orbital-container svg {
                  animation-duration: 5s;
                  opacity: 0.8 !important;
                }
                
                .luxury-logo-link:hover .premium-shimmer-text {
                  color: var(--primary-color) !important;
                  transform: scale(1.08) translateY(-2px);
                  text-shadow: 0 5px 15px rgba(20,184,166,0.3);
                }

                .luxury-logo-link:hover .premium-shimmer-text::after {
                  content: "";
                  position: absolute;
                  top: 0; left: -100%;
                  width: 50%; height: 100%;
                  background: linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent);
                  transform: skewX(-25deg);
                  animation: shineStreak 0.8s ease-in-out;
                }

                @keyframes shineStreak {
                  0% { left: -100%; }
                  100% { left: 200%; }
                }

                .luxury-logo-link:hover .wave-line {
                  stroke: var(--primary-color);
                  stroke-dasharray: 4 2;
                  animation: dash 0.5s linear infinite;
                }
                @keyframes dash {
                  to { stroke-dashoffset: -6; }
                }
              `}</style>
            </Link>

            {/* Desktop Links (Mega Menu / Dropdowns) */}
            <ul className="desktop-only" style={{ display: 'flex', gap: 'clamp(0.75rem, 1.2vw, 1.25rem)', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
              
              <li className="nav-item">
                <Link to="/" className="nav-link">الرئيسية</Link>
              </li>

              <li className="nav-item">
                <div className="nav-link">
                  أقسام إسلامية <span className="dropdown-arrow">▼</span>
                </div>
                <div className="mega-menu">
                  <div className="mega-col">
                    <h4>⚖️ الشريعة والفقه</h4>
                    <Link to="/category/فقه الصلاة">الصلاة في الإسلام</Link>
                    <Link to="/category/فقه الزكاة">أحكام الزكاة والصدقات</Link>
                    <Link to="/category/فقه الصيام">الصيام والحج</Link>
                    <Link to="/category/المعاملات المالية">المعاملات المالية</Link>
                  </div>
                  <div className="mega-col">
                    <h4>📖 القرآن والحديث</h4>
                    <Link to="/category/علوم القرآن">علوم وتفسير القرآن</Link>
                    <Link to="/category/الحديث النبوي">الحديث والشروح</Link>
                    <Link to="/category/الهدي النبوي">الهدي النبوي والسنن</Link>
                  </div>
                  <div className="mega-col">
                    <h4>🕌 العقيدة والروح</h4>
                    <Link to="/category/العقيدة والتوحيد">أركان الإيمان والتوحيد</Link>
                    <Link to="/category/نماء وتزكية">نماء وتزكية وإصلاح القلوب</Link>
                    <Link to="/category/فضل الدعاء">فضل الذكر والدعاء</Link>
                  </div>
                  <div className="mega-col">
                    <h4>📜 عامة</h4>
                    <Link to="/category/السيرة والتاريخ">السيرة النبوية والتاريخ</Link>
                    <Link to="/category/الأسرة والمجتمع">الأسرة والتربية</Link>
                    <Link to="/fatwa-archive">⚖️ أرشيف الفتاوى</Link>
                    <Link to="/ask-fatwa" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>💬 اسأل سؤالك للفتوى</Link>
                  </div>
                  <div className="mega-col" style={{ borderRight: '2px solid var(--primary-color)', paddingRight: '1rem' }}>
                    <h4>🤖 خدمات ذكية (AI)</h4>
                    <Link to="/ai-assistant" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>💬 الدردشة مع المساعد</Link>
                    <Link to="/quran-ai" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>📖 البحث القرآني الذكي</Link>
                    <Link to="/halal-check" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>⚖️ حلال أم حرام؟</Link>
                    <Link to="/duas" style={{ color: 'var(--primary-color)' }}>🤲 مكتبة الأدعية</Link>
                    <Link to="/events-map" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>📍 خريطة الفعاليات</Link>
                    <Link to="/ruqyah" style={{ color: 'var(--primary-color)' }}>🛡️ الرقية الشرعية</Link>
                  </div>
                  <div className="mega-col">
                    <h4>🌿 محتوى متميز</h4>
                    <Link to="/prophet-stories">📜 قصص الأنبياء</Link>
                    <Link to="/tibb-nabawi">🌿 الطب النبوي</Link>
                    <Link to="/podcast">🎙️ البودكاست الإسلامي</Link>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <div className="nav-link">
                  الأدوات والمكتبة <span className="dropdown-arrow">▼</span>
                </div>
                <div className="dropdown-menu">
                  <Link to="/library" className="dropdown-item">📚 المكتبة الإسلامية PDF</Link>
                  <Link to="/islamic-tube" className="dropdown-item">🎬 مرئيات إسلامية</Link>
                  <Link to="/quizzes" className="dropdown-item">🎮 اختبر معلوماتك</Link>
                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
                  <Link to="/quran" className="dropdown-item">📖 المصحف الشريف</Link>
                  <Link to="/zikr" className="dropdown-item">📿 الأذكار اليومية</Link>
                  <Link to="/names-of-allah" className="dropdown-item">✨ أسماء الله الحسنى</Link>
                  <Link to="/multimedia" className="dropdown-item">🎧 الصوتيات والمرئيات</Link>
                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
                  <Link to="/qibla" className="dropdown-item">🕋 اتجاه القبلة</Link>
                  <Link to="/zakat-calculator" className="dropdown-item">💰 حاسبة الزكاة</Link>
                  <Link to="/inheritance-calculator" className="dropdown-item">⚖️ المواريث</Link>
                  <Link to="/hijri-calendar" className="dropdown-item">🗓️ التقويم الهجري</Link>
                </div>
              </li>

              <li className="nav-item">
                <Link to="/ai-assistant" className="nav-link" style={{ color: 'var(--primary-color)' }}>المساعد الذكي</Link>
              </li>

              <li className="nav-item">
                <Link to="/kids-corner" className="nav-link" style={{ color: '#ef4444' }}>ركن الأطفال</Link>
              </li>

              <li className="nav-item">
                <Link to="/favorites" className="nav-link">المفضلة</Link>
              </li>

            </ul>

            {/* Desktop Utilities */}
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', right: '0.85rem', color: 'var(--text-muted)', fontSize: '0.95rem', pointerEvents: 'none' }}>🔍</span>
                <input
                  type="text" placeholder="ابحث في الموقع..."
                  value={query} onChange={e => setQuery(e.target.value)}
                  style={{ padding: '0.5rem 2.25rem 0.5rem 1rem', borderRadius: '2rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', width: '180px', fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(13,148,136,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
                />
              </form>
              <button className="icon-btn" onClick={toggleDarkMode} title={isDark ? 'الوضع المضيء' : 'الوضع المظلم'} style={iconBtnStyle}>
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>

            {/* Mobile Utilities */}
            <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className={`icon-btn ${isMobileSearchOpen ? 'active' : ''}`}
                onClick={() => setIsMobileSearchOpen(o => !o)}
                style={iconBtnStyle}
                aria-label="بحث"
              >🔍</button>
              <button
                className="icon-btn"
                onClick={toggleDarkMode}
                style={iconBtnStyle}
                aria-label="تغيير الثيم"
              >{isDark ? '☀️' : '🌙'}</button>
              <button
                className="icon-btn"
                onClick={() => setIsMenuOpen(true)}
                style={{ ...iconBtnStyle, borderRadius: '0.6rem', fontSize: '1.15rem' }}
                aria-label="القائمة"
              >☰</button>
            </div>

          </div>
        </nav>

        {/* Mobile Expanding Search Bar */}
        <div className={`mobile-search-bar mobile-only ${isMobileSearchOpen ? 'open' : ''}`}>
          <form onSubmit={handleSearch}>
            <div className="mobile-search-inner">
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>🔍</span>
              <input
                ref={mobileSearchRef}
                type="text"
                placeholder="ابحث في المقالات والأدوات..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="button" className="mobile-search-close" onClick={() => { setIsMobileSearchOpen(false); setQuery(''); }}>✕</button>
            </div>
          </form>
        </div>
      </header>
    </>
  );
};

export default Navbar;
