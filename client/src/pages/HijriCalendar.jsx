import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HijriCalendar = () => {
  const [date, setDate] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await axios.get(`https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`);
        setCalendar(res.data.data);
      } catch (error) {
        console.error('Error fetching Hijri calendar', error);
      }
    };
    fetchCalendar();
  }, [month, year]);

  const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '900px' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>🗓️ التقويم الهجري والميلادي</h1>
        <p style={{ color: 'var(--text-secondary)' }}>تتبع التاريخ الهجري والمناسبات الإسلامية الهامة</p>
      </header>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
           <button className="btn btn-outline" onClick={() => setMonth(m => m === 1 ? 12 : m - 1)}>&rarr; الشهر السابق</button>
           <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>{calendar[0]?.hijri.month.ar} {calendar[0]?.hijri.year} هـ</h2>
           <button className="btn btn-outline" onClick={() => setMonth(m => m === 12 ? 1 : m + 1)}>الشهر القادم &larr;</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
           {daysOfWeek.map(day => (
             <div key={day} style={{ fontWeight: 'bold', padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.5rem' }}>{day}</div>
           ))}
           {calendar.map((day, idx) => (
             <div key={idx} style={{ 
               padding: '1.5rem 0.5rem', 
               border: '1px solid var(--border-color)', 
               borderRadius: '0.5rem',
               backgroundColor: day.gregorian.day === new Date().getDate().toString() && month === (new Date().getMonth() + 1) ? 'var(--primary-color)' : 'transparent',
               color: day.gregorian.day === new Date().getDate().toString() && month === (new Date().getMonth() + 1) ? 'white' : 'inherit'
             }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{day.hijri.day}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{day.gregorian.day} {day.gregorian.month.en}</div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default HijriCalendar;
