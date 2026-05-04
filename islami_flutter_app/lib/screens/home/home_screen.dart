import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:carousel_slider/carousel_slider.dart';

import '../../core/theme/app_theme.dart';
import '../../providers/articles_provider.dart';
import '../../providers/audio_provider.dart';
import '../../providers/prayer_provider.dart';
import '../../providers/favorites_provider.dart';
import '../../models/article.dart';
import '../widgets/article_card.dart';
import '../widgets/prayer_times_widget.dart';
import '../widgets/azkar_widget.dart';
import '../widgets/daily_quote_widget.dart';
import '../widgets/bottom_navigation.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final articlesProvider = context.read<ArticlesProvider>();
    await articlesProvider.fetchArticles();
    await articlesProvider.fetchFeaturedArticles();
    await articlesProvider.fetchMostReadArticles();
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) return 'صباح يتنفس بذكر الله 🌤️';
    if (hour >= 12 && hour < 15) return 'طاب نهارك بطاعة الرحمن ☀️';
    if (hour >= 15 && hour < 18) return 'مساء السكينة والطمأنينة 🌅';
    return 'ليلة تحفها رحمات الله 🌙';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadData,
          child: CustomScrollView(
            slivers: [
              // Hero Section
              SliverToBoxAdapter(child: _buildHeroSection()),

              // Prayer Times Widget
              SliverToBoxAdapter(child: const PrayerTimesWidget()),

              // Azkar Widget
              SliverToBoxAdapter(child: const AzkarWidget()),

              // Featured Articles Section
              SliverToBoxAdapter(child: _buildFeaturedSection()),

              // Category Sections
              SliverToBoxAdapter(
                child: _buildCategorySection(
                  'قسم السيرة والتاريخ',
                  '📜',
                  'السيرة والتاريخ',
                ),
              ),
              SliverToBoxAdapter(
                child: _buildCategorySection(
                  'فقه العبادات والمعاملات',
                  '⚖️',
                  'فقه الصلاة',
                ),
              ),
              SliverToBoxAdapter(
                child: _buildCategorySection(
                  'علوم القرآن الكريم',
                  '📖',
                  'علوم القرآن',
                ),
              ),

              // Special Sections Grid
              SliverToBoxAdapter(child: _buildSpecialSections()),

              // Most Read
              SliverToBoxAdapter(child: _buildMostReadSection()),

              // Daily Hadith
              SliverToBoxAdapter(child: _buildDailyHadith()),

              // Padding at bottom for navigation
              const SliverToBoxAdapter(child: SizedBox(height: 80)),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationWidget(
        selectedIndex: _selectedIndex,
        onItemSelected: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
      ),
    );
  }

  Widget _buildHeroSection() {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: AppTheme.heroGradient,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Background Image
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: Image.network(
                'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=1600',
                fit: BoxFit.cover,
                color: Colors.black.withOpacity(0.4),
                colorBlendMode: BlendMode.darken,
              ),
            ),
          ),
          // Content
          Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.white.withOpacity(0.2)),
                  ),
                  child: Text(
                    '✨ ${_getGreeting()}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'نورٌ ومعرفة..\nفي رحاب الشريعة',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Cairo',
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'دليلك الشامل للمقالات الإسلامية الموثوقة، أوقات الصلاة، وأذكار اليوم الموثقة.',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 14,
                    fontFamily: 'Cairo',
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pushNamed(context, '/zikr');
                      },
                      icon: const Icon(Icons.handshake, size: 24),
                      label: const Text('اذكر الله يذكرك'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: AppTheme.primaryColor,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.2),
                          ),
                        ),
                        child: const Text(
                          '1447 هـ',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedSection() {
    return Consumer<ArticlesProvider>(
      builder: (context, provider, child) {
        if (provider.featuredArticles.isEmpty) {
          return const SizedBox.shrink();
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  const Text('✨', style: TextStyle(fontSize: 24)),
                  const SizedBox(width: 8),
                  Text(
                    'مقالات مميزة',
                    style: AppTheme.heading3.copyWith(
                      color: AppTheme.primaryColor,
                    ),
                  ),
                ],
              ),
            ),
            CarouselSlider.builder(
              itemCount: provider.featuredArticles.length,
              options: CarouselOptions(
                height: 200,
                viewportFraction: 0.85,
                enlargeCenterPage: true,
                autoPlay: true,
                autoPlayInterval: const Duration(seconds: 5),
              ),
              itemBuilder: (context, index, realIndex) {
                final article = provider.featuredArticles[index];
                return ArticleCard(article: article);
              },
            ),
          ],
        );
      },
    );
  }

  Widget _buildCategorySection(
    String title,
    String emoji,
    String categoryName,
  ) {
    return Consumer<ArticlesProvider>(
      builder: (context, provider, child) {
        final articles = provider.getArticlesByCategory(categoryName);
        if (articles.isEmpty) return const SizedBox.shrink();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  Text(emoji, style: const TextStyle(fontSize: 24)),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: AppTheme.heading3.copyWith(
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  const Spacer(),
                  TextButton(
                    onPressed: () {
                      Navigator.pushNamed(
                        context,
                        '/category',
                        arguments: {'categoryName': categoryName},
                      );
                    },
                    child: const Text('عرض الكل ←'),
                  ),
                ],
              ),
            ),
            SizedBox(
              height: 220,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: articles.length,
                separatorBuilder: (context, index) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  return SizedBox(
                    width: 180,
                    child: ArticleCard(article: articles[index]),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildSpecialSections() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('🌟', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 8),
              Text(
                'أقسام متميزة',
                style: AppTheme.heading3.copyWith(color: AppTheme.primaryColor),
              ),
            ],
          ),
          const SizedBox(height: 16),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.6,
            children: [
              _buildSpecialCard(
                '🤲',
                'مكتبة الأدعية',
                'أدعية مأثورة من القرآن والسنة',
                Colors.teal,
                () => Navigator.pushNamed(context, '/duas'),
              ),
              _buildSpecialCard(
                '📜',
                'قصص الأنبياء',
                'سير وقصص الأنبياء عليهم السلام',
                Colors.purple,
                () => Navigator.pushNamed(context, '/prophet-stories'),
              ),
              _buildSpecialCard(
                '🌿',
                'الطب النبوي',
                'أعشاب وأطعمة من هدي النبي ﷺ',
                Colors.green,
                () => Navigator.pushNamed(context, '/tibb-nabawi'),
              ),
              _buildSpecialCard(
                '🎙️',
                'البودكاست',
                'محاضرات ودروس صوتية',
                Colors.indigo,
                () => Navigator.pushNamed(context, '/podcast'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSpecialCard(
    String emoji,
    String title,
    String subtitle,
    Color color,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [color, color.withOpacity(0.7)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.3),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 32)),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(
                color: Colors.white.withOpacity(0.8),
                fontSize: 10,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMostReadSection() {
    return Consumer<ArticlesProvider>(
      builder: (context, provider, child) {
        if (provider.mostReadArticles.isEmpty) return const SizedBox.shrink();

        return Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.lightSurfaceColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.lightBorderColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text('🔥', style: TextStyle(fontSize: 20)),
                  const SizedBox(width: 8),
                  Text(
                    'الأكثر قراءة',
                    style: AppTheme.heading3.copyWith(
                      color: AppTheme.primaryColor,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: provider.mostReadArticles.take(5).length,
                separatorBuilder: (context, index) => const Divider(),
                itemBuilder: (context, index) {
                  final article = provider.mostReadArticles[index];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: index == 0
                          ? Colors.amber
                          : index == 1
                          ? Colors.grey
                          : Colors.brown,
                      child: Text(
                        '${index + 1}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    title: Text(
                      article.title,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      Navigator.pushNamed(
                        context,
                        '/article',
                        arguments: article,
                      );
                    },
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDailyHadith() {
    return FutureBuilder<Map<String, dynamic>>(
      future: context.read<ArticlesProvider>().fetchRandomHadith != null
          ? context.read<ArticlesProvider>().fetchRandomHadith()
          : Future.value({
              'text': '«من دل على خير فله مثل أجر فاعله»',
              'source': 'رواه مسلم',
            }),
      builder: (context, snapshot) {
        final hadith =
            snapshot.data ??
            {
              'text': '«من دل على خير فله مثل أجر فاعله»',
              'source': 'رواه مسلم',
            };

        return Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.lightSurfaceColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.lightBorderColor),
            borderRight: BorderSide(color: AppTheme.secondaryColor, width: 4),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text('🔖', style: TextStyle(fontSize: 20)),
                  const SizedBox(width: 8),
                  Text(
                    'حديث اليوم',
                    style: AppTheme.heading3.copyWith(
                      color: AppTheme.secondaryColor,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                hadith['text'] ?? '',
                style: const TextStyle(
                  fontSize: 16,
                  fontStyle: FontStyle.italic,
                  height: 1.8,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '— ${hadith['source'] ?? ''}',
                style: TextStyle(fontSize: 12, color: AppTheme.lightTextMuted),
                textAlign: TextAlign.left,
              ),
            ],
          ),
        );
      },
    );
  }
}
