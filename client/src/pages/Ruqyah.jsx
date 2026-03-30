import React, { useEffect, useState } from 'react';

const ruqyahData = [
  {
    topic: "الرقية من القرآن الكريم",
    items: [
      { text: "الفاتحة (تُقرأ 7 مرات):\n«بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ * الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ * الرَّحْمَنِ الرَّحِيمِ * مَالِكِ يَوْمِ الدِّينِ * إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ * اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ * صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ»", number: 7 },
      { text: "آية الكرسي:\n«اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ»", number: 1 },
      { text: "خواتيم سورة البقرة:\n«آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ...»", number: 1 },
      { text: "الإخلاص والفلق والناس (تُقرأ 3 مرات)", number: 3 },
    ]
  },
  {
    topic: "الرقية من السنة النبوية",
    items: [
      { text: "«أعوذ بكلمات الله التامات من شر ما خلق»", number: 3 },
      { text: "«بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم»", number: 3 },
      { text: "«أعوذ بكلمات الله التامة، من كل شيطان وهامة، ومن كل عين لامة»", number: 3 },
      { text: "يضع يده على موضع الألم ويقول:\n«بسم الله (3 مرات)، أعوذ بالله وقدرته من شر ما أجد وأحاذر (7 مرات)»", number: 1 },
      { text: "«اللهم رب الناس، أذهب الباس، اشف أنت الشافي، لا شفاء إلا شفاؤك، شفاءً لا يُغادر سقماً»", number: 7 }
    ]
  }
];

const Ruqyah = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f766e, #064e3b)', 
        borderRadius: '1.5rem', 
        padding: '3rem 2rem', 
        color: 'white', 
        marginBottom: '3rem', 
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(6, 78, 59, 0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>🛡️ الرقية الشرعية</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
          حصن نفسك وأهلك بكلام الله وسنة نبيه ﷺ. الرقية الشرعية نافعة للعين، السحر، الحسد، والأمراض العضوية والنفسية.
        </p>
      </div>

      {/* Intro & Rules */}
      <div className="card" style={{ padding: '2rem', marginBottom: '3rem', borderLeft: '4px solid #f59e0b' }}>
        <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>💡 شروط الانتفاع بالرقية</h3>
        <ul style={{ listStyleType: 'disc', paddingRight: '1.5rem', lineHeight: '2', color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          <li>اليقين التام بأن الشافي هو الله وحده، وأن الرقية مجرد سبب.</li>
          <li>أن تكون الرقية بكلام الله تعالى وأسمائه وصفاته وما ورد في السنة.</li>
          <li>أن تقرأ بصوت مسموع وبتدبر ويقين بحضور القلب.</li>
          <li>يمكن القراءة في كفين والنفث (النفخ مع قليل من الريق) ومسح الجسد، أو القراءة في ماء وشربه.</li>
        </ul>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {ruqyahData.map((section, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className="btn"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: activeTab === index ? 'var(--primary-color)' : 'var(--bg-color)',
              color: activeTab === index ? 'white' : 'var(--text-primary)',
              border: `1px solid ${activeTab === index ? 'var(--primary-color)' : 'var(--border-color)'}`,
              borderRadius: '2rem',
              fontWeight: 'bold',
              fontSize: '1.05rem',
              flex: '1 1 auto',
            }}
          >
            {section.topic}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {ruqyahData[activeTab].items.map((item, idx) => (
          <div key={idx} className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, right: 0, 
              backgroundColor: 'rgba(13, 148, 136, 0.1)', 
              color: 'var(--primary-dark)', 
              padding: '0.4rem 1rem', 
              borderBottomLeftRadius: '1rem',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              التكرار {item.number}
            </div>
            
            <p style={{ 
              fontSize: '1.4rem', 
              lineHeight: '2.2', 
              fontFamily: 'var(--font-heading)', 
              color: 'var(--text-primary)',
              whiteSpace: 'pre-line',
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Ruqyah;
