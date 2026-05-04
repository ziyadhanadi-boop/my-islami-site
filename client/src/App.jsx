import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ArticleDetails from './pages/ArticleDetails';
import Category from './pages/Category';
import Search from './pages/Search';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminArticleForm from './pages/admin/AdminArticleForm';
import AdminZikrForm from './pages/admin/AdminZikrForm';
import AdminMediaForm from './pages/admin/AdminMediaForm';
import AdminHadithForm from './pages/admin/AdminHadithForm';
import AdminBookForm from './pages/admin/AdminBookForm';
import AdminVideoForm from './pages/admin/AdminVideoForm';
import AdminQuizForm from './pages/admin/AdminQuizForm';
import AdminFatwaForm from './pages/admin/AdminFatwaForm';
import AdminKidContentForm from './pages/admin/AdminKidContentForm';
import AdminCampaign from './pages/admin/AdminCampaign';
import Tools from './pages/Tools';
import Zikr from './pages/Zikr';
import Multimedia from './pages/Multimedia';
import Qibla from './pages/Qibla';
import Quran from './pages/Quran';
import NamesOfAllah from './pages/NamesOfAllah';
import ZakatCalculator from './pages/ZakatCalculator';
import AIAssistant from './pages/AIAssistant';
import Favorites from './pages/Favorites';
import HijriCalendar from './pages/HijriCalendar';
import InheritanceCalculator from './pages/InheritanceCalculator';
import ChatWidget from './components/ChatWidget';
import BackToTop from './components/BackToTop';
import About from './pages/About';
import Ruqyah from './pages/Ruqyah';
import { useEffect } from 'react';
import { AudioProvider } from './context/AudioContext';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';
import AskFatwa from './pages/AskFatwa';
import Library from './pages/Library';
import IslamicTube from './pages/IslamicTube';
import Quizzes from './pages/Quizzes';
import FatwaArchive from './pages/FatwaArchive';
import KidsCorner from './pages/KidsCorner';
import TopProgressBar from './components/TopProgressBar';
import DailyQuote from './components/DailyQuote';
import PageTransition from './components/PageTransition';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Profile from './pages/Profile';
import DuasPage from './pages/DuasPage';
import ProphetStoriesPage from './pages/ProphetStoriesPage';
import TibbPage from './pages/TibbPage';
import PodcastPage from './pages/PodcastPage';
import HalalCheckPage from './pages/HalalCheckPage';

import QuranAI from './pages/QuranAI';
import EventsMap from './pages/EventsMap';
import AdminKhatmah from './pages/admin/AdminKhatmah';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEventForm from './pages/admin/AdminEventForm';
import AdminDuaForm from './pages/admin/AdminDuaForm';
import AdminProphetStoryForm from './pages/admin/AdminProphetStoryForm';
import AdminTibbForm from './pages/admin/AdminTibbForm';
import AdminPodcastForm from './pages/admin/AdminPodcastForm';
import AdminDailyQuoteForm from './pages/admin/AdminDailyQuoteForm';
import ProphetStoryDetailPage from './pages/ProphetStoryDetailPage';
import DuaDetailPage from './pages/DuaDetailPage';
import TibbDetailPage from './pages/TibbDetailPage';
import PodcastDetailPage from './pages/PodcastDetailPage';

import DeenPlannerWidget from './components/DeenPlannerWidget';
import MobileBottomNav from './components/MobileBottomNav';

// Component to reset scroll position on every navigation change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll to top (immediate for better UX on navigation)
    window.scrollTo(0, 0);
    // Extra fallback for some mobile browsers
    document.documentElement.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Component to conditionally render Navbar based on route
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AudioProvider>
      <ScrollToTop />
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        <TopProgressBar />
        {!isAdminRoute && <Navbar />}
        <main style={{ flexGrow: 1, width: '100%' }}>
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        {!isAdminRoute && <MobileBottomNav />}
        {!isAdminRoute && <GlobalAudioPlayer />}
        {!isAdminRoute && <DailyQuote />}
        {!isAdminRoute && <ChatWidget />}
        {!isAdminRoute && <BackToTop />}
        {!isAdminRoute && <Footer />}
      </div>
    </AudioProvider>
  );
};

function App() {
  useEffect(() => {
    // 1. Check saved theme
    const savedTheme = localStorage.getItem('theme');
    
    // 2. Auto-Night Mode (from 6 PM to 6 AM)
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour <= 6;
    
    if (savedTheme === 'dark' || (!savedTheme && isNight)) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  // Track visit once per session for analytics
  useEffect(() => {
    const alreadyTracked = sessionStorage.getItem('visit_tracked');
    if (alreadyTracked) return;

    const trackVisit = async () => {
      try {
        const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
        let geo = { country_name: 'غير معروف', country_code: 'xx' };
        
        try {
          const geoRes = await fetch('https://ipapi.co/json/');
          if (geoRes.ok) geo = await geoRes.json();
        } catch (e) { console.warn('Geo tracking blocked or failed'); }

        await fetch(`${API_BASE}/api/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            country: geo.country_name || 'غير معروف',
            countryCode: geo.country_code || 'xx',
            path: window.location.pathname
          })
        });
        sessionStorage.setItem('visit_tracked', '1');
      } catch (_) { /* Silent fail */ }
    };
    trackVisit();
  }, []);

  return (

    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<ArticleDetails />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/search" element={<Search />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/zikr" element={<Zikr />} />
          <Route path="/multimedia" element={<Multimedia />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/names-of-allah" element={<NamesOfAllah />} />
          <Route path="/zakat-calculator" element={<ZakatCalculator />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/hijri-calendar" element={<HijriCalendar />} />
          <Route path="/inheritance-calculator" element={<InheritanceCalculator />} />
          <Route path="/about" element={<About />} />
          <Route path="/ruqyah" element={<Ruqyah />} />
          <Route path="/ask-fatwa" element={<AskFatwa />} />
          <Route path="/library" element={<Library />} />
          <Route path="/islamic-tube" element={<IslamicTube />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/fatwa-archive" element={<FatwaArchive />} />
          <Route path="/kids-corner" element={<KidsCorner />} />
          <Route path="/quran-ai" element={<QuranAI />} />
          <Route path="/events-map" element={<EventsMap />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Profile />} />
          <Route path="/duas" element={<DuasPage />} />
          <Route path="/duas/:id" element={<DuaDetailPage />} />
          <Route path="/prophet-stories" element={<ProphetStoriesPage />} />
          <Route path="/prophet-stories/:id" element={<ProphetStoryDetailPage />} />
          <Route path="/tibb-nabawi" element={<TibbPage />} />
          <Route path="/tibb-nabawi/:id" element={<TibbDetailPage />} />
          <Route path="/podcast" element={<PodcastPage />} />
          <Route path="/podcast/:id" element={<PodcastDetailPage />} />
          <Route path="/halal-check" element={<HalalCheckPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/khatmah" element={<AdminKhatmah />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/event/new" element={<AdminEventForm />} />
          <Route path="/admin/event/edit/:id" element={<AdminEventForm />} />
          <Route path="/admin/article/new" element={<AdminArticleForm />} />
          <Route path="/admin/article/edit/:id" element={<AdminArticleForm />} />
          <Route path="/admin/zikr/new" element={<AdminZikrForm />} />
          <Route path="/admin/zikr/edit/:id" element={<AdminZikrForm />} />
          <Route path="/admin/media/new" element={<AdminMediaForm />} />
          <Route path="/admin/media/edit/:id" element={<AdminMediaForm />} />
          <Route path="/admin/hadith/new" element={<AdminHadithForm />} />
          <Route path="/admin/hadith/edit/:id" element={<AdminHadithForm />} />
          <Route path="/admin/book/new" element={<AdminBookForm />} />
          <Route path="/admin/book/edit/:id" element={<AdminBookForm />} />
          <Route path="/admin/videosList/new" element={<AdminVideoForm />} />
          <Route path="/admin/videosList/edit/:id" element={<AdminVideoForm />} />
          <Route path="/admin/quizzes/new" element={<AdminQuizForm />} />
          <Route path="/admin/quizzes/edit/:id" element={<AdminQuizForm />} />
          <Route path="/admin/fatwaArchive/new" element={<AdminFatwaForm />} />
          <Route path="/admin/fatwaArchive/edit/:id" element={<AdminFatwaForm />} />
          <Route path="/admin/kidContent/new" element={<AdminKidContentForm />} />
          <Route path="/admin/kidContent/edit/:id" element={<AdminKidContentForm />} />
          <Route path="/admin/campaign/new" element={<AdminCampaign />} />
          <Route path="/admin/dua/new" element={<AdminDuaForm />} />
          <Route path="/admin/dua/edit/:id" element={<AdminDuaForm />} />
          <Route path="/admin/prophet-story/new" element={<AdminProphetStoryForm />} />
          <Route path="/admin/prophet-story/edit/:id" element={<AdminProphetStoryForm />} />
          <Route path="/admin/tibb/new" element={<AdminTibbForm />} />
          <Route path="/admin/tibb/edit/:id" element={<AdminTibbForm />} />
          <Route path="/admin/podcast/new" element={<AdminPodcastForm />} />
          <Route path="/admin/podcast/edit/:id" element={<AdminPodcastForm />} />
          <Route path="/admin/dailyQuote/new" element={<AdminDailyQuoteForm />} />
          <Route path="/admin/dailyQuote/edit/:id" element={<AdminDailyQuoteForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
