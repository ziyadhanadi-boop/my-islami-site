import React, { useState } from 'react';

const InheritanceCalculator = () => {
  const [estate, setEstate] = useState('');
  const [gender, setGender] = useState('male'); // Deceased gender
  const [wife, setWife] = useState(0);
  const [husband, setHusband] = useState(0);
  const [sons, setSons] = useState(0);
  const [daughters, setDaughters] = useState(0);
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const total = parseFloat(estate) || 0;
    if (total <= 0) return;

    let distribution = [];
    let remaining = total;

    // VERY SIMPLIFIED LOGIC FOR DEMO (Shariah is complex, we note this)
    // 1. Wife/Husband share
    if (gender === 'male' && wife > 0) {
      const share = sons + daughters > 0 ? (1/8) : (1/4);
      distribution.push({ label: 'الزوجة', amount: total * share });
      remaining -= total * share;
    } else if (gender === 'female' && husband > 0) {
      const share = sons + daughters > 0 ? (1/4) : (1/2);
      distribution.push({ label: 'الزوج', amount: total * share });
      remaining -= total * share;
    }

    // 2. Children (2:1 ratio)
    if (sons + daughters > 0) {
      const parts = (sons * 2) + (daughters * 1);
      const partValue = remaining / parts;
      if (sons > 0) distribution.push({ label: `الأبناء (${sons})`, amount: partValue * 2 * sons });
      if (daughters > 0) distribution.push({ label: `البنات (${daughters})`, amount: partValue * 1 * daughters });
    } else if (remaining > 0) {
      distribution.push({ label: 'جهات أخرى (عصبة/أقارب)', amount: remaining });
    }

    setResult(distribution);
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>⚖️ حاسبة المواريث التقديرية</h1>
        <p style={{ color: 'var(--text-secondary)' }}>أداة مساعدة لتقدير تقسيم التركة بناءً على القواعد الأساسية</p>
        <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '1rem' }}>⚠️ تنبيه: هذه الحاسبة للتقدير الشخصي فقط، ويجب استشارة عالم شرعي أو محكمة مختصة للتقسيم الرسمي.</p>
      </header>

      <div className="card" style={{ padding: '2.5rem' }}>
        <form onSubmit={calculate}>
           <div style={{ marginBottom: '1.5rem' }}>
              <label>💰 إجمالي تركة المتوفى (مبلغ مالي):</label>
              <input type="number" className="form-control" value={estate} onChange={e => setEstate(e.target.value)} placeholder="0.00" required />
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label>👤 جنس المتوفى:</label>
                <select className="form-control" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="male">ذكر (يترك زوجة/زوجات)</option>
                  <option value="female">أنثى (تترك زوجاً)</option>
                </select>
              </div>
              {gender === 'male' ? (
                <div>
                  <label>💍 عدد الزوجات:</label>
                  <input type="number" className="form-control" value={wife} onChange={e => setWife(e.target.value)} min="0" max="4" />
                </div>
              ) : (
                <div>
                  <label>💍 هل يوجد زوج؟</label>
                  <select className="form-control" value={husband} onChange={e => setHusband(e.target.value)}>
                     <option value="0">لا</option>
                     <option value="1">نعم</option>
                  </select>
                </div>
              )}
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label>👦 عدد الأبناء الذكور:</label>
                <input type="number" className="form-control" value={sons} onChange={e => setSons(e.target.value)} min="0" />
              </div>
              <div>
                <label>👧 عدد البنات:</label>
                <input type="number" className="form-control" value={daughters} onChange={e => setDaughters(e.target.value)} min="0" />
              </div>
           </div>

           <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>حساب التقسيم التقديري</button>
        </form>

        {result && (
          <div style={{ marginTop: '2.5rem', borderTop: '2px dashed var(--border-color)', paddingTop: '2rem' }}>
             <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>النتائج المقدرة:</h3>
             {result.map((r, i) => (
               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 'bold' }}>{r.label}</span>
                  <span style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}>{r.amount.toLocaleString()} <small style={{ fontSize: '0.7rem' }}>وحدة عملة</small></span>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InheritanceCalculator;
