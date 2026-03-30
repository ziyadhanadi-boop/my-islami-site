import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if(!email) return;
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
    color: '#cbd5e1',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    display: 'block',
    marginBottom: '0.75rem',
    width: 'fit-content'
  };

  const sectionTitleStyle = {
    color: 'white',
    fontFamily: 'var(--font-heading)',
    fontSize: '1.25rem',
    marginBottom: '1.5rem',
    position: 'relative',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid var(--primary-color)',
    width: 'fit-content'
  };

  return (
    <footer style={{ backgroundColor: '#0f172a', color: 'white', paddingTop: '5rem', borderTop: '4px solid var(--primary-color)', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        
        {/* About Section */}
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', fontSize: '2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>إسلامي</span>
            <span style={{ fontSize: '1.5rem' }}>🕌</span>
          </h2>
          <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '1rem', maxWidth: '350px' }}>
            منصة إلكترونية متكاملة تهدف لنشر تعاليم الإسلام السمحة، وتقديم محتوى شرعي موثوق بأسلوب عصري يجمع بين الأصالة والحداثة.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
             {/* Mock Social Icons */}
             {['🌐', '📱', '📧', '📺'].map((icon, idx) => (
               <div key={idx} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--primary-color)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
                 {icon}
               </div>
             ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={sectionTitleStyle}>روابط سريعة</h4>
          <Link to="/" style={footerLinkStyle}>الرئيسية</Link>
          <Link to="/tools" style={footerLinkStyle}>الأدوات الإسلامية</Link>
          <Link to="/quran" style={footerLinkStyle}>المصحف الشريف</Link>
          <Link to="/fatwa" style={footerLinkStyle}>أرشيف الفتاوى</Link>
          <Link to="/about" style={footerLinkStyle}>من نحن</Link>
        </div>

        {/* Categories */}
        <div>
          <h4 style={sectionTitleStyle}>أقسام مختارة</h4>
          <Link to="/search?q=فقه" style={footerLinkStyle}>الفقه الإسلامي</Link>
          <Link to="/search?q=تزكية" style={footerLinkStyle}>نماء وتزكية</Link>
          <Link to="/search?q=سيرة" style={footerLinkStyle}>السيرة النبوية</Link>
          <Link to="/search?q=أذكار" style={footerLinkStyle}>الأذكار والأدعية</Link>
        </div>

        {/* Newsletter Section */}
        <div style={{ backgroundColor: 'rgba(13, 148, 136, 0.05)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(13, 148, 136, 0.1)' }}>
          <h4 style={{ ...sectionTitleStyle, borderBottom: 'none' }}>اشترك في النشرة</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>انضم إلينا ليصلك جديد المقالات والدروس والكتب الإسلامية.</p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input 
              type="email" 
              placeholder="بريدك الإلكتروني" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '0.5rem', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', outline: 'none' }} 
              required 
            />
            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'} onMouseOut={e => e.currentTarget.style.filter = 'none'}>
              {loading ? 'جاري التسجيل...' : 'اشترك الآن'}
            </button>
          </form>
          {msg && <p style={{ marginTop: '1rem', color: msg.includes('نجاح') ? '#10b981' : '#f87171', fontSize: '0.85rem', textAlign: 'center' }}>{msg}</p>}
        </div>

      </div>

      {/* Decorative Border */}
      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)', width: '100%' }}></div>

      {/* Bottom Copyright Bar */}
      <div style={{ padding: '2rem 1rem', backgroundColor: '#020617' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', mdDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} منصة إسلامي</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/privacy" style={{ color: '#64748b', textDecoration: 'none' }}>سياسة الخصوصية</Link>
              <Link to="/terms" style={{ color: '#64748b', textDecoration: 'none' }}>شروط الاستخدام</Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            تم التطوير بـ <span style={{ color: '#ef4444' }}>❤️</span> لنشر الخير
          </div>
        </div>
      </div>

      <style>{`
        footer a:hover {
          color: var(--primary-color) !important;
          padding-right: 5px;
        }
        @media (max-width: 768px) {
           footer { text-align: center; }
           footer h4::after { left: 50%; transform: translateX(-50%); }
           footer .container { justify-items: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
