import 'package:flutter/foundation.dart';
import '../core/services/api_service.dart';
import '../core/services/storage_service.dart';

class QuranProvider with ChangeNotifier {
  final ApiService _apiService;
  final StorageService _storageService;

  QuranProvider(this._apiService, this._storageService);

  List<Map<String, dynamic>> _surahs = [];
  Map<String, dynamic>? _currentSurah;
  Map<String, dynamic>? _khatmahProgress;
  bool _isLoading = false;
  String? _error;

  List<Map<String, dynamic>> get surahs => _surahs;
  Map<String, dynamic>? get currentSurah => _currentSurah;
  Map<String, dynamic>? get khatmahProgress => _khatmahProgress;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // 114 Surahs of the Quran with basic info
  static const List<Map<String, dynamic>> quranSurahs = [
    {
      'number': 1,
      'name': 'الفاتحة',
      'englishName': 'Al-Fatiha',
      'ayahs': 7,
      'revelationType': 'Meccan',
    },
    {
      'number': 2,
      'name': 'البقرة',
      'englishName': 'Al-Baqarah',
      'ayahs': 286,
      'revelationType': 'Medinan',
    },
    {
      'number': 3,
      'name': 'آل عمران',
      'englishName': 'Ali \'Imran',
      'ayahs': 200,
      'revelationType': 'Medinan',
    },
    {
      'number': 4,
      'name': 'النساء',
      'englishName': 'An-Nisa',
      'ayahs': 176,
      'revelationType': 'Medinan',
    },
    {
      'number': 5,
      'name': 'المائدة',
      'englishName': 'Al-Ma\'idah',
      'ayahs': 120,
      'revelationType': 'Medinan',
    },
    {
      'number': 6,
      'name': 'الأنعام',
      'englishName': 'Al-An\'am',
      'ayahs': 165,
      'revelationType': 'Meccan',
    },
    {
      'number': 7,
      'name': 'الأعراف',
      'englishName': 'Al-A\'raf',
      'ayahs': 206,
      'revelationType': 'Meccan',
    },
    {
      'number': 8,
      'name': 'الأنفال',
      'englishName': 'Al-Anfal',
      'ayahs': 75,
      'revelationType': 'Medinan',
    },
    {
      'number': 9,
      'name': 'التوبة',
      'englishName': 'At-Tawbah',
      'ayahs': 129,
      'revelationType': 'Medinan',
    },
    {
      'number': 10,
      'name': 'يونس',
      'englishName': 'Yunus',
      'ayahs': 109,
      'revelationType': 'Meccan',
    },
    {
      'number': 11,
      'name': 'هود',
      'englishName': 'Hud',
      'ayahs': 123,
      'revelationType': 'Meccan',
    },
    {
      'number': 12,
      'name': 'يوسف',
      'englishName': 'Yusuf',
      'ayahs': 111,
      'revelationType': 'Meccan',
    },
    {
      'number': 13,
      'name': 'الرعد',
      'englishName': 'Ar-Ra\'d',
      'ayahs': 43,
      'revelationType': 'Medinan',
    },
    {
      'number': 14,
      'name': 'إبراهيم',
      'englishName': 'Ibrahim',
      'ayahs': 52,
      'revelationType': 'Meccan',
    },
    {
      'number': 15,
      'name': 'الحجر',
      'englishName': 'Al-Hijr',
      'ayahs': 99,
      'revelationType': 'Meccan',
    },
    {
      'number': 16,
      'name': 'النحل',
      'englishName': 'An-Nahl',
      'ayahs': 128,
      'revelationType': 'Meccan',
    },
    {
      'number': 17,
      'name': 'الإسراء',
      'englishName': 'Al-Isra',
      'ayahs': 111,
      'revelationType': 'Meccan',
    },
    {
      'number': 18,
      'name': 'الكهف',
      'englishName': 'Al-Kahf',
      'ayahs': 110,
      'revelationType': 'Meccan',
    },
    {
      'number': 19,
      'name': 'مريم',
      'englishName': 'Maryam',
      'ayahs': 98,
      'revelationType': 'Meccan',
    },
    {
      'number': 20,
      'name': 'طه',
      'englishName': 'Taha',
      'ayahs': 135,
      'revelationType': 'Meccan',
    },
    {
      'number': 21,
      'name': 'الأنبياء',
      'englishName': 'Al-Anbya',
      'ayahs': 112,
      'revelationType': 'Meccan',
    },
    {
      'number': 22,
      'name': 'الحج',
      'englishName': 'Al-Hajj',
      'ayahs': 78,
      'revelationType': 'Medinan',
    },
    {
      'number': 23,
      'name': 'المؤمنون',
      'englishName': 'Al-Mu\'minun',
      'ayahs': 118,
      'revelationType': 'Meccan',
    },
    {
      'number': 24,
      'name': 'النور',
      'englishName': 'An-Nur',
      'ayahs': 64,
      'revelationType': 'Medinan',
    },
    {
      'number': 25,
      'name': 'الفرقان',
      'englishName': 'Al-Furqan',
      'ayahs': 77,
      'revelationType': 'Meccan',
    },
    {
      'number': 26,
      'name': 'الشعراء',
      'englishName': 'Ash-Shu\'ara',
      'ayahs': 227,
      'revelationType': 'Meccan',
    },
    {
      'number': 27,
      'name': 'النمل',
      'englishName': 'An-Naml',
      'ayahs': 93,
      'revelationType': 'Meccan',
    },
    {
      'number': 28,
      'name': 'القصص',
      'englishName': 'Al-Qasas',
      'ayahs': 88,
      'revelationType': 'Meccan',
    },
    {
      'number': 29,
      'name': 'العنكبوت',
      'englishName': 'Al-\'Ankabut',
      'ayahs': 69,
      'revelationType': 'Meccan',
    },
    {
      'number': 30,
      'name': 'الروم',
      'englishName': 'Ar-Rum',
      'ayahs': 60,
      'revelationType': 'Meccan',
    },
    // Add more surahs as needed... up to 114
  ];

  void init() {
    _surahs = quranSurahs;
    _khatmahProgress = _storageService.getKhatmahProgress();
    notifyListeners();
  }

  Map<String, dynamic>? getSurah(int number) {
    try {
      return _surahs.firstWhere((surah) => surah['number'] == number);
    } catch (e) {
      return null;
    }
  }

  Future<void> setKhatmahProgress({
    required String surahName,
    required int ayahNumber,
  }) async {
    await _storageService.setKhatmahProgress(
      surahName: surahName,
      ayahNumber: ayahNumber,
      timestamp: DateTime.now(),
    );
    _khatmahProgress = {
      'surahName': surahName,
      'ayahNumber': ayahNumber,
      'timestamp': DateTime.now().toIso8601String(),
    };
    notifyListeners();
  }

  Future<void> clearKhatmahProgress() async {
    await _storageService.clearKhatmahProgress();
    _khatmahProgress = null;
    notifyListeners();
  }

  double getReadingProgress() {
    if (_khatmahProgress == null) return 0.0;
    // Calculate progress based on current position
    // This is a simplified calculation
    return 0.0;
  }
}
