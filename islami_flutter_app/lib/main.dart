import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'core/theme/app_theme.dart';
import 'core/routes/app_routes.dart';
import 'core/services/api_service.dart';
import 'core/services/audio_service.dart';
import 'core/services/notification_service.dart';
import 'core/services/storage_service.dart';
import 'providers/auth_provider.dart';
import 'providers/articles_provider.dart';
import 'providers/quran_provider.dart';
import 'providers/audio_provider.dart';
import 'providers/favorites_provider.dart';
import 'providers/prayer_provider.dart';
import 'screens/home/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  // Set status bar style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  
  // Initialize Hive for local storage
  await Hive.initFlutter();
  
  // Initialize boxes
  await Hive.openBox('user_preferences');
  await Hive.openBox('favorites');
  await Hive.openBox('prayer_settings');
  await Hive.openBox('khatmah_progress');
  
  // Initialize services
  final apiService = ApiService();
  final storageService = StorageService();
  final notificationService = NotificationService();
  
  await notificationService.init();
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(apiService, storageService)),
        ChangeNotifierProvider(create: (_) => ArticlesProvider(apiService)),
        ChangeNotifierProvider(create: (_) => QuranProvider(apiService, storageService)),
        ChangeNotifierProvider(create: (_) => AudioProvider(AudioPlayerService())),
        ChangeNotifierProvider(create: (_) => FavoritesProvider(storageService)),
        ChangeNotifierProvider(create: (_) => PrayerProvider(storageService)),
      ],
      child: const IslamiApp(),
    ),
  );
}

class IslamiApp extends StatelessWidget {
  const IslamiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'منصة إسلامي',
      debugShowCheckedModeBanner: false,
      
      // Arabic/RTL Support
      locale: const Locale('ar'),
      supportedLocales: const [
        Locale('ar'), // Arabic
        Locale('en'), // English
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      
      // Theme
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      
      // Routes
      initialRoute: AppRoutes.home,
      onGenerateRoute: AppRoutes.generateRoute,
      
      // Home Screen
      home: const HomeScreen(),
    );
  }
}