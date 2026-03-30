import React, { useState } from 'react';

const QuranPlayer = () => {
  const [activeSurah, setActiveSurah] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const surahs = [
    { name: "سورة الفاتحة", url: "https://server8.mp3quran.net/afs/001.mp3" },
    { name: "سورة الكهف", url: "https://server8.mp3quran.net/afs/018.mp3" },
    { name: "سورة يس", url: "https://server8.mp3quran.net/afs/036.mp3" },
    { name: "سورة الملك", url: "https://server8.mp3quran.net/afs/067.mp3" },
    { name: "سورة الإخلاص", url: "https://server8.mp3quran.net/afs/112.mp3" },
    { name: "سورة الفلق", url: "https://server8.mp3quran.net/afs/113.mp3" },
    { name: "سورة الناس", url: "https://server8.mp3quran.net/afs/114.mp3" }
  ];

  return (
    <div className="card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center', backgroundColor: 'var(--surface-color)', border: '1px solid #7c3aed' }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#7c3aed' }}>المصحف المرتل</h3>
      
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>{surahs[activeSurah].name}</p>
        <audio 
          src={surahs[activeSurah].url} 
          controls 
          style={{ width: '100%', borderRadius: '1rem', backgroundColor: '#f1f5f9' }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        {surahs.map((surah, index) => (
          <button 
            key={index} 
            onClick={() => setActiveSurah(index)}
            className="btn"
            style={{ 
              fontSize: '0.85rem', 
              padding: '0.4rem 0.75rem', 
              backgroundColor: activeSurah === index ? '#7c3aed' : 'var(--bg-color)', 
              color: activeSurah === index ? 'white' : 'var(--text-primary)',
              border: '1px solid #7c3aed'
            }}
          >
            {surah.name}
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        بصوت القارئ: مشاري راشد العفاسي
      </div>
    </div>
  );
};

export default QuranPlayer;
