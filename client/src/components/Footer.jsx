import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/newsletter', { email });
      setMsg(res.data.msg);
      setEmail('');
    } catch (error) {
      setMsg(error.response?.data?.msg || 'حدث خطأ. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const footerLinkStyle = {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.92rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'block',
    marginBottom: '0.85rem',
    width: 'fit-content',
    fontWeight: '500'
  };

  const sectionTitleStyle = {
    color: 'white',
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2rem',
    marginBottom: '1.8rem',
    position: 'relative',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  return (
    <footer style={{
      backgroundColor: '#020617', /* Deeper dark */
      color: 'white',
      paddingTop: '6rem',
      position: 'relative',
      overflow: 'hidden',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Decorative Background Elements */}
      <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(15,118,110,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(217,119,6,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '4rem', marginBottom: '5rem' }}>

          {/* Logo & About Section */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '2rem' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
                {/* Premium Footer Logo */}
                <div style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="48" height="48" viewBox="0 0 100 100" style={{ position: 'absolute', opacity: 0.15 }}>
                    <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="1" fill="none" />
                  </svg>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 80C15 80 25 20 50 20C75 20 85 80 85 80" stroke="var(--primary-light)" strokeWidth="8" strokeLinecap="round" />
                    <path d="M30 80C30 80 35 45 50 45C65 45 70 80 70 80" stroke="var(--primary-light)" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
                    <circle cx="50" cy="30" r="5" fill="var(--accent-color)" />
                  </svg>
                </div>
                <span style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: 'white',
                  fontFamily: "'El Messiri', sans-serif",
                  letterSpacing: '0.5px'
                }}>إسلامي</span>
              </Link>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.9', fontSize: '0.95rem', maxWidth: '340px', marginBottom: '2.5rem' }}>
              منصة رقمية رائدة مُتخصصة في استعراض العلوم الشرعية بأسلوب عصري مُبسط يخدم المسلم في حياته اليومية، بمرجعية علمية موثوقة.
            </p>

            <div style={{ display: 'flex', gap: '1.2rem' }}>
              {/* Professional Social Rings */}
              {[
                { icon: '🌐', label: 'الموقع' },
                { icon: '📱', label: 'تطبيقنا' },
                { icon: '📧', label: 'تواصل' },
                { icon: '📺', label: 'يوتيوب' }
              ].map((item, idx) => (
                <div key={idx}
                  className="footer-social-btn"
                  style={{
                    width: '42px', height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                  {item.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={sectionTitleStyle}>
              <span style={{ width: '3px', height: '18px', backgroundColor: 'var(--primary-light)', borderRadius: '2px' }}></span>
              الروابط الرئيسية
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/" style={footerLinkStyle} className="footer-nav-link">🏠 الصفحة الرئيسية</Link>
              <Link to="/tools" style={footerLinkStyle} className="footer-nav-link">🛠️ الأدوات الإسلامية</Link>
              <Link to="/quran" style={footerLinkStyle} className="footer-nav-link">📖 المصحف الشريف</Link>
              <Link to="/fatwa-archive" style={footerLinkStyle} className="footer-nav-link">⚖️ أرشيف الفتاوى</Link>
              <Link to="/about" style={footerLinkStyle} className="footer-nav-link">ℹ️ نبذة عن المنصة</Link>
            </div>
          </div>

          {/* Selected Insights */}
          <div>
            <h4 style={sectionTitleStyle}>
              <span style={{ width: '3px', height: '18px', backgroundColor: 'var(--accent-color)', borderRadius: '2px' }}></span>
              محتوى مختار
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/duas" style={footerLinkStyle} className="footer-nav-link">🤲 مكتبة الأدعية</Link>
              <Link to="/prophet-stories" style={footerLinkStyle} className="footer-nav-link">📜 قصص الأنبياء</Link>
              <Link to="/tibb-nabawi" style={footerLinkStyle} className="footer-nav-link">🌿 الطب النبوي</Link>
              <Link to="/podcast" style={footerLinkStyle} className="footer-nav-link">🎙️ بودكاست المنصة</Link>
              <Link to="/halal-check" style={footerLinkStyle} className="footer-nav-link">⚖️ حلال أم حرام؟</Link>
            </div>
          </div>

          {/* Newsletter Section */}
          <div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.02)',
              padding: '2.25rem',
              borderRadius: '1.5rem',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <h4 style={{ ...sectionTitleStyle, marginBottom: '1rem' }}>نشرة البريد</h4>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>كن أول من يتلقى تحديثات المحتوى الحصرية والمقالات العلمية الجديدة.</p>

              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      color: 'white',
                      outline: 'none',
                      fontSize: '0.9rem',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary-light)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="footer-submit-btn"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 4px 15px rgba(15,118,110,0.3)'
                  }}
                >
                  {loading ? 'جاري المعالجة...' : 'اشترك الآن 📨'}
                </button>
              </form>
              {msg && <p style={{ marginTop: '1.1rem', color: msg.includes('نجاح') ? '#10b981' : '#f43f5e', fontSize: '0.8rem', textAlign: 'center', fontWeight: '500' }}>{msg}</p>}
            </div>
          </div>

        </div>

        {/* Global Statistics / Badges (Minor touch) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', padding: '1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🚀 تحديثات يومية</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>📜 مصادر موثوقة</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🛡️ حماية خصوصية</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🤲 دعم تقني مباشر</div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div style={{ padding: '2rem 1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <span>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} <strong style={{ color: 'rgba(255,255,255,0.7)' }}>منصة إسلامي</strong></span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'inherit'}>سياسة الخصوصية</Link>
              <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = 'inherit'}>شروط الخدمة</Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
            بُني بكل <span style={{ color: '#f43f5e', fontSize: '1.2rem', animation: 'heartBeat 2s infinite' }}>&hearts;</span> لنشر النور والمعرفة
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        .footer-nav-link:hover {
          color: var(--primary-light) !important;
          transform: translateX(-8px);
        }

        .footer-social-btn:hover {
          background-color: var(--primary-color) !important;
          border-color: var(--primary-light) !important;
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(15,118,110,0.4);
        }

        .footer-submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(15,118,110,0.5);
          background-color: var(--primary-dark) !important;
        }

        @media (max-width: 768px) {
           footer { text-align: center; }
           footer .container > div { justify-items: center; }
           .footer-nav-link { margin: 0 auto 0.85rem !important; }
           .footer-social-btn { width: 45px !important; height: 45px !important; }
           footer .container > div:first-child { text-align: center; display: flex; flexDirection: column; alignItems: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
