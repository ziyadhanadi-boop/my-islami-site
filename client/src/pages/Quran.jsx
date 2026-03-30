import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const Quran = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [khatmah, setKhatmah] = useState(JSON.parse(localStorage.getItem('khatmah_progress')) || null);

  useEffect(() => {
    // Add Mushaf font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Fetch Surahs
    const fetchSurahs = async () => {
      try {
        const res = await axios.get('https://api.alquran.cloud/v1/surah');
        setSurahs(res.data.data);
      } catch (error) {
        console.error('Error fetching surahs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const handleSurahSelect = async (number) => {
    setLoadingAyahs(true);
    try {
      const res = await axios.get(`https://api.alquran.cloud/v1/surah/${number}`);
      setSelectedSurah(res.data.data);
      setAyahs(res.data.data.ayahs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching ayahs', error);
    } finally {
      setLoadingAyahs(false);
    }
  };

  const handleSaveKhatmah = (ayah) => {
    const data = {
      surahNumber: selectedSurah.number,
      surahName: selectedSurah.name,
      ayahNumber: ayah.numberInSurah,
      totalAyahsForSurah: selectedSurah.numberOfAyahs,
      timestamp: Date.now()
    };
    setKhatmah(data);
    localStorage.setItem('khatmah_progress', JSON.stringify(data));
  };

  if (loading) return <Loader message="جاري جلب قائمة السور..." />;

  // Quick jump if returning user
  const jumpToKhatmah = () => {
    if (khatmah) handleSurahSelect(khatmah.surahNumber);
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>📖 المصحف الإلكتروني</h1>
        <p style={{ color: 'var(--text-secondary)' }}>قراءة القرآن الكريم بتنسيق مريح للعين - نظام متابعة الختمة</p>
      </div>

      {khatmah && !selectedSurah && (
        <div style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))', padding: '1.5rem', borderRadius: '1rem', color: 'white', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 25px rgba(13,148,136,0.2)' }} className="fade-up">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📍 تقدم ختمتك الحالية</h3>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>توقفت عند: سورة {khatmah.surahName} - آية {khatmah.ayahNumber}</p>
          </div>
          <button onClick={jumpToKhatmah} style={{ background: 'white', color: 'var(--primary-color)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '2rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            استئناف القراءة
          </button>
        </div>
      )}

      <div className="quran-main-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: selectedSurah ? '1fr 3fr' : '1fr', 
        gap: '2rem', 
        minHeight: '80vh' 
      }}>
        <style>{`
          @media (max-width: 992px) {
            .quran-main-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
            .surah-sidebar { height: 300px !important; margin-bottom: 1rem !important; }
            .ayahs-display { padding: 1.25rem !important; }
            .ayah-text { font-size: 1.7rem !important; line-height: 2.8 !important; }
          }
        `}</style>
        
        {/* Surah List Sidebar */}
        <div className="surah-sidebar" style={{ 
          height: '80vh', 
          overflowY: 'auto', 
          backgroundColor: 'var(--surface-color)', 
          borderRadius: '1.25rem', 
          padding: '1.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary-color)' }}>السور</h3>
          {surahs.map(s => (
            <div 
              key={s.number} 
              onClick={() => handleSurahSelect(s.number)}
              style={{ 
                padding: '0.9rem 1rem', 
                borderRadius: '0.75rem', 
                cursor: 'pointer', 
                marginBottom: '0.5rem',
                backgroundColor: selectedSurah?.number === s.number ? 'var(--primary-color)' : 'transparent',
                color: selectedSurah?.number === s.number ? 'white' : 'var(--text-primary)',
                transition: '0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                direction: 'rtl'
              }}
              className="hover:translate-x-[-5px]"
            >
              <span>{s.number}. {s.name}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{s.numberOfAyahs} آية</span>
            </div>
          ))}
        </div>

        {/* Ayahs Display Area */}
        <div className="ayahs-display" style={{ 
          backgroundColor: 'var(--surface-color)', 
          borderRadius: '1.25rem', 
          padding: '2.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {selectedSurah ? (
            <div className="fade-up">
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>{selectedSurah.name}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{selectedSurah.englishNameTranslation} • {selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</p>
                {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                   <h3 style={{ marginTop: '2.5rem', fontSize: '1.75rem', fontFamily: 'var(--font-heading)' }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</h3>
                )}
              </div>

              {loadingAyahs ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader message="جاري جلب الآيات..." /></div>
               ) : (
                <div className="ayah-text" style={{ 
                  fontSize: '2.2rem', 
                  lineHeight: '3.5', 
                  textAlign: 'justify', 
                  direction: 'rtl',
                  fontFamily: "'Amiri', serif",
                  padding: '1rem'
                }}>
                  {ayahs.map(ayah => {
                    const isBookmarked = khatmah?.surahNumber === selectedSurah.number && khatmah?.ayahNumber === ayah.numberInSurah;
                    return (
                      <span key={ayah.number}>
                        {ayah.text.replace('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', '')} 
                        <span style={{ 
                          display: 'inline-flex', 
                          width: '32px', 
                          height: '32px', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          background: 'var(--bg-color)', 
                          border: '1px solid var(--primary-color)', 
                          borderRadius: '50%', 
                          fontSize: '0.9rem', 
                          margin: '0 0.25rem 0 0.75rem',
                          fontWeight: 'bold',
                          color: 'var(--primary-color)'
                        }}>
                          {ayah.numberInSurah}
                        </span>
                        <button 
                          onClick={() => handleSaveKhatmah(ayah)} 
                          title={isBookmarked ? 'هذه علامتك الحالية' : 'حفظ كعلامة توقف للختمة'}
                          style={{ 
                            background: isBookmarked ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                            border: isBookmarked ? '1px solid var(--primary-color)' : '1px solid transparent',
                            borderRadius: '50%',
                            width: '35px', height: '35px',
                            cursor: 'pointer', 
                            fontSize: '1rem',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            color: isBookmarked ? 'var(--primary-color)' : 'var(--text-muted)',
                            marginLeft: '0.5rem',
                            transition: 'all 0.2s',
                            verticalAlign: 'middle',
                            position: 'relative', top: '-5px'
                          }}
                          className={!isBookmarked ? "ayah-bookmark-btn" : ""}
                        >
                          {isBookmarked ? '📍' : '🔖'}
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
               <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📖</div>
               <p style={{ fontSize: '1.25rem' }}>يرجى اختيار سورة من القائمة للبدء في القراءة</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .ayah-bookmark-btn { opacity: 0.3; }
        .ayah-bookmark-btn:hover { opacity: 1; transform: scale(1.1); background: rgba(13, 148, 136, 0.05) !important; color: var(--primary-color) !important; }
      `}</style>
    </div>
  );
};

export default Quran;
