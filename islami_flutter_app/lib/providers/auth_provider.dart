import 'package:flutter/foundation.dart';
import '../core/services/api_service.dart';
import '../core/services/storage_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService;
  final StorageService _storageService;

  AuthProvider(this._apiService, this._storageService);

  bool _isLoading = false;
  bool _isAuthenticated = false;
  String? _token;
  Map<String, dynamic>? _user;

  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  String? get token => _token;
  Map<String, dynamic>? get user => _user;

  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.post(
        '/api/auth/login',
        data: {'email': email, 'password': password},
      );

      if (response.data['token'] != null) {
        _token = response.data['token'];
        _user = response.data['user'];
        _isAuthenticated = true;
        await _storageService.saveString('auth_token', _token!);
      }
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.post(
        '/api/auth/register',
        data: {'name': name, 'email': email, 'password': password},
      );

      if (response.data['token'] != null) {
        _token = response.data['token'];
        _user = response.data['user'];
        _isAuthenticated = true;
        await _storageService.saveString('auth_token', _token!);
      }
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    _isAuthenticated = false;
    await _storageService.remove('auth_token');
    notifyListeners();
  }

  Future<void> checkAuth() async {
    _token = _storageService.getString('auth_token');
    if (_token != null) {
      _isAuthenticated = true;
    }
    notifyListeners();
  }

  Future<void> updateProfile({String? name, String? email}) async {
    if (_token == null) return;

    try {
      final response = await _apiService.put(
        '/api/auth/profile',
        data: {
          if (name != null) 'name': name,
          if (email != null) 'email': email,
        },
      );

      _user = response.data['user'];
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    if (_token == null) return;

    await _apiService.put(
      '/api/auth/change-password',
      data: {'currentPassword': currentPassword, 'newPassword': newPassword},
    );
  }
}
