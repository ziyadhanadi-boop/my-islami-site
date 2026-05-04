import 'package:flutter/material.dart';

import '../../screens/home/home_screen.dart';
import '../../screens/quran/quran_screen.dart';
import '../../screens/quran/quran_detail_screen.dart';
import '../../screens/zikr/zikr_screen.dart';
import '../../screens/articles/articles_screen.dart';
import '../../screens/articles/article_detail_screen.dart';
import '../../screens/articles/category_screen.dart';
import '../../screens/prayer_times/prayer_times_screen.dart';
import '../../screens/duas/duas_screen.dart';
import '../../screens/duas/dua_detail_screen.dart';
import '../../screens/prophet_stories/prophet_stories_screen.dart';
import '../../screens/prophet_stories/prophet_story_detail_screen.dart';
import '../../screens/tibb/tibb_screen.dart';
import '../../screens/tibb/tibb_detail_screen.dart';
import '../../screens/podcast/podcast_screen.dart';
import '../../screens/podcast/podcast_detail_screen.dart';
import '../../screens/quizzes/quizzes_screen.dart';
import '../../screens/fatwa_archive/fatwa_archive_screen.dart';
import '../../screens/fatwa_archive/fatwa_detail_screen.dart';
import '../../screens/kids_corner/kids_corner_screen.dart';
import '../../screens/tools/tools_screen.dart';
import '../../screens/tools/zakat_calculator_screen.dart';
import '../../screens/tools/inheritance_calculator_screen.dart';
import '../../screens/qibla/qibla_screen.dart';
import '../../screens/library/library_screen.dart';
import '../../screens/multimedia/multimedia_screen.dart';
import '../../screens/islamic_tube/islamic_tube_screen.dart';
import '../../screens/names_of_allah/names_of_allah_screen.dart';
import '../../screens/hijri_calendar/hijri_calendar_screen.dart';
import '../../screens/ai_assistant/ai_assistant_screen.dart';
import '../../screens/halal_check/halal_check_screen.dart';
import '../../screens/events_map/events_map_screen.dart';
import '../../screens/search/search_screen.dart';
import '../../screens/favorites/favorites_screen.dart';
import '../../screens/profile/profile_screen.dart';
import '../../screens/about/about_screen.dart';
import '../../screens/privacy/privacy_screen.dart';
import '../../screens/terms/terms_screen.dart';
import '../../screens/ruqyah/ruqyah_screen.dart';
import '../../screens/ask_fatwa/ask_fatwa_screen.dart';
import '../../screens/admin/admin_login_screen.dart';
import '../../screens/admin/admin_dashboard_screen.dart';
import '../../models/article.dart';
import '../../models/dua.dart';
import '../../models/prophet_story.dart';
import '../../models/tibb.dart';
import '../../models/podcast.dart';
import '../../models/fatwa.dart';

class AppRoutes {
  static const String home = '/';
  static const String quran = '/quran';
  static const String quranDetail = '/quran/detail';
  static const String zikr = '/zikr';
  static const String articles = '/articles';
  static const String articleDetail = '/article';
  static const String category = '/category';
  static const String prayerTimes = '/prayer-times';
  static const String duas = '/duas';
  static const String duaDetail = '/dua-detail';
  static const String prophetStories = '/prophet-stories';
  static const String prophetStoryDetail = '/prophet-story-detail';
  static const String tibb = '/tibb';
  static const String tibbDetail = '/tibb-detail';
  static const String podcast = '/podcast';
  static const String podcastDetail = '/podcast-detail';
  static const String quizzes = '/quizzes';
  static const String fatwaArchive = '/fatwa-archive';
  static const String fatwaDetail = '/fatwa-detail';
  static const String kidsCorner = '/kids-corner';
  static const String tools = '/tools';
  static const String zakatCalculator = '/zakat-calculator';
  static const String inheritanceCalculator = '/inheritance-calculator';
  static const String qibla = '/qibla';
  static const String library = '/library';
  static const String multimedia = '/multimedia';
  static const String islamicTube = '/islamic-tube';
  static const String namesOfAllah = '/names-of-allah';
  static const String hijriCalendar = '/hijri-calendar';
  static const String aiAssistant = '/ai-assistant';
  static const String halalCheck = '/halal-check';
  static const String eventsMap = '/events-map';
  static const String search = '/search';
  static const String favorites = '/favorites';
  static const String profile = '/profile';
  static const String about = '/about';
  static const String privacy = '/privacy';
  static const String terms = '/terms';
  static const String ruqyah = '/ruqyah';
  static const String askFatwa = '/ask-fatwa';
  static const String adminLogin = '/admin/login';
  static const String adminDashboard = '/admin/dashboard';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case home:
        return _createRoute(const HomeScreen());

      case quran:
        return _createRoute(const QuranScreen());

      case quranDetail:
        final args = settings.arguments as Map<String, dynamic>;
        return _createRoute(
          QuranDetailScreen(
            surahNumber: args['surahNumber'] as int,
            surahName: args['surahName'] as String,
          ),
        );

      case zikr:
        return _createRoute(const ZikrScreen());

      case articles:
        return _createRoute(const ArticlesScreen());

      case articleDetail:
        final article = settings.arguments as Article;
        return _createRoute(ArticleDetailScreen(article: article));

      case category:
        final args = settings.arguments as Map<String, dynamic>;
        return _createRoute(
          CategoryScreen(categoryName: args['categoryName'] as String),
        );

      case prayerTimes:
        return _createRoute(const PrayerTimesScreen());

      case duas:
        return _createRoute(const DuasScreen());

      case duaDetail:
        final dua = settings.arguments as Dua;
        return _createRoute(DuaDetailScreen(dua: dua));

      case prophetStories:
        return _createRoute(const ProphetStoriesScreen());

      case prophetStoryDetail:
        final story = settings.arguments as ProphetStory;
        return _createRoute(ProphetStoryDetailScreen(story: story));

      case tibb:
        return _createRoute(const TibbScreen());

      case tibbDetail:
        final tibb = settings.arguments as Tibb;
        return _createRoute(TibbDetailScreen(tibb: tibb));

      case podcast:
        return _createRoute(const PodcastScreen());

      case podcastDetail:
        final podcast = settings.arguments as Podcast;
        return _createRoute(PodcastDetailScreen(podcast: podcast));

      case quizzes:
        return _createRoute(const QuizzesScreen());

      case fatwaArchive:
        return _createRoute(const FatwaArchiveScreen());

      case fatwaDetail:
        final fatwa = settings.arguments as Fatwa;
        return _createRoute(FatwaDetailScreen(fatwa: fatwa));

      case kidsCorner:
        return _createRoute(const KidsCornerScreen());

      case tools:
        return _createRoute(const ToolsScreen());

      case zakatCalculator:
        return _createRoute(const ZakatCalculatorScreen());

      case inheritanceCalculator:
        return _createRoute(const InheritanceCalculatorScreen());

      case qibla:
        return _createRoute(const QiblaScreen());

      case library:
        return _createRoute(const LibraryScreen());

      case multimedia:
        return _createRoute(const MultimediaScreen());

      case islamicTube:
        return _createRoute(const IslamicTubeScreen());

      case namesOfAllah:
        return _createRoute(const NamesOfAllahScreen());

      case hijriCalendar:
        return _createRoute(const HijriCalendarScreen());

      case aiAssistant:
        return _createRoute(const AIAssistantScreen());

      case halalCheck:
        return _createRoute(const HalalCheckScreen());

      case eventsMap:
        return _createRoute(const EventsMapScreen());

      case search:
        return _createRoute(const SearchScreen());

      case favorites:
        return _createRoute(const FavoritesScreen());

      case profile:
        return _createRoute(const ProfileScreen());

      case about:
        return _createRoute(const AboutScreen());

      case privacy:
        return _createRoute(const PrivacyScreen());

      case terms:
        return _createRoute(const TermsScreen());

      case ruqyah:
        return _createRoute(const RuqyahScreen());

      case askFatwa:
        return _createRoute(const AskFatwaScreen());

      case adminLogin:
        return _createRoute(const AdminLoginScreen());

      case adminDashboard:
        return _createRoute(const AdminDashboardScreen());

      default:
        return _createRoute(
          const Scaffold(body: Center(child: Text('لا توجد صفحة بهذا المسار'))),
        );
    }
  }

  // Custom page route for smooth transitions
  static Route<T> _createRoute<T>(Widget page) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.easeInOutCubic;

        var tween = Tween(
          begin: begin,
          end: end,
        ).chain(CurveTween(curve: curve));
        var offsetAnimation = animation.drive(tween);

        return SlideTransition(position: offsetAnimation, child: child);
      },
      transitionDuration: const Duration(milliseconds: 300),
    );
  }
}
