import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ===== HELPERS =====
const getToday = () => new Date().toISOString().split('T')[0];

const loadState = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const saveState = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ===== DEFAULT TASKS =====
const DEFAULT_TASKS = [
  { id: 1, text: 'صلاة الفجر في وقتها', icon: '🌅', category: 'صلاة' },
  { id: 2, text: 'أذكار الصباح', icon: '📿', category: 'ذكر' },
  { id: 3, text: 'ورد القرآن اليومي', icon: '📖', category: 'قرآن' },
  { id: 4, text: 'صلاة الظهر في وقتها', icon: '☀️', category: 'صلاة' },
  { id: 5, text: 'صلاة العصر في وقتها', icon: '🌤️', category: 'صلاة' },
  { id: 6, text: 'صلاة المغرب في وقتها', icon: '🌇', category: 'صلاة' },
  { id: 7, text: 'أذكار المساء', icon: '🌙', category: 'ذكر' },
  { id: 8, text: 'صلاة العشاء في وقتها', icon: '⭐', category: 'صلاة' },
  { id: 9, text: 'صلاة الوتر', icon: '✨', category: 'صلاة' },
  { id: 10, text: 'الاستغفار (100 مرة)', icon: '💎', category: 'ذكر' },
];

const BADGES = [
  { id: 'first_day', label: 'الخطوة الأولى', icon: '🌱', desc: 'أكمل يوماً واحداً', req: 1 },
  { id: 'week', label: 'المداوم', icon: '🔥', desc: 'أكمل 7 أيام متتالية', req: 7 },
  { id: 'two_weeks', label: 'العابد', icon: '⭐', desc: 'أكمل 14 يوماً متتالياً', req: 14 },
  { id: 'month', label: 'المجاهد', icon: '🏆', desc: 'أكمل 30 يوماً متتالياً', req: 30 },
];

// ===== PROFILE PAGE =====
const Profile = () => {
  const [activeTab, setActiveTab] = useState('planner');

  // --- Deen Planner State ---
  const [tasks, setTasks] = useState(() => {
    const saved = loadState('deen_tasks_v2', null);
    const date = loadState('deen_tasks_date_v2', '');
    if (saved && date === getToday()) return saved;
    return DEFAULT_TASKS.map(t => ({ ...t, done: false }));
  });

  const [streak, setStreak] = useState(() => loadState('deen_streak', 0));
  const [lastCompleteDay, setLastCompleteDay] = useState(() => loadState('deen_last_complete', ''));
  const [totalDays, setTotalDays] = useState(() => loadState('deen_total_days', 0));
  const [weekHistory, setWeekHistory] = useState(() => loadState('deen_week_history', []));

  // --- Favorites State ---
  const [favIds] = useState(() => loadState('fav_articles', []));
  const [favArticles, setFavArticles] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  // --- Username ---
  const [username, setUsername] = useState(() => loadState('profile_name', ''));
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  // Fetch favorite articles
  useEffect(() => {
    if (favIds.length === 0) return;
    setFavLoading(true);
    axios.get('/api/articles')
      .then(res => setFavArticles(res.data.filter(a => favIds.includes(a._id))))
      .catch(console.error)
      .finally(() => setFavLoading(false));
  }, []);

  // Save tasks daily
  useEffect(() => {
    saveState('deen_tasks_v2', tasks);
    saveState('deen_tasks_date_v2', getToday());

    // Check if all tasks done → update streak
    const allDone = tasks.every(t => t.done);
    if (allDone && lastCompleteDay !== getToday()) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      const newStreak = lastCompleteDay === yStr ? streak + 1 : 1;
      const newTotal = totalDays + 1;
      setStreak(newStreak);
      setTotalDays(newTotal);
      setLastCompleteDay(getToday());
      saveState('deen_streak', newStreak);
      saveState('deen_last_complete', getToday());
      saveState('deen_total_days', newTotal);

      // Update week history
      const hist = [...weekHistory, { date: getToday(), pct: 100 }].slice(-7);
      setWeekHistory(hist);
      saveState('deen_week_history', hist);
    }
  }, [tasks]);

  const toggleTask = (id) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
      // Save partial progress to week history
      const done = updated.filter(t => t.done).length;
      const pct = Math.round((done / updated.length) * 100);
      const existingIdx = weekHistory.findIndex(h => h.date === getToday());
      let hist;
      if (existingIdx >= 0) {
        hist = weekHistory.map((h, i) => i === existingIdx ? { ...h, pct } : h);
      } else {
        hist = [...weekHistory, { date: getToday(), pct }].slice(-7);
      }
      setWeekHistory(hist);
      saveState('deen_week_history', hist);
      return updated;
    });
    if (window.navigator.vibrate) window.navigator.vibrate(15);
  };

  const removeFav = (id) => {
    const newFavs = favIds.filter(f => f !== id);
    saveState('fav_articles', newFavs);
    setFavArticles(prev => prev.filter(a => a._id !== id));
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);
  const earnedBadges = BADGES.filter(b => totalDays >= b.req);
  const categories = [...new Set(DEFAULT_TASKS.map(t => t.category))];

  const tabs = [
    { id: 'planner', label: 'خطة الإيمان', icon: '🗓️' },
    { id: 'bookmarks', label: 'المفضلة', icon: '❤️' },
    { id: 'stats', label: 'إحصائياتي', icon: '📊' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container">

        {/* Profile Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-deep, #134e4a), var(--primary-color))',
          borderRadius: '1.5rem',
          padding: '2.5rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: '-30px', left: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: '-20px', right: '10%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          {/* Avatar */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', flexShrink: 0,
            border: '3px solid rgba(255,255,255,0.3)'
          }}>
            {username ? username[0].toUpperCase() : '👤'}
          </div>

          {/* Info */}
          <div style={{ flex: 1, zIndex: 1 }}>
            {editingName ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="أدخل اسمك..."
                  style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', color: 'white', outline: 'none', fontSize: '1rem', direction: 'rtl' }}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') { const n = tempName.trim() || 'مسلم'; saveState('profile_name', n); setUsername(n); setEditingName(false); }}}
                />
                <button onClick={() => { const n = tempName.trim() || 'مسلم'; saveState('profile_name', n); setUsername(n); setEditingName(false); }}
                  style={{ background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1rem', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>حفظ</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                  {username || 'أخي المسلم'}
                </h2>
                <button onClick={() => { setTempName(username); setEditingName(true); }}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '0.4rem', padding: '0.2rem 0.6rem', color: 'white', cursor: 'pointer', fontSize: '0.75rem' }}>✏️ تعديل</button>
              </div>
            )}
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>رحلتك مع الله تستحق الاستمرار</p>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'flex', gap: '1.25rem', zIndex: 1, flexWrap: 'wrap' }}>
            {[
              { label: 'أيام متتالية', value: streak, icon: '🔥' },
              { label: 'إجمالي الأيام', value: totalDays, icon: '📅' },
              { label: 'الجوائز', value: earnedBadges.length, icon: '🏅' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '0.75rem 1.25rem', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', lineHeight: 1.2 }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--surface-color)', padding: '0.4rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '0.75rem 1rem', border: 'none', borderRadius: '0.75rem', cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
            }}>
              <span>{tab.icon}</span>
              <span style={{ display: 'none' }} className="tab-label-full">{tab.label}</span>
              <span className="tab-label-short" style={{ fontSize: '0.85rem' }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ====== DEEN PLANNER TAB ====== */}
        {activeTab === 'planner' && (
          <div>
            {/* Progress Banner */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'var(--surface-color)', borderRight: progressPct === 100 ? '5px solid #10b981' : '5px solid var(--primary-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{progressPct === 100 ? '🎉' : progressPct >= 50 ? '⚡' : '🌱'}</span>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>إنجاز يومك الإيماني</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {progressPct === 100 ? '🏆 يوم مكتمل! أسأل الله أن يتقبل منك' : `${completedCount} من ${tasks.length} مهام`}
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: progressPct === 100 ? '#10b981' : 'var(--primary-color)' }}>
                  {progressPct}%
                </span>
              </div>
              <div style={{ background: 'var(--border-color)', borderRadius: '2rem', height: '10px', overflow: 'hidden' }}>
                <div style={{
                  width: `${progressPct}%`, height: '100%', borderRadius: '2rem',
                  background: progressPct === 100 ? 'linear-gradient(to left, #10b981, #34d399)' : 'linear-gradient(to left, var(--primary-color), #34d399)',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            {/* Tasks By Category */}
            {categories.map(cat => {
              const catTasks = tasks.filter(t => t.category === cat);
              const catDone = catTasks.filter(t => t.done).length;
              return (
                <div key={cat} className="card" style={{ marginBottom: '1rem', overflow: 'hidden', background: 'var(--surface-color)' }}>
                  <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {cat === 'صلاة' ? '🕌' : cat === 'قرآن' ? '📖' : '📿'} {cat}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                      {catDone}/{catTasks.length}
                    </span>
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    {catTasks.map(task => (
                      <div key={task.id} onClick={() => toggleTask(task.id)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.65rem 0.75rem', borderRadius: '0.6rem', cursor: 'pointer',
                        background: task.done ? 'rgba(13,148,136,0.06)' : 'transparent',
                        transition: 'all 0.2s', marginBottom: '0.25rem'
                      }}>
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                          border: `2px solid ${task.done ? 'var(--primary-color)' : 'var(--border-color)'}`,
                          background: task.done ? 'var(--primary-color)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: '0.75rem', transition: 'all 0.2s'
                        }}>
                          {task.done && '✓'}
                        </div>
                        <span style={{ fontSize: '0.95rem' }}>{task.icon}</span>
                        <span style={{
                          fontSize: '0.9rem', color: task.done ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: task.done ? 'line-through' : 'none', flex: 1
                        }}>{task.text}</span>
                        {task.done && <span style={{ color: '#10b981', fontSize: '0.8rem' }}>✅</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Streak Card */}
            {streak > 0 && (
              <div className="card fade-up" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.05))', border: '1px solid rgba(245,158,11,0.3)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔥</div>
                <h3 style={{ color: '#d97706', margin: '0 0 0.25rem 0' }}>{streak} أيام متتالية!</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.85rem' }}>
                  {streak >= 30 ? 'سبحان الله — أنت من المداومين على الخير!' :
                   streak >= 7 ? '«أحب الأعمال إلى الله أدومها وإن قَلَّ»' :
                   'استمر! كل يوم تُكمله يُقربك من الله أكثر'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ====== BOOKMARKS TAB ====== */}
        {activeTab === 'bookmarks' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>❤️ مقالاتي المحفوظة</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{favArticles.length} مقال</span>
            </div>

            {favLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                ⏳ جاري التحميل...
              </div>
            ) : favArticles.length === 0 ? (
              <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📑</div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>لا توجد مقالات محفوظة بعد</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>اضغط على أيقونة القلب ❤️ في أي مقال لحفظه هنا</p>
                <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>تصفح المقالات</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {favArticles.map(article => (
                  <div key={article._id} className="card" style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-color)', overflow: 'hidden' }}>
                    {article.imageUrl && (
                      <div style={{ height: '160px', overflow: 'hidden' }}>
                        <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                      </div>
                    )}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary-color)', fontWeight: 'bold', background: 'rgba(13,148,136,0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>{article.category}</span>
                        <button onClick={() => removeFav(article._id)} title="إزالة من المفضلة"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1.1rem', lineHeight: 1 }}>🗑️</button>
                      </div>
                      <Link to={`/article/${article.slug || article._id}`} style={{ textDecoration: 'none', flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.title}
                        </h3>
                      </Link>
                      <Link to={`/article/${article.slug || article._id}`} style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.875rem', textDecoration: 'none', marginTop: 'auto' }}>
                        قراءة المقال ←
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====== STATS TAB ====== */}
        {activeTab === 'stats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Week Chart */}
            <div className="card" style={{ padding: '1.75rem', background: 'var(--surface-color)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>📈 إنجاز آخر 7 أيام</h3>
              <div style={{ display: 'flex', align: 'flex-end', gap: '0.5rem', height: '120px', alignItems: 'flex-end' }}>
                {weekHistory.length > 0 ? weekHistory.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{h.pct}%</span>
                    <div style={{
                      width: '100%',
                      height: `${Math.max(8, h.pct)}%`,
                      background: h.pct === 100 ? 'linear-gradient(to top, #0d9488, #34d399)' : h.pct >= 50 ? '#f59e0b' : 'var(--border-color)',
                      borderRadius: '0.4rem 0.4rem 0 0',
                      transition: 'height 0.5s ease'
                    }} />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {new Date(h.date).toLocaleDateString('ar', { weekday: 'short' })}
                    </span>
                  </div>
                )) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                    ابدأ رحلتك اليوم<br />وستظهر هنا إحصائياتك!
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'سلسلة حالية', value: streak, icon: '🔥', color: '#f59e0b' },
                { label: 'إجمالي أيام', value: totalDays, icon: '📅', color: '#0d9488' },
                { label: 'مقالات محفوظة', value: favIds.length, icon: '❤️', color: '#db2777' },
                { label: 'جوائز مكتسبة', value: earnedBadges.length, icon: '🏅', color: '#7c3aed' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center', background: 'var(--surface-color)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="card" style={{ padding: '1.75rem', background: 'var(--surface-color)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>🏅 جوائزك الإيمانية</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem' }}>
                {BADGES.map(badge => {
                  const earned = totalDays >= badge.req;
                  return (
                    <div key={badge.id} style={{
                      padding: '1.25rem', borderRadius: '1rem', textAlign: 'center',
                      background: earned ? 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(52,211,153,0.1))' : 'var(--bg-color)',
                      border: `2px solid ${earned ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      opacity: earned ? 1 : 0.5, transition: 'all 0.3s'
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', filter: earned ? 'none' : 'grayscale(1)' }}>{badge.icon}</div>
                      <div style={{ fontWeight: 'bold', color: earned ? 'var(--primary-color)' : 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{badge.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{badge.desc}</div>
                      {!earned && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 'bold' }}>
                          تبقى {badge.req - totalDays} أيام
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(13,148,136,0.05), rgba(99,102,241,0.05))', border: '1px solid rgba(13,148,136,0.2)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💎</div>
              <blockquote style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.8, fontStyle: 'italic', borderRight: '4px solid var(--primary-color)', paddingRight: '1rem' }}>
                «أحبُّ الأعمالِ إلى اللهِ أدومُها وإن قَلَّ»
              </blockquote>
              <p style={{ margin: '1rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>صحيح البخاري ومسلم</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
