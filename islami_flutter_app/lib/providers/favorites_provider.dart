import 'package:flutter/foundation.dart';
import '../core/services/storage_service.dart';

class FavoritesProvider with ChangeNotifier {
  final StorageService _storageService;

  FavoritesProvider(this._storageService);

  List<Map<String, dynamic>> _favorites = [];

  List<Map<String, dynamic>> get favorites => _favorites;

  void loadFavorites() {
    // Load all favorites from storage
    _favorites = [];

    // Articles
    _favorites.addAll(_storageService.getFavoritesByType('article'));

    // Duas
    _favorites.addAll(_storageService.getFavoritesByType('dua'));

    // Prophet Stories
    _favorites.addAll(_storageService.getFavoritesByType('prophet_story'));

    // Podcasts
    _favorites.addAll(_storageService.getFavoritesByType('podcast'));

    notifyListeners();
  }

  Future<void> addFavorite({
    required String type,
    required String id,
    required Map<String, dynamic> data,
  }) async {
    await _storageService.addFavorite(type, id, data);
    loadFavorites();
  }

  Future<void> removeFavorite({
    required String type,
    required String id,
  }) async {
    await _storageService.removeFavorite(type, id);
    loadFavorites();
  }

  bool isFavorite({required String type, required String id}) {
    return _storageService.isFavorite(type, id);
  }

  List<Map<String, dynamic>> getFavoritesByType(String type) {
    return _favorites.where((fav) => fav['type'] == type).toList();
  }

  int get favoritesCount => _favorites.length;
}
