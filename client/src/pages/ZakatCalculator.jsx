import React, { useState } from 'react';

const ZakatCalculator = () => {
  const [cash, setCash] = useState('');
  const [gold, setGold] = useState('');
  const [goldPrice, setGoldPrice] = useState('2500'); // Example default price per gram in EGP/local cur.
  const [silver, setSilver] = useState('');
  const [totalZakat, setTotalZakat] = useState(null);

  const calculateZakat = (e) => {
    e.preventDefault();
    const goldValue = (parseFloat(gold) || 0) * (parseFloat(goldPrice) || 0);
    const cashTotal = (parseFloat(cash) || 0);
    const silverTotal = (parseFloat(silver) || 0); // Simplified value for silver
    
    const nisab = 85 * (parseFloat(goldPrice) || 0);
    const grandTotal = goldValue + cashTotal + silverTotal;
    
    if (grandTotal >= nisab) {
      setTotalZakat(grandTotal * 0.025);
    } else {
      setTotalZakat(0);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>💰 حاسبة الزكاة</h1>
        <p style={{ color: 'var(--text-secondary)' }}>احسب زكاتك بدقة وسهولة بناءً على مقدار النصاب الشرعي</p>
      </div>

      <div className="card" style={{ padding: '2.5rem', borderRadius: '1.25rem', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
        <form onSubmit={calculateZakat}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>💰 النقد والمدخرات (عملة محلية)</label>
              <input type="number" className="form-control" style={{ padding: '0.8rem' }} value={cash} onChange={e => setCash(e.target.value)} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>🏅 وزن الذهب (بالجرام - عيار 24)</label>
              <input type="number" className="form-control" style={{ padding: '0.8rem' }} value={gold} onChange={e => setGold(e.target.value)} placeholder="0" />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>🟡 سعر جرام الذهب الحالي (عملة محلية)</label>
              <input type="number" className="form-control" style={{ padding: '0.8rem' }} value={goldPrice} onChange={e => setGoldPrice(e.target.value)} placeholder="مثال: 2500" />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>💍 وزن الفضة (بالجرام - اختياري)</label>
              <input type="number" className="form-control" style={{ padding: '0.8rem' }} value={silver} onChange={e => setSilver(e.target.value)} placeholder="0" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.25rem', fontWeight: 'bold', borderRadius: '4rem' }}>
            احسب مقدار الزكاة الواجبة الآن
          </button>
        </form>

        {totalZakat !== null && (
          <div style={{ marginTop: '2.5rem', padding: '2rem', borderRadius: '1rem', backgroundColor: totalZakat > 0 ? '#ecfdf5' : '#fef2f2', border: `2px solid ${totalZakat > 0 ? '#10b981' : '#ef4444'}`, textAlign: 'center' }}>
             {totalZakat > 0 ? (
               <>
                 <h3 style={{ fontSize: '1.5rem', color: '#065f46', marginBottom: '1rem' }}>مقدار الزكاة الواجبة هو:</h3>
                 <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#047857' }}>{totalZakat.toLocaleString()} <span style={{ fontSize: '1.25rem' }}>عملة محلية</span></div>
                 <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#065f46' }}>* تم الحساب بناءً على نسبة 2.5% من إجمالي المال البالغ النصاب (قيمة 85 جرام ذهب).</p>
               </>
             ) : (
               <>
                 <h3 style={{ fontSize: '1.5rem', color: '#991b1b', marginBottom: '0.5rem' }}>لم يبلغ مالك النصاب الشرعي</h3>
                 <p style={{ color: '#b91c1c' }}>الزكاة غير واجبة عليك حالياً، ولكن يمكنك دائماً التصدق لزيادة البركة.</p>
               </>
             )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '1rem', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>💡 معلومات هامة عن النصاب والزكاة:</h4>
          <p>• النصاب هو الحد الأدنى من المال الذي تجب فيه الزكاة، وهو ما يعادل قيمة 85 جراماً من الذهب عيار 24.</p>
          <p>• يجب أن يمر على المال "حول كامل" (سنة هجرية) وهو في حوزتك وبلغ حد النصاب.</p>
          <p>• نسبة الزكاة المفروضة هي 2.5% (أو ربع العشر) من إجمالي المبلغ الذي حال عليه الحول.</p>
      </div>
    </div>
  );
};

export default ZakatCalculator;
