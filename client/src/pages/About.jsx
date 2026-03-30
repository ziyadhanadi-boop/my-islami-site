import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const features = [
    { icon: '📖', title: 'المصحف الإلكتروني', desc: 'قراءة القرآن الكريم بتنسيق عصري مريح بخط أميري فاخر' },
    { icon: '🤖', title: 'المساعد الإسلامي الذكي', desc: 'اسأل وتعلم بدعم تقنية الذكاء الاصطناعي المتقدمة' },
    { icon: '📿', title: 'أذكار المسلم', desc: 'أذكار الصباح والمساء مع عداد تفاعلي للتسبيح' },
    { icon: '🕋', title: 'اتجاه القبلة', desc: 'تحديد القبلة بدقة باستخدام تقنية GPS' },
    { icon: '💰', title: 'أدوات إسلامية متكاملة', desc: 'حاسبة الزكاة، المواريث، التقويم الهجري وأكثر' },
    { icon: '✨', title: 'أسماء الله الحسنى', desc: 'تعلم أسماء الله الحسنى التسعة والتسعين ومعانيها' },
  ];

  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '900px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💡</div>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>منصة إسلامي</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: '2', maxWidth: '650px', margin: '0 auto' }}>
          موقع إسلامي متكامل يجمع بين العلم الشرعي الأصيل وأحدث تقنيات الذكاء الاصطناعي،
          هدفه تيسير الوصول إلى المحتوى الإسلامي الموثوق لكل مسلم في العالم.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem', borderRadius: '3rem' }}>ابدأ الاستكشاف</Link>
          <Link to="/tools" className="btn btn-outline" style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem', borderRadius: '3rem' }}>الأدوات الإسلامية</Link>
        </div>
      </div>

      {/* Mission */}
      <div className="card" style={{ padding: '3rem', marginBottom: '4rem', borderRight: '5px solid var(--primary-color)', textAlign: 'right' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.25rem', fontSize: '1.75rem' }}>🎯 رسالتنا</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '2' }}>
          نسعى إلى أن نكون المرجع الرقمي الأول والأكثر ثقة للمسلم الباحث عن علمه ودينه.
          نؤمن بأن التكنولوجيا يجب أن تكون في خدمة الإنسان لتقريبه من الله وتيسير عبادته.
          كل أداة في هذا الموقع صُممت بعناية لتكون دقيقة، موثوقة، وسهلة الاستخدام.
        </p>
      </div>

      {/* Features Grid */}
      <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '1.75rem' }}>✨ ما يميزنا</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
        {features.map((f, i) => (
          <div key={i} className="card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>{f.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Note */}
      <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--surface-color)', borderRadius: '1.5rem', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>📝 ملاحظة هامة</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          المحتوى العلمي في هذا الموقع مقدم للتوعية والتثقيف العام فقط.
          لأي استفسارات تتعلق بالفتاوى الشرعية أو المسائل الدينية المعقدة،
          يُرجى التواصل مع العلماء والمختصين الموثوقين.
        </p>
      </div>
    </div>
  );
};

export default About;
