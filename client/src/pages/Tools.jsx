import React from 'react';
import { Link } from 'react-router-dom';
import HijriDate from '../components/HijriDate';
import PrayerTimes from '../components/PrayerTimes';

const Tools = () => {
  const tools = [
    { title: "🤖 المساعد الإسلامي", desc: "اسأل المساعد الذكي عن أي معلومة إسلامية أو تاريخية.", link: "/ai-assistant", color: "#6366f1" },
    { title: "🗓️ التقويم الهجري", desc: "تتبع التاريخ الهجري والمناسبات الإسلامية بالتفصيل.", link: "/hijri-calendar", color: "#10b981" },
    { title: "⚖️ حاسبة المواريث", desc: "احسب أنصبة الورثة بشكل تقديري بناءً على الشريعة.", link: "/inheritance-calculator", color: "#f59e0b" },
    { title: "📖 المصحف الإلكتروني", desc: "اقرأ السور والآيات بتنسيق مريح وهادئ.", link: "/quran", color: "#0d9488" },
    { title: "📿 أذكار المسلم", desc: "أذكار الصباح والمساء مع عداد تفاعلي للتسبيح.", link: "/zikr", color: "#0891b2" },
    { title: "🕋 اتجاه القبلة", desc: "حدد اتجاه الكعبة المشرفة بدقة باستخدام الـ GPS.", link: "/qibla", color: "#b45309" },
    { title: "✨ أسماء الله الحسنى", desc: "تعرف على أسماء الله ومعانيها الإيمانية العميقة.", link: "/names-of-allah", color: "#4f46e5" },
    { title: "💰 حاسبة الزكاة", desc: "احسب زكاة مالك وذهبك بناءً على النصاب الشرعي.", link: "/zakat-calculator", color: "#059669" },
    { title: "🎧 المكتبة الشاملة", desc: "استمع وشاهد دروس ومقاطع إسلامية متميزة.", link: "/multimedia", color: "#db2777" },
  ];

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>🛠️ الأدوات الإسلامية والخدمات</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>مركز الخدمات الرقمية المتكاملة لمساعدتك في عبادتك اليومية</p>
      </header>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <HijriDate />
          <PrayerTimes />
        </div>

        <h2 style={{ marginBottom: '2rem', borderRight: '4px solid var(--primary-color)', paddingRight: '1rem' }}>الخدمات التفاعلية والذكية</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {tools.map((tool, index) => (
            <Link key={index} to={tool.link} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ 
                padding: '2rem', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem', 
                borderTop: `4px solid ${tool.color}`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                 <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem' }}>{tool.title}</h3>
                 <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{tool.desc}</p>
                 <div style={{ marginTop: 'auto', color: tool.color, fontWeight: 'bold' }}>دخول &larr;</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
