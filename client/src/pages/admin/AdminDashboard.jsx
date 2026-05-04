import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';
import AdminKhatmah from './AdminKhatmah';
import AdminEvents from './AdminEvents';
import AdminAnalytics from '../../components/AdminAnalytics';

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [overviewStats, setOverviewStats] = useState(null);
  const [isDark, setIsDark] = useState(document.body.classList.contains('dark'));
  const [selectedMessage, setSelectedMessage] = useState(null); // For answering modal
  const [answerDraft, setAnswerDraft] = useState('');
  const [categoryDraft, setCategoryDraft] = useState('عام');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();
  const location = useLocation();
  
  const params = new URLSearchParams(location.search);
  const activeTab = params.get('tab') || 'overview';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'overview') {
           const [arts, ziks, meds, hads, msgs, khats] = await Promise.all([
             axios.get(`/api/articles?admin=true&t=${Date.now()}`, { headers: { 'x-auth-token': token } }),
             axios.get(`/api/zikr?admin=true&t=${Date.now()}`, { headers: { 'x-auth-token': token } }),
             axios.get(`/api/media?admin=true&t=${Date.now()}`, { headers: { 'x-auth-token': token } }),
             axios.get(`/api/hadith?admin=true&t=${Date.now()}`, { headers: { 'x-auth-token': token } }),
             axios.get(`/api/messages?t=${Date.now()}`, { headers: { 'x-auth-token': token } }),
             axios.get(`/api/khatmah/stats`)
           ]);
           setOverviewStats({
             articles: arts.data.length,
             views: arts.data.reduce((sum, a) => sum + (a.views || 0), 0),
             zikr: ziks.data.length,
             media: meds.data.length,
             hadith: hads.data.length,
             messages: msgs.data.length,
             khatmah: khats.data.current_completion_count,
             topArticles: arts.data.sort((a,b) => (b.views||0) - (a.views||0)).slice(0, 4)
           });
           setData([]);
        } else {
          let endpoint = '/api/articles';
          if (activeTab === 'zikr') endpoint = '/api/zikr';
          if (activeTab === 'media') endpoint = '/api/media';
          if (activeTab === 'hadith') endpoint = '/api/hadith';
          if (activeTab === 'messages') endpoint = '/api/messages';
          if (activeTab === 'books') endpoint = '/api/books';
          if (activeTab === 'videosList') endpoint = '/api/videosList';
          if (activeTab === 'quizzes') endpoint = '/api/quizzes';
          if (activeTab === 'fatwaArchive') endpoint = '/api/fatwaArchive';
          if (activeTab === 'kidContent') endpoint = '/api/kidContent';
          if (activeTab === 'events') endpoint = '/api/events';
          if (activeTab === 'duas') endpoint = '/api/duas';
          if (activeTab === 'prophetStories') endpoint = '/api/prophet-stories';
          if (activeTab === 'tibb') endpoint = '/api/tibb';
          if (activeTab === 'podcasts') endpoint = '/api/podcasts';
          if (activeTab === 'dailyQuotes') endpoint = '/api/daily-quotes';

          const res = await axios.get(`${endpoint}?admin=true&t=${Date.now()}`, {
            headers: { 'x-auth-token': token }
          });
          setData(res.data);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setSearchQuery(''); 
    setFilterCategory('');
    setCurrentPage(1);
  }, [navigate, activeTab]);

  const getTabApiInfo = (tab) => {
    switch (tab) {
      case 'prophetStories': return { base: '/api/prophet-stories', hasToggle: true };
      case 'duas': return { base: '/api/duas', hasToggle: true };
      case 'tibb': return { base: '/api/tibb', hasToggle: true };
      case 'podcasts': return { base: '/api/podcasts', hasToggle: true };
      case 'articles': return { base: '/api/articles', hasToggle: true };
      case 'dailyQuotes': return { base: '/api/daily-quotes', hasToggle: true };
      case 'zikr': return { base: '/api/zikr', hasToggle: false };
      case 'hadith': return { base: '/api/hadith', hasToggle: false };
      case 'media': return { base: '/api/media', hasToggle: false };
      default: return { base: `/api/${tab}`, hasToggle: false };
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        const token = localStorage.getItem('adminToken');
        const { base } = getTabApiInfo(activeTab);
        
        await axios.delete(`${base}/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setData(data.filter(item => item._id !== id));
        if (currentData.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
      } catch (error) {
        console.error('Error deleting', error);
        alert('حدث خطأ أثناء الحذف: ' + (error.response?.data?.msg || error.message));
      }
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const { base, hasToggle } = getTabApiInfo(activeTab);
      const item = data.find(i => i._id === id);
      const updatedHidden = !item.isHidden;

      let res;
      if (hasToggle) {
        res = await axios.put(`${base}/${id}/toggle-visibility`, {}, {
          headers: { 'x-auth-token': token }
        });
      } else {
        res = await axios.put(`${base}/${id}`, { isHidden: updatedHidden }, {
          headers: { 'x-auth-token': token }
        });
      }
      
      setData(data.map(i => i._id === id ? res.data : i));
    } catch (error) {
      console.error('Error toggling visibility', error);
      alert('حدث خطأ أثناء الإخفاء/الإظهار: ' + (error.response?.data?.msg || error.message));
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.put(`/api/articles/${id}/toggle-featured`, {}, {
        headers: { 'x-auth-token': token }
      });
      setData(data.map(i => i._id === id ? res.data : i));
    } catch (error) {
       console.error(error);
       alert('حدث خطأ');
    }
  };

  const handleSetFeaturedPosition = async (id, pos) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.put(`/api/articles/${id}/featured-position`, { position: pos }, {
        headers: { 'x-auth-token': token }
      });
      setData(data.map(i => i._id === id ? res.data : i));
    } catch (error) {
      console.error(error);
      alert('حدث خطأ');
    }
  };

  const handleMarkAnswered = async (id, answer, category) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.put(`/api/messages/${id}/answer`, { answer, category }, {
        headers: { 'x-auth-token': token }
      });
      setData(data.map(i => i._id === id ? res.data : i));
      setSelectedMessage(null);
      setAnswerDraft('');
      setCategoryDraft('عام');
    } catch (error) {
      console.error('Error marking as answered', error);
      alert('حدث خطأ');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    const currentlyDark = document.body.classList.contains('dark');
    setIsDark(currentlyDark);
    localStorage.setItem('theme', currentlyDark ? 'dark' : 'light');
  };

  const renderTabHeader = () => {
    const tabs = [
      { id: 'overview', label: '📊 النظرة العامة' },
      { id: 'articles', label: '📝 المقالات' },
      { id: 'zikr', label: '📿 الأذكار' },
      { id: 'media', label: '🎧 الوسائط' },
      { id: 'hadith', label: '📜 الأحاديث' },
      { id: 'messages', label: '📨 طلبات الفتوى' },
      { id: 'books', label: '📚 المكتبة' },
      { id: 'videosList', label: '🎬 مرئيات' },
      { id: 'quizzes', label: '🎮 أسئلة' },
      { id: 'fatwaArchive', label: '⚖️ أرشيف الفتاوى' },
      { id: 'kidContent', label: '🧸 ركن الأطفال' },
      { id: 'events', label: '📍 الفعاليات' },
      { id: 'duas', label: '🤲 الأدعية' },
      { id: 'prophetStories', label: '📜 قصص الأنبياء' },
      { id: 'tibb', label: '🌿 الطب النبوي' },
      { id: 'podcasts', label: '🎙️ البودكاست' },
      { id: 'dailyQuotes', label: '✨ رسالة اليوم' },
      { id: 'khatmah', label: '📖 إدارة الختمة' }
    ];

    return (
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1.5px solid var(--border-color)', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => navigate(`/admin/dashboard?tab=${tab.id}`)} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              background: activeTab === tab.id ? 'var(--primary-color)' : 'transparent',
              borderRadius: '0.75rem 0.75rem 0 0',
              fontWeight: 'bold', 
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  // --- Data Filtering and Pagination ---
  let filteredData = data;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredData = filteredData.filter(item => {
      const title = (item.title || item.text || item.question || '').toLowerCase();
      const cat = (item.category || item.source || '').toLowerCase();
      const tags = (item.tags || []).join(' ').toLowerCase();
      return title.includes(q) || cat.includes(q) || tags.includes(q);
    });
  }
  if (filterCategory) {
    filteredData = filteredData.filter(item => item.category === filterCategory);
  }

  const uniqueCategories = activeTab === 'articles' ? [...new Set(data.map(item => item.category))].filter(Boolean) : [];
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <Loader message="جاري تحميل لوحة التحكم..." />;

  // --- DYNAMIC RENDER ---
  if (activeTab === 'overview' && overviewStats) {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--primary-color)', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>📊 لوحة القيادة</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <button onClick={toggleDarkMode} className="btn" title="تغيير المظهر" style={{ padding: '0.5rem', fontSize: '1.5rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '50%' }}>
                {isDark ? '☀️' : '🌙'}
             </button>
             <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '0.6rem 1.25rem' }}>خروج</button>
          </div>
        </div>
        {renderTabHeader()}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '5px solid var(--primary-color)' }}>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', margin: '0 0 0.5rem 0' }}>{overviewStats.articles}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>المقالات المنشورة</p>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '5px solid #f59e0b' }}>
            <h3 style={{ fontSize: '2.5rem', color: '#f59e0b', margin: '0 0 0.5rem 0' }}>{overviewStats.views.toLocaleString()}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>إجمالي القراءات والمشاهدات</p>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '5px solid #10b981' }}>
            <h3 style={{ fontSize: '2.5rem', color: '#10b981', margin: '0 0 0.5rem 0' }}>{overviewStats.zikr + overviewStats.hadith}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>الأذكار والأحاديث</p>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '5px solid #6366f1' }}>
            <h3 style={{ fontSize: '2.5rem', color: '#6366f1', margin: '0 0 0.5rem 0' }}>{overviewStats.media}</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>الوسائط (صوت وفيديو)</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Professional Quick Actions Grid */}
          <div className="card" style={{ padding: '2.25rem', border: 'none', background: 'var(--surface-color)', boxShadow: 'var(--card-shadow)' }}>
            <h3 style={{ marginBottom: '2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', borderRight: '5px solid var(--primary-color)', paddingRight: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⚡ إجراءات سريعة
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
              <Link to="/admin/article/new" className="quick-action-card" style={{ background: 'rgba(13, 148, 136, 0.08)', color: 'var(--primary-color)' }}>
                <span style={{ fontSize: '1.5rem' }}>📝</span>
                <span className="action-text">مقال جديد</span>
              </Link>
              <Link to="/admin/zikr/new" className="quick-action-card" style={{ background: 'rgba(245, 158, 11, 0.08)', color: '#d97706' }}>
                <span style={{ fontSize: '1.5rem' }}>📿</span>
                <span className="action-text">ذكر جديد</span>
              </Link>
              <Link to="/admin/hadith/new" className="quick-action-card" style={{ background: 'rgba(99, 102, 241, 0.08)', color: '#4f46e5' }}>
                <span style={{ fontSize: '1.5rem' }}>📜</span>
                <span className="action-text">حديث نبوي</span>
              </Link>
              <Link to="/admin/media/new" className="quick-action-card" style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#059669' }}>
                <span style={{ fontSize: '1.5rem' }}>🎧</span>
                <span className="action-text">وسائط</span>
              </Link>
              <Link to="/admin/book/new" className="quick-action-card" style={{ background: 'rgba(236, 72, 153, 0.08)', color: '#db2777' }}>
                <span style={{ fontSize: '1.5rem' }}>📚</span>
                <span className="action-text">كتاب</span>
              </Link>
              <Link to="/admin/videosList/new" className="quick-action-card" style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#dc2626' }}>
                <span style={{ fontSize: '1.5rem' }}>🎬</span>
                <span className="action-text">مرئي</span>
              </Link>
              <Link to="/admin/quizzes/new" className="quick-action-card" style={{ background: 'rgba(249, 115, 22, 0.08)', color: '#ea580c' }}>
                <span style={{ fontSize: '1.5rem' }}>🎮</span>
                <span className="action-text">سؤال</span>
              </Link>
              <Link to="/admin/fatwaArchive/new" className="quick-action-card" style={{ background: 'rgba(107, 114, 128, 0.08)', color: '#4b5563' }}>
                <span style={{ fontSize: '1.5rem' }}>⚖️</span>
                <span className="action-text">فتوى</span>
              </Link>
              <Link to="/admin/event/new" className="quick-action-card" style={{ background: 'rgba(13, 148, 136, 0.08)', color: 'var(--primary-color)' }}>
                <span style={{ fontSize: '1.5rem' }}>📍</span>
                <span className="action-text">فعالية</span>
              </Link>
              <Link to="/admin/khatmah" className="quick-action-card" style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#059669' }}>
                <span style={{ fontSize: '1.5rem' }}>📖</span>
                <span className="action-text">الختمة</span>
              </Link>
              <Link to="/admin/dua/new" className="quick-action-card" style={{ background: 'rgba(13, 148, 136, 0.08)', color: 'var(--primary-color)' }}>
                <span style={{ fontSize: '1.5rem' }}>🤲</span>
                <span className="action-text">دعاء جديد</span>
              </Link>
              <Link to="/admin/prophet-story/new" className="quick-action-card" style={{ background: 'rgba(124, 58, 237, 0.08)', color: '#7c3aed' }}>
                <span style={{ fontSize: '1.5rem' }}>📜</span>
                <span className="action-text">قصة نبي</span>
              </Link>
              <Link to="/admin/tibb/new" className="quick-action-card" style={{ background: 'rgba(22, 101, 52, 0.08)', color: '#166534' }}>
                <span style={{ fontSize: '1.5rem' }}>🌿</span>
                <span className="action-text">طب نبوي</span>
              </Link>
              <Link to="/admin/podcast/new" className="quick-action-card" style={{ background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5' }}>
                <span style={{ fontSize: '1.5rem' }}>🎙️</span>
                <span className="action-text">بودكاست</span>
              </Link>
              <Link to="/admin/dailyQuote/new" className="quick-action-card" style={{ background: 'rgba(236, 72, 193, 0.08)', color: '#db2777' }}>
                <span style={{ fontSize: '1.5rem' }}>✨</span>
                <span className="action-text">رسالة اليوم</span>
              </Link>
              <Link to="/admin/campaign/new" className="quick-action-card" style={{ gridColumn: 'span 2', background: 'var(--primary-color)', color: 'white', display: 'flex', flexDirection: 'row', gap: '1rem', padding: '1.25rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📧</span>
                <span className="action-text" style={{ fontWeight: 'bold' }}>إرسال نشرة بريدية للجميع</span>
              </Link>
            </div>
          </div>

          {/* Top Articles */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#f59e0b', borderRight: '4px solid #f59e0b', paddingRight: '0.75rem' }}>🔥 المقالات الأكثر تفاعلاً</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {overviewStats.topArticles.map((art, i) => (
                <li key={art._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                  <Link to={`/article/${art._id}`} target="_blank" style={{ color: 'var(--text-primary)', fontWeight: 'bold', textDecoration: 'none', maxWidth: '70%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ color: '#94a3b8', marginRight: '0.5rem' }}>{i + 1}.</span> {art.title}
                  </Link>
                  <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#d97706', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    👁️ {art.views?.toLocaleString()}
                  </span>
                </li>
              ))}
              {overviewStats.topArticles.length === 0 && <p style={{ color: 'var(--text-muted)' }}>لا توجد مقالات لعرضها.</p>}
            </ul>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <AdminAnalytics khatmahStats={overviewStats?.khatmahData} />
      </div>
    );
  }

  // --- SUB-TABS RENDER ---
  if (activeTab === 'khatmah') {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <h2 style={{ color: 'var(--primary-color)', fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '2.5rem' }}>إدارة المحتوى</h2>
        {renderTabHeader()}
        <AdminKhatmah />
      </div>
    );
  }

  if (activeTab === 'events') {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <h2 style={{ color: 'var(--primary-color)', fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '2.5rem' }}>إدارة المحتوى</h2>
        {renderTabHeader()}
        <AdminEvents />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: 'var(--primary-color)', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>إدارة المحتوى</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={toggleDarkMode} className="btn" title="تغيير المظهر" style={{ padding: '0.5rem', fontSize: '1.25rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '50%' }}>
             {isDark ? '☀️' : '🌙'}
          </button>
          {activeTab === 'articles' && <Link to="/admin/article/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>إضافة مقال جديد +</Link>}
          {activeTab === 'zikr' && <Link to="/admin/zikr/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>إضافة ذكر جديد +</Link>}
          {activeTab === 'media' && <Link to="/admin/media/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>إضافة وسائط جديدة +</Link>}
          {activeTab === 'hadith' && <Link to="/admin/hadith/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>إضافة حديث جديد +</Link>}
          {activeTab === 'books' && <Link to="/admin/book/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>إضافة كتاب جديد +</Link>}
          {activeTab === 'videosList' && <Link to="/admin/videosList/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>إضافة مرئي جديد +</Link>}
          {activeTab === 'quizzes' && <Link to="/admin/quizzes/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>إضافة سؤال مسابقة +</Link>}
          {activeTab === 'fatwaArchive' && <Link to="/admin/fatwaArchive/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>إضافة فتوى للأرشيف +</Link>}
          {activeTab === 'kidContent' && <Link to="/admin/kidContent/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', background: '#ef4444' }}>إضافة محتوى للأطفال +</Link>}
          {activeTab === 'duas' && <Link to="/admin/dua/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', background: '#0d9488' }}>🤲 إضافة دعاء جديد +</Link>}
          {activeTab === 'prophetStories' && <Link to="/admin/prophet-story/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', background: '#7c3aed' }}>📜 إضافة قصة نبي +</Link>}
          {activeTab === 'tibb' && <Link to="/admin/tibb/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', background: '#166534' }}>🌿 إضافة طب نبوي +</Link>}
          {activeTab === 'podcasts' && <Link to="/admin/podcast/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', background: '#4f46e5' }}>🎙️ إضافة بودكاست +</Link>}
          {activeTab === 'dailyQuotes' && <Link to="/admin/dailyQuote/new" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', background: '#db2777' }}>✨ إضافة رسالة جديدة +</Link>}
          <button onClick={handleLogout} className="btn btn-danger">خروج</button>
        </div>
      </div>

      {renderTabHeader()}

      {/* Filters & Search Toolbar */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', backgroundColor: 'var(--surface-color)' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder={`ابحث في الأرشيف...`}
            style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }}
          />
        </div>
        
        {activeTab === 'articles' && uniqueCategories.length > 0 && (
          <select 
            className="form-control" 
            value={filterCategory} 
            onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
            style={{ width: 'auto', flex: '0 0 auto', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <option value="">جميع التصنيفات</option>
            {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        )}
      </div>

      {/* Featured Articles Control Center (Only for Articles Tab) */}
      {activeTab === 'articles' && data.filter(a => a.isFeatured).length > 0 && (
         <div className="card fade-up" style={{ marginBottom: '2.5rem', border: '1px solid #d97706', background: 'rgba(217, 119, 6, 0.02)', borderRadius: '1rem', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 2rem', background: 'linear-gradient(to left, #d97706, #f59e0b)', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <span style={{ fontSize: '1.4rem' }}>⭐</span>
               <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>إدارة المقالات المثبتة (أعلى 5 مقالات)</h3>
               <span style={{ marginRight: 'auto', fontSize: '0.85rem', opacity: 0.9 }}>سيتم عرض هذه المقالات في الشريط الجانبي للموقع بالترتيب المختار</span>
            </div>
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
               {data
                 .filter(a => a.isFeatured)
                 .sort((a,b) => (a.featuredPosition || 99) - (b.featuredPosition || 99))
                 .slice(0, 5)
                 .map(art => (
                   <div key={art._id} style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ backgroundColor: '#d97706', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                           ترتيب: {art.featuredPosition || '?'}
                         </span>
                         <button onClick={() => handleToggleFeatured(art._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}>إلغاء التثبيت ✖</button>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{art.title}</h4>
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                         <select 
                            value={art.featuredPosition || 0} 
                            onChange={(e) => handleSetFeaturedPosition(art._id, e.target.value)}
                            style={{ flexGrow: 1, padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)', fontSize: '0.85rem', background: 'var(--bg-color)', color: 'var(--primary-color)', fontWeight: 'bold' }}
                         >
                            {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v === 0 ? 'اختر ترتيباً...' : `الموقع ${v}`}</option>)}
                         </select>
                         <Link to={`/admin/article/edit/${art._id}`} className="action-btn action-btn-info" style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>✏️</Link>
                      </div>
                   </div>
                 ))}
            </div>
         </div>
      )}

      {/* Main Archive Table */}
      <div className="card" style={{ overflowX: 'auto', borderRadius: '0.75rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {activeTab === 'articles' ? 'أرشيف المقالات العامة' : 'المحتوى'}
              </th>
              {activeTab === 'messages' && <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>بيانات السائل</th>}
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>التصنيف</th>
              {activeTab === 'articles' && <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>الاحصائيات</th>}
              {activeTab === 'fatwaArchive' && <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>الترتيب</th>}
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>الحالة</th>
              <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map(item => (
              <tr key={item._id} style={{ borderBottom: '1px solid var(--border-color)', opacity: item.isHidden ? 0.6 : 1, transition: 'background 0.2s' }} className="table-row-hover">
                <td style={{ padding: '1.25rem 1rem', fontWeight: '500', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeTab === 'messages' && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>السؤال:</div>}
                  {activeTab === 'articles' ? item.title
                    : activeTab === 'zikr' || activeTab === 'hadith' ? item.text
                    : activeTab === 'messages' || activeTab === 'quizzes' || activeTab === 'fatwaArchive' ? item.question
                    : activeTab === 'duas' ? (item.title || item.arabicText?.substring(0, 60) + '...')
                    : activeTab === 'prophetStories' ? `${item.name ? `نبي الله ${item.name} — ` : ''}${item.title}`
                    : activeTab === 'tibb' ? item.name
                    : activeTab === 'podcasts' ? `${item.title}${item.speaker ? ` — ${item.speaker}` : ''}`
                    : activeTab === 'dailyQuotes' ? item.text
                    : item.title}
                  {item.isFeatured && <span style={{ fontSize: '0.75rem', backgroundColor: '#fef08a', color: '#b45309', padding: '0.1rem 0.5rem', borderRadius: '0.5rem', marginRight: '0.5rem' }}>مميز</span>}
                  {activeTab === 'messages' && item.isAnswered && item.answer && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0.4rem', borderRight: '3px solid #10b981', fontSize: '0.85rem' }}>
                      <strong>الإجابة:</strong> {item.answer}
                    </div>
                  )}
                </td>
                {activeTab === 'messages' && (
                   <td style={{ padding: '1.25rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.email || 'بدون بريد'}</span>
                      </div>
                   </td>
                )}
                <td style={{ padding: '1.25rem 1rem' }}>
                  <span style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', border: '1px solid var(--border-color)', fontWeight: 'bold' }}>
                    {activeTab === 'hadith' ? item.source : (activeTab === 'messages' ? (item.category || 'غير مصنف') : (activeTab === 'quizzes' ? 'مسابقة' : item.category))} {activeTab === 'media' ? `(${item.type === 'video' ? 'فيديو' : 'صوت'})` : ''}
                  </span>
                </td>
                {activeTab === 'articles' && (
                  <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>👁️ {(item.views || 0)}</div>
                  </td>
                )}
                {activeTab === 'fatwaArchive' && (
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{item.position || 0}</div>
                  </td>
                )}
                <td style={{ padding: '1.25rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {activeTab === 'messages' ? (
                       <span style={{ padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 'bold', backgroundColor: item.isAnswered ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: item.isAnswered ? '#10b981' : '#f59e0b' }}>
                         {item.isAnswered ? 'مُجاب' : 'جديد'}
                       </span>
                    ) : (
                      <>
                        <span style={{ 
                          padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 'bold',
                          backgroundColor: item.isHidden ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          color: item.isHidden ? '#ef4444' : '#10b981', textAlign: 'center'
                        }}>
                          {item.isHidden ? 'مخفي' : 'منشور'}
                        </span>
                        {activeTab === 'articles' && item.isFeatured && (
                          <span style={{ 
                            padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 'bold',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#d97706', textAlign: 'center'
                          }}>
                            مميز {item.featuredPosition > 0 ? `(#${item.featuredPosition})` : ''}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {activeTab === 'messages' && !item.isAnswered && (
                      <button onClick={() => { setSelectedMessage(item); setAnswerDraft(''); }} className="action-btn action-btn-success" title="الرد على الفتوى">✍️ إجابة</button>
                    )}
                    {activeTab === 'messages' && item.isAnswered && (
                      <button onClick={() => { setSelectedMessage(item); setAnswerDraft(item.answer || ''); setCategoryDraft(item.category || 'عام'); }} className="action-btn action-btn-info" title="تعديل الإجابة">✏️</button>
                    )}
                    {activeTab !== 'messages' && (
                      <>
                        <button onClick={() => handleToggleVisibility(item._id)} className={`action-btn ${item.isHidden ? 'action-btn-success' : 'action-btn-muted'}`} title={item.isHidden ? 'نشر' : 'إخفاء'}>
                          {item.isHidden ? '👁️' : '🚫'}
                        </button>
                        {activeTab === 'articles' && (
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '2rem', padding: '0 6px', background: 'var(--bg-color)' }}>
                            <button onClick={() => handleToggleFeatured(item._id)} className={`action-btn ${item.isFeatured ? 'action-btn-success' : 'action-btn-muted'}`} style={{ width: '28px', height: '28px', fontSize: '0.85rem', boxShadow: 'none' }} title={item.isFeatured ? 'إلغاء التمييز' : 'تمييز المقال'}>
                              {item.isFeatured ? '✨' : '☆'}
                            </button>
                            {item.isFeatured && (
                              <select 
                                value={item.featuredPosition || 0} 
                                onChange={(e) => handleSetFeaturedPosition(item._id, e.target.value)}
                                style={{ fontSize: '0.8rem', border: 'none', background: 'transparent', color: 'var(--primary-color)', fontWeight: 'bold', outline: 'none' }}
                                title="تحديد ترتيب التمييز"
                              >
                                {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v === 0 ? '?' : v}</option>)}
                              </select>
                            )}
                          </div>
                        )}
                        <Link to={`/admin/${
                          activeTab === 'articles' ? 'article' :
                          activeTab === 'books' ? 'book' :
                          activeTab === 'duas' ? 'dua' :
                          activeTab === 'prophetStories' ? 'prophet-story' :
                          activeTab === 'tibb' ? 'tibb' :
                          activeTab === 'podcasts' ? 'podcast' :
                          activeTab === 'dailyQuotes' ? 'dailyQuote' :
                          activeTab === 'videosList' ? 'videosList' :
                          activeTab === 'fatwaArchive' ? 'fatwaArchive' :
                          activeTab === 'kidContent' ? 'kidContent' :
                          activeTab
                        }/edit/${item._id}`} className="action-btn action-btn-info" title="تعديل">✏️</Link>
                      </>
                    )}
                    <button onClick={() => handleDelete(item._id)} className="action-btn action-btn-danger" title="حذف">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', opacity: 0.5 }}>📭</span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginTop: '1rem' }}>
              {searchQuery || filterCategory ? 'لا توجد نتائج تطابق بحثك.' : 'الجدول فارغ، ابدأ بإضافة بعض المحتوى!'}
            </p>
            {(searchQuery || filterCategory) && (
              <button className="btn" onClick={() => { setSearchQuery(''); setFilterCategory(''); }} style={{ marginTop: '1rem', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>مسح الفلاتر</button>
            )}
          </div>
        ) : (
          <div style={{ padding: '1.25rem 2rem', borderTop: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-color)', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
              إظهار {((currentPage - 1) * itemsPerPage) + 1} إلى {Math.min(currentPage * itemsPerPage, filteredData.length)} سجل
            </span>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', padding: '0.4rem', borderRadius: '3rem', border: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="pagination-btn"
                style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >السابق</button>
              
              <span style={{ padding: '0 1.25rem', color: 'var(--text-primary)', fontWeight: '800', fontSize: '0.95rem', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                {currentPage} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', margin: '0 0.2rem' }}>/</span> {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="pagination-btn"
                style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >التالي</button>
            </div>
          </div>
        )}
      </div>

      {/* Answer Modal/Form Overlay */}
      {selectedMessage && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="card fade-up" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <button onClick={() => setSelectedMessage(null)} style={{ position: 'absolute', top: '1rem', left: '1rem', border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>✍️ الإجابة على الفتوى</h3>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>السؤال من {selectedMessage.name}:</div>
               <p style={{ margin: 0, fontWeight: 'bold', lineHeight: '1.6' }}>{selectedMessage.question}</p>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 'bold' }}>تصنيف الفتوى</label>
              <select 
                className="form-control" 
                value={categoryDraft} 
                onChange={(e) => setCategoryDraft(e.target.value)}
                style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="عام">عام</option>
                <option value="فقه الصلاة">فقه الصلاة</option>
                <option value="فقه الزكاة">فقه الزكاة</option>
                <option value="فقه الصيام">فقه الصيام</option>
                <option value="المعاملات المالية">المعاملات المالية</option>
                <option value="العقيدة">العقيدة</option>
                <option value="السيرة">السيرة</option>
                <option value="الأسرة والمجتمع">الأسرة والمجتمع</option>
                <option value="قضايا معاصرة">قضايا معاصرة</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 'bold' }}>نص الإجابة</label>
              <textarea 
                className="form-control" 
                rows="8" 
                value={answerDraft} 
                onChange={(e) => setAnswerDraft(e.target.value)} 
                placeholder="اكتب الإجابة الشرعية الوافية هنا..."
                style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button 
                onClick={() => handleMarkAnswered(selectedMessage._id, answerDraft, categoryDraft)} 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '0.8rem' }}
                disabled={!answerDraft.trim()}
              >
                {selectedMessage.isAnswered ? 'تعديل وحفظ الإجابة' : 'حفظ الإجابة ونشرها ✅'}
              </button>
              <button onClick={() => setSelectedMessage(null)} className="btn btn-muted" style={{ padding: '0.8rem' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover { background-color: rgba(13, 148, 136, 0.04); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
