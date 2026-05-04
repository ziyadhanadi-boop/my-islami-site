import 'package:hive_flutter/hive_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  late Box _userPreferences;
  late Box _favorites;
  late Box _prayerSettings;
  late Box _khatmahProgress;
  late SharedPreferences _prefs;

  Future<void> init() async {
    _userPreferences = Hive.box('user_preferences');
    _favorites = Hive.box('favorites');
    _prayerSettings = Hive.box('prayer_settings');
    _khatmahProgress = Hive.box('khatmah_progress');
    _prefs = await SharedPreferences.getInstance();
  }

  // ==================== User Preferences ====================

  Future<void> setTheme(String theme) async {
    await _userPreferences.put('theme', theme);
  }

  String getTheme() {
    return _userPreferences.get('theme', defaultValue: 'system');
  }

  Future<void> setLanguage(String language) async {
    await _userPreferences.put('language', language);
  }

  String getLanguage() {
    return _userPreferences.get('language', defaultValue: 'ar');
  }

  // ==================== Favorites ====================

  Future<void> addFavorite(
    String type,
    String id,
    Map<String, dynamic> data,
  ) async {
    await _favorites.put('${type}_$id', data);
  }

  Future<void> removeFavorite(String type, String id) async {
    await _favorites.delete('${type}_$id');
  }

  bool isFavorite(String type, String id) {
    return _favorites.containsKey('${type}_$id');
  }

  List<Map<String, dynamic>> getFavoritesByType(String type) {
    final favorites = <Map<String, dynamic>>[];
    _favorites.forEach((key, value) {
      if (key.toString().startsWith('${type}_')) {
        favorites.add(Map<String, dynamic>.from(value));
      }
    });
    return favorites;
  }

  // ==================== Prayer Settings ====================

  Future<void> setPrayerSettings({
    String? calculationMethod,
    String? asrMethod,
    bool? fajrAlert,
    bool? dhuhrAlert,
    bool? asrAlert,
    bool? maghribAlert,
    bool? ishaAlert,
  }) async {
    if (calculationMethod != null) {
      await _prayerSettings.put('calculation_method', calculationMethod);
    }
    if (asrMethod != null) {
      await _prayerSettings.put('asr_method', asrMethod);
    }
    if (fajrAlert != null) {
      await _prayerSettings.put('fajr_alert', fajrAlert);
    }
    if (dhuhrAlert != null) {
      await _prayerSettings.put('dhuhr_alert', dhuhrAlert);
    }
    if (asrAlert != null) {
      await _prayerSettings.put('asr_alert', asrAlert);
    }
    if (maghribAlert != null) {
      await _prayerSettings.put('maghrib_alert', maghribAlert);
    }
    if (ishaAlert != null) {
      await _prayerSettings.put('isha_alert', ishaAlert);
    }
  }

  Map<String, dynamic> getPrayerSettings() {
    return {
      'calculation_method': _prayerSettings.get(
        'calculation_method',
        defaultValue: 'UmmAlQura',
      ),
      'asr_method': _prayerSettings.get('asr_method', defaultValue: 'Standard'),
      'fajr_alert': _prayerSettings.get('fajr_alert', defaultValue: false),
      'dhuhr_alert': _prayerSettings.get('dhuhr_alert', defaultValue: false),
      'asr_alert': _prayerSettings.get('asr_alert', defaultValue: false),
      'maghrib_alert': _prayerSettings.get(
        'maghrib_alert',
        defaultValue: false,
      ),
      'isha_alert': _prayerSettings.get('isha_alert', defaultValue: false),
    };
  }

  // ==================== Khatmah Progress ====================

  Future<void> setKhatmahProgress({
    required String surahName,
    required int ayahNumber,
    required DateTime timestamp,
  }) async {
    await _khatmahProgress.put('current_khatmah', {
      'surahName': surahName,
      'ayahNumber': ayahNumber,
      'timestamp': timestamp.toIso8601String(),
    });
  }

  Map<String, dynamic>? getKhatmahProgress() {
    final data = _khatmahProgress.get('current_khatmah');
    if (data != null) {
      return Map<String, dynamic>.from(data);
    }
    return null;
  }

  Future<void> clearKhatmahProgress() async {
    await _khatmahProgress.delete('current_khatmah');
  }

  // ==================== General Storage ====================

  Future<void> saveString(String key, String value) async {
    await _prefs.setString(key, value);
  }

  String? getString(String key, {String? defaultValue}) {
    return _prefs.getString(key) ?? defaultValue;
  }

  Future<void> saveInt(String key, int value) async {
    await _prefs.setInt(key, value);
  }

  int? getInt(String key, {int? defaultValue}) {
    return _prefs.getInt(key) ?? defaultValue;
  }

  Future<void> saveBool(String key, bool value) async {
    await _prefs.setBool(key, value);
  }

  bool? getBool(String key, {bool? defaultValue}) {
    return _prefs.getBool(key) ?? defaultValue;
  }

  Future<void> remove(String key) async {
    await _prefs.remove(key);
  }

  Future<void> clearAll() async {
    await _prefs.clear();
  }

  // ==================== Salat Counter ====================

  Future<void> incrementSalatCount() async {
    final current = getInt('salat_count', defaultValue: 0) ?? 0;
    await saveInt('salat_count', current + 1);
  }

  int getSalatCount() {
    return getInt('salat_count', defaultValue: 0) ?? 0;
  }

  Future<void> resetSalatCount() async {
    await saveInt('salat_count', 0);
  }

  // ==================== Last Visit ====================

  DateTime? getLastVisit() {
    final timestamp = getString('last_visit');
    if (timestamp != null) {
      return DateTime.parse(timestamp);
    }
    return null;
  }

  Future<void> setLastVisit() async {
    await saveString('last_visit', DateTime.now().toIso8601String());
  }
}
