import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, ArcElement, Filler
);

const AdminAnalytics = ({ khatmahStats }) => {
  const [weekly, setWeekly] = useState(null);
  const [countries, setCountries] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const headers = { 'x-auth-token': token };

    Promise.all([
      axios.get('/api/analytics/weekly', { headers }),
      axios.get('/api/analytics/countries', { headers }),
      axios.get('/api/analytics/overview', { headers })
    ]).then(([w, c, o]) => {
      setWeekly(w.data);
      setCountries(c.data);
      setOverview(o.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartColors = {
    primary: 'rgba(13, 148, 136, 0.8)',
    primaryBorder: 'rgb(13, 148, 136)',
    grid: 'rgba(255,255,255,0.05)',
  };

  const weeklyChartData = weekly ? {
    labels: weekly.labels,
    datasets: [{
      label: 'عدد الزيارات',
      data: weekly.data,
      backgroundColor: weekly.data.map((_, i) =>
        i === weekly.data.length - 1 ? 'rgba(13, 148, 136, 0.9)' : 'rgba(13, 148, 136, 0.4)'
      ),
      borderColor: chartColors.primaryBorder,
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  } : null;

  const countryChartData = countries.length > 0 ? {
    labels: countries.map(c => c.country),
    datasets: [{
      data: countries.map(c => c.total),
      backgroundColor: [
        '#0d9488', '#0891b2', '#7c3aed', '#db2777',
        '#ea580c', '#65a30d', '#d97706', '#dc2626'
      ],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  } : null;

  // Khatmah doughnut
  const khatmahData = khatmahStats ? {
    labels: ['مكتملة', 'الهدف المتبقي'],
    datasets: [{
      data: [
        khatmahStats.current_completion_count || 0,
        Math.max(0, (khatmahStats.target || 100) - (khatmahStats.current_completion_count || 0))
      ],
      backgroundColor: ['#0d9488', 'rgba(255,255,255,0.06)'],
      borderColor: ['#0d9488', 'rgba(255,255,255,0.1)'],
      borderWidth: 2,
    }]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#0d9488',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { color: chartColors.grid },
        ticks: { color: 'var(--text-secondary)', font: { family: 'var(--font-body)' } }
      },
      y: {
        grid: { color: chartColors.grid },
        ticks: { color: 'var(--text-secondary)', stepSize: 1 },
        beginAtZero: true,
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'var(--text-secondary)', padding: 16, font: { size: 12 } }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#0d9488',
        bodyColor: '#fff',
        padding: 12,
      }
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
      جاري تحميل الإحصائيات...
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '4px solid #0d9488', background: 'var(--surface-color)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>📅</div>
          <h3 style={{ fontSize: '2rem', color: '#0d9488', margin: '0.25rem 0' }}>{overview?.todayViews || 0}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>زيارات اليوم</p>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '4px solid #7c3aed', background: 'var(--surface-color)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🌍</div>
          <h3 style={{ fontSize: '2rem', color: '#7c3aed', margin: '0.25rem 0' }}>{overview?.totalViews?.toLocaleString() || 0}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>إجمالي الزيارات</p>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '4px solid #f59e0b', background: 'var(--surface-color)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>📈</div>
          <h3 style={{ fontSize: '2rem', color: '#f59e0b', margin: '0.25rem 0' }}>{weekly?.totalThisWeek || 0}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>هذا الأسبوع</p>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '4px solid #10b981', background: 'var(--surface-color)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🌐</div>
          <h3 style={{ fontSize: '2rem', color: '#10b981', margin: '0.25rem 0' }}>{countries.length}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>دول مختلفة</p>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>

        {/* Weekly Bar Chart */}
        <div className="card" style={{ padding: '1.75rem', background: 'var(--surface-color)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            📊 الزيارات خلال الأسبوع
            {weekly && <span style={{ marginRight: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-color)', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>{weekly.totalThisWeek} زيارة</span>}
          </h3>
          <div style={{ height: '260px' }}>
            {weeklyChartData ? (
              <Bar data={weeklyChartData} options={chartOptions} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                لا توجد بيانات بعد — ستُجمع تلقائياً مع الزيارات
              </div>
            )}
          </div>
        </div>

        {/* Countries Doughnut */}
        <div className="card" style={{ padding: '1.75rem', background: 'var(--surface-color)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            🌍 أكثر الدول تفاعلاً
          </h3>
          <div style={{ height: '220px' }}>
            {countryChartData ? (
              <Doughnut data={countryChartData} options={doughnutOptions} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                🌍<br/>ستظهر الدول<br/>مع تراكم الزيارات
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Countries Breakdown Table */}
      {countries.length > 0 && (
        <div className="card" style={{ padding: '1.75rem', background: 'var(--surface-color)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>🗺️ تفاصيل الدول العربية</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {countries.map((c, i) => {
              const max = countries[0].total;
              const pct = Math.round((c.total / max) * 100);
              const colors = ['#0d9488', '#7c3aed', '#f59e0b', '#10b981', '#db2777', '#0891b2', '#ea580c', '#65a30d'];
              return (
                <div key={c.country} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{c.country}</span>
                    <span style={{ fontWeight: 'bold', color: colors[i], fontSize: '0.9rem' }}>{c.total.toLocaleString()}</span>
                  </div>
                  <div style={{ background: 'var(--border-color)', borderRadius: '2rem', height: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: colors[i], borderRadius: '2rem', transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Khatmah Stats */}
      {khatmahStats && khatmahData && (
        <div className="card" style={{ padding: '1.75rem', background: 'var(--surface-color)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>📖 إحصائيات الختمة الجماعية</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', alignItems: 'center' }}>
            <div style={{ height: '200px', position: 'relative' }}>
              <Doughnut data={khatmahData} options={{ ...doughnutOptions, plugins: { ...doughnutOptions.plugins, legend: { display: false } } }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0d9488' }}>{khatmahStats.current_completion_count || 0}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>مكتمل</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>الأجزاء المكتملة</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0d9488' }}>{khatmahStats.current_completion_count || 0} / {khatmahStats.target || 30}</div>
              </div>
              <div style={{ background: 'var(--bg-color)', borderRadius: '1rem', height: '12px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, ((khatmahStats.current_completion_count || 0) / (khatmahStats.target || 30)) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(to left, #0d9488, #34d399)',
                  borderRadius: '1rem',
                  transition: 'width 1.5s ease'
                }} />
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>المشتركون</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{khatmahStats.total_participants || 0}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>نسبة الإنجاز</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {Math.round(((khatmahStats.current_completion_count || 0) / (khatmahStats.target || 30)) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
