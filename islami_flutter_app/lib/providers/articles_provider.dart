import 'package:flutter/foundation.dart';
import '../core/services/api_service.dart';
import '../models/article.dart';

class ArticlesProvider with ChangeNotifier {
  final ApiService _apiService;

  ArticlesProvider(this._apiService);

  List<Article> _articles = [];
  List<Article> _featuredArticles = [];
  List<Article> _mostReadArticles = [];
  bool _isLoading = false;
  String? _error;

  List<Article> get articles => _articles;
  List<Article> get featuredArticles => _featuredArticles;
  List<Article> get mostReadArticles => _mostReadArticles;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchArticles({String? category}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _apiService.getArticles(category: category);
      _articles = (data as List).map((json) => Article.fromJson(json)).toList();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchFeaturedArticles() async {
    try {
      final data = await _apiService.getFeaturedArticles();
      _featuredArticles = (data as List)
          .map((json) => Article.fromJson(json))
          .toList();
    } catch (e) {
      _error = e.toString();
    }
    notifyListeners();
  }

  Future<void> fetchMostReadArticles() async {
    try {
      final data = await _apiService.getMostReadArticles();
      _mostReadArticles = (data as List)
          .map((json) => Article.fromJson(json))
          .toList();
    } catch (e) {
      _error = e.toString();
    }
    notifyListeners();
  }

  List<Article> getArticlesByCategory(String category) {
    return _articles.where((article) => article.category == category).toList();
  }

  Article? getArticleById(String id) {
    try {
      return _articles.firstWhere((article) => article.id == id);
    } catch (e) {
      return null;
    }
  }

  Article? getArticleBySlug(String slug) {
    try {
      return _articles.firstWhere((article) => article.slug == slug);
    } catch (e) {
      return null;
    }
  }

  List<String> getCategories() {
    final categories = _articles
        .map((article) => article.category)
        .toSet()
        .toList();
    return categories;
  }

  Future<void> searchArticles(String query) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Filter locally first
      if (query.isEmpty) {
        await fetchArticles();
      } else {
        _articles = _articles
            .where(
              (article) =>
                  article.title.toLowerCase().contains(query.toLowerCase()) ||
                  article.content.toLowerCase().contains(query.toLowerCase()),
            )
            .toList();
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
