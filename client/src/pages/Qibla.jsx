import React, { useState, useEffect } from 'react';

const Qibla = () => {
  const [coords, setCoords] = useState(null);
  const [qibla, setQibla] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mecca coordinates
  const MECCA_LAT = 21.4225;
  const MECCA_LNG = 39.8262;

  const calculateQibla = (lat, lng) => {
    const phiK = (MECCA_LAT * Math.PI) / 180.0;
    const lambdaK = (MECCA_LNG * Math.PI) / 180.0;
    const phi = (lat * Math.PI) / 180.0;
    const lambda = (lng * Math.PI) / 180.0;

    const psi = (180.0 / Math.PI) * Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
    return (psi + 360.0) % 360.0;
  };

  const getPos = () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('متصفحك لا يدعم تحديد الموقع.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        setQibla(calculateQibla(latitude, longitude));
        setLoading(false);
      },
      (err) => {
        setError('تعذر تحديد موقعك. يرجى تفعيل الـ GPS في متصفحك.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '600px', textAlign: 'center' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>⚖️ اتجاه القبلة</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>حدد موقع الكعبة المشرفة من مكانك الحالي</p>
      </div>

      <div className="card" style={{ padding: '3rem 2rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
        {!coords ? (
          <div style={{ padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📍</div>
            <p style={{ marginBottom: '2rem', lineHeight: '1.8' }}>نحتاج للوصول إلى موقعك الجغرافي لنتمكن من حساب اتجاه القبلة الدقيق من مكانك.</p>
            <button 
              onClick={getPos} 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', borderRadius: '1rem', fontWeight: 'bold' }}
              disabled={loading}
            >
              {loading ? 'جاري تحديد الموقع...' : 'ابدأ تحديد القبلة من مكاني'}
            </button>
            {error && <p style={{ color: 'var(--danger-color)', marginTop: '1.5rem', fontSize: '0.9rem' }}>{error}</p>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              position: 'relative', 
              width: '280px', 
              height: '280px', 
              borderRadius: '50%', 
              background: 'var(--bg-color)', 
              border: '6px solid var(--primary-color)',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              {/* North Indicator */}
              <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold' }}>ش</div>
              
              {/* Compass Needle */}
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                width: '100%', 
                height: '4px', 
                background: 'linear-gradient(90deg, transparent 50%, #f43f5e 50%)', 
                transform: `translate(-50%, -50%) rotate(${qibla - 90}deg)`,
                zIndex: 2,
                transition: 'transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <div style={{ position: 'absolute', right: '0', top: '-8px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f43f5e', border: '4px solid white', boxShadow: '0 0 10px rgba(244, 63, 94, 0.5)' }}></div>
              </div>

              {/* Kaaba Icon at the calculated angle mark */}
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: `translate(-50%, -50%) rotate(${qibla}deg)`,
                width: '100%',
                height: '0',
                zIndex: 3
              }}>
                <div style={{ position: 'absolute', top: '-110px', left: '50%', transform: 'translateX(-50%)', fontSize: '2rem' }}>🕋</div>
              </div>

              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', zIndex: 5 }}></div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{Math.round(qibla)}°</div>
              <p style={{ color: 'var(--text-secondary)' }}>زاوية الانحراف من الشمال الحقيقي</p>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                 <div style={{ background: 'var(--bg-color)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>خط العرض</div>
                    <div style={{ fontWeight: '600' }}>{coords.latitude.toFixed(4)}</div>
                 </div>
                 <div style={{ background: 'var(--bg-color)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>خط الطول</div>
                    <div style={{ fontWeight: '600' }}>{coords.longitude.toFixed(4)}</div>
                 </div>
              </div>

              <button 
                onClick={getPos} 
                className="btn btn-outline" 
                style={{ marginTop: '2rem', padding: '0.5rem 1.5rem', borderRadius: '1rem', fontSize: '0.85rem' }}
              >
                تحديث الموقع
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
        <p>موافقة المتصفح على مشاركة الموقع ضرورية لضمان دقة اتجاه القبلة.</p>
        <p>مكة المكرمة تقع عند إحداثيات (21.42° شمالاً، 39.82° شرقاً).</p>
      </div>
    </div>
  );
};

export default Qibla;
