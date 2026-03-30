import React, { useState, useEffect } from 'react';

// قائمة الدول والمدن المدعومة (عربي - إنجليزي لـ API)
const locationData = {
  "السعودية": {
    en: "Saudi Arabia",
    cities: { "الرياض": "Riyadh", "مكة المكرمة": "Makkah", "المدينة المنورة": "Madinah", "جدة": "Jeddah", "الدمام": "Dammam" }
  },
  "مصر": {
    en: "Egypt",
    cities: { "القاهرة": "Cairo", "الإسكندرية": "Alexandria", "الجيزة": "Giza", "المنصورة": "Mansoura" }
  },
  "سوريا": {
    en: "Syria",
    cities: { "دمشق": "Damascus", "حلب": "Aleppo", "حمص": "Homs", "اللاذقية": "Latakia" }
  },
  "فلسطين": {
    en: "Palestine",
    cities: { "القدس": "Jerusalem", "غزة": "Gaza", "رام الله": "Ramallah", "نابلس": "Nablus" }
  },
  "الأردن": {
    en: "Jordan",
    cities: { "عمان": "Amman", "إربد": "Irbid", "الزرقاء": "Zarqa", "العقبة": "Aqaba" }
  },
  "الإمارات": {
    en: "UAE",
    cities: { "دبي": "Dubai", "أبو ظبي": "Abu Dhabi", "الشارقة": "Sharjah", "العين": "Al Ain" }
  },
  "الكويت": {
    en: "Kuwait",
    cities: { "مدينة الكويت": "Kuwait City", "الجهراء": "Jahra" }
  },
  "قطر": {
    en: "Qatar",
    cities: { "الدوحة": "Doha", "الريان": "Al Rayyan" }
  },
  "لبنان": {
    en: "Lebanon",
    cities: { "بيروت": "Beirut", "طرابلس": "Tripoli", "صيدا": "Sidon" }
  },
  "العراق": {
    en: "Iraq",
    cities: { "بغداد": "Baghdad", "الموصل": "Mosul", "البصرة": "Basra", "أربيل": "Erbil" }
  },
  "المغرب": {
    en: "Morocco",
    cities: { "الرباط": "Rabat", "الدار البيضاء": "Casablanca", "مراكش": "Marrakech", "فاس": "Fes" }
  },
  "تونس": {
    en: "Tunisia",
    cities: { "تونس": "Tunis", "صفاقس": "Sfax", "سوسة": "Sousse" }
  },
  "الجزائر": {
    en: "Algeria",
    cities: { "الجزائر العاصمة": "Algiers", "وهران": "Oran", "قسنطينة": "Constantine" }
  }
};

const PrayerTimes = () => {
  const [timings, setTimings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // الحالة للموقع المختار (نحفظ الأسماء بالعربي وبالإنجليزي)
  const [selection, setSelection] = useState({
    countryAr: localStorage.getItem('p_countryAr') || "السعودية",
    cityAr: localStorage.getItem('p_cityAr') || "مكة المكرمة",
    countryEn: localStorage.getItem('p_countryEn') || "Saudi Arabia",
    cityEn: localStorage.getItem('p_cityEn') || "Makkah"
  });

  useEffect(() => {
    const fetchTimings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${selection.cityEn}&country=${selection.countryEn}&method=4`
        );
        const data = await response.json();
        if (data.code === 200) {
          setTimings(data.data.timings);
        } else {
          setError('تعذر العثور على أوقات الصلاة.');
        }
      } catch (err) {
        setError('خطأ في الاتصال بالشبكة.');
      } finally {
        setLoading(false);
      }
    };
    fetchTimings();
  }, [selection.cityEn, selection.countryEn]);

  const handleCountryChange = (e) => {
    const countryAr = e.target.value;
    const countryEn = locationData[countryAr].en;
    const firstCityAr = Object.keys(locationData[countryAr].cities)[0];
    const firstCityEn = locationData[countryAr].cities[firstCityAr];

    setSelection({ countryAr, countryEn, cityAr: firstCityAr, cityEn: firstCityEn });
  };

  const handleCityChange = (e) => {
    const cityAr = e.target.value;
    const cityEn = locationData[selection.countryAr].cities[cityAr];
    setSelection({ ...selection, cityAr, cityEn });
  };

  const saveLocation = () => {
    localStorage.setItem('p_countryAr', selection.countryAr);
    localStorage.setItem('p_cityAr', selection.cityAr);
    localStorage.setItem('p_countryEn', selection.countryEn);
    localStorage.setItem('p_cityEn', selection.cityEn);
    setIsEditing(false);
  };

  const dayNames = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };

  return (
    <div className="card" style={{ padding: 'clamp(0.75rem, 3vw, 1.5rem)', marginBottom: '2rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Gradient Line */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))' }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, color: 'var(--primary-color)', fontSize: 'clamp(1rem, 4vw, 1.25rem)', fontWeight: 'bold' }}>
          مواقيت الصلاة في {selection.cityAr}
        </h3>
        <button onClick={() => setIsEditing(!isEditing)} className="btn" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary-color)', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
          {isEditing ? 'إغلاق' : 'تغيير المدينة'}
        </button>
      </div>

      {isEditing && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '10px', marginBottom: '1.25rem', display: 'flex', gap: '10px', flexWrap: 'wrap', border: '1px solid var(--border-color)' }}>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: '600' }}>الدولة</label>
            <select className="form-control" style={{ fontSize: '0.85rem', padding: '0.5rem' }} value={selection.countryAr} onChange={handleCountryChange}>
              {Object.keys(locationData).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', fontWeight: '600' }}>المدينة</label>
            <select className="form-control" style={{ fontSize: '0.85rem', padding: '0.5rem' }} value={selection.cityAr} onChange={handleCityChange}>
              {Object.keys(locationData[selection.countryAr].cities).map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          <button onClick={saveLocation} className="btn btn-primary" style={{ alignSelf: 'flex-end', height: '36px', fontSize: '0.85rem', padding: '0 1rem' }}>تثبيت</button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>جاري التحميل...</div>
      ) : error ? (
        <p style={{ color: 'var(--danger-color)', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
          {Object.entries(dayNames).map(([key, label]) => (
            <div key={key} style={{
              padding: '0.5rem 0.25rem',
              textAlign: 'center',
              background: 'linear-gradient(to bottom, var(--surface-color), var(--bg-color))',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
              transition: 'all 0.3s'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>{label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{timings[key]}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
        توقيت {selection.countryAr} المحلي
      </div>
    </div>
  );
};

export default PrayerTimes;
