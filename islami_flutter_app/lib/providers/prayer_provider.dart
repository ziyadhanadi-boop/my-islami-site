import 'package:flutter/foundation.dart';
import '../core/services/storage_service.dart';

class PrayerProvider with ChangeNotifier {
  final StorageService _storageService;

  PrayerProvider(this._storageService);

  Map<String, dynamic> _prayerTimes = {};
  String _calculationMethod = 'UmmAlQura';
  String _asrMethod = 'Standard';
  Map<String, bool> _prayerAlerts = {
    'fajr': false,
    'dhuhr': false,
    'asr': false,
    'maghrib': false,
    'isha': false,
  };
  String? _city;
  String? _country;

  Map<String, dynamic> get prayerTimes => _prayerTimes;
  String get calculationMethod => _calculationMethod;
  String get asrMethod => _asrMethod;
  Map<String, bool> get prayerAlerts => _prayerAlerts;
  String? get city => _city;
  String? get country => _country;

  void init() {
    final settings = _storageService.getPrayerSettings();
    _calculationMethod = settings['calculation_method'] ?? 'UmmAlQura';
    _asrMethod = settings['asr_method'] ?? 'Standard';
    _prayerAlerts = {
      'fajr': settings['fajr_alert'] ?? false,
      'dhuhr': settings['dhuhr_alert'] ?? false,
      'asr': settings['asr_alert'] ?? false,
      'maghrib': settings['maghrib_alert'] ?? false,
      'isha': settings['isha_alert'] ?? false,
    };
    notifyListeners();
  }

  Future<void> setCalculationMethod(String method) async {
    _calculationMethod = method;
    await _storageService.setPrayerSettings(calculationMethod: method);
    notifyListeners();
  }

  Future<void> setAsrMethod(String method) async {
    _asrMethod = method;
    await _storageService.setPrayerSettings(asrMethod: method);
    notifyListeners();
  }

  Future<void> setPrayerAlert(String prayer, bool enabled) async {
    _prayerAlerts[prayer] = enabled;
    await _storageService.setPrayerSettings(
      fajrAlert: _prayerAlerts['fajr'],
      dhuhrAlert: _prayerAlerts['dhuhr'],
      asrAlert: _prayerAlerts['asr'],
      maghribAlert: _prayerAlerts['maghrib'],
      ishaAlert: _prayerAlerts['isha'],
    );
    notifyListeners();
  }

  Future<void> setLocation({String? city, String? country}) async {
    _city = city;
    _country = country;
    notifyListeners();
  }

  // Calculate prayer times based on date and location
  // This is a simplified implementation - in production, use a proper library
  Future<Map<String, dynamic>> calculatePrayerTimes({
    required DateTime date,
    required double latitude,
    required double longitude,
  }) async {
    // This would use a proper prayer times calculation library
    // For now, return mock data
    _prayerTimes = {
      'fajr': '05:00',
      'sunrise': '06:30',
      'dhuhr': '12:30',
      'asr': '15:45',
      'maghrib': '18:30',
      'isha': '20:00',
    };
    notifyListeners();
    return _prayerTimes;
  }

  String getNextPrayer() {
    // Calculate next prayer based on current time
    // This is a simplified implementation
    final now = DateTime.now();
    final currentHour = now.hour;
    final currentMinute = now.minute;

    // Simple logic to determine next prayer
    if (currentHour < 5) return 'fajr';
    if (currentHour < 6 || (currentHour == 6 && currentMinute < 30))
      return 'sunrise';
    if (currentHour < 12 || (currentHour == 12 && currentMinute < 30))
      return 'dhuhr';
    if (currentHour < 15 || (currentHour == 15 && currentMinute < 45))
      return 'asr';
    if (currentHour < 18 || (currentHour == 18 && currentMinute < 30))
      return 'maghrib';
    return 'isha';
  }

  String getHijriDate() {
    // Return Hijri date - simplified
    return '1447 هـ';
  }
}
