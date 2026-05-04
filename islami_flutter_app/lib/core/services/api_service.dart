import 'package:dio/dio.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class ApiService {
  static const String baseUrl =
      'https://my-islami-site.onrender.com'; // قم بتغيير هذا الرابط بعد اكتمال الرفع على Render
  late final Dio _dio;

  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Add interceptors for logging and error handling
    _dio.interceptors.add(
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        error: true,
        logPrint: (obj) => print(obj),
      ),
    );
  }

  // Check internet connection
  Future<bool> isConnected() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    return !connectivityResult.contains(ConnectivityResult.none);
  }

  // Generic GET request
  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      if (!await isConnected()) {
        throw DioException(
          requestOptions: RequestOptions(path: path),
          message: 'لا يوجد اتصال بالإنترنت',
          type: DioExceptionType.connectionTimeout,
        );
      }

      return await _dio.get(path, queryParameters: queryParameters);
    } catch (e) {
      _handleError(e);
      rethrow;
    }
  }

  // Generic POST request
  Future<Response> post(String path, {dynamic data}) async {
    try {
      if (!await isConnected()) {
        throw DioException(
          requestOptions: RequestOptions(path: path),
          message: 'لا يوجد اتصال بالإنترنت',
          type: DioExceptionType.connectionTimeout,
        );
      }

      return await _dio.post(path, data: data);
    } catch (e) {
      _handleError(e);
      rethrow;
    }
  }

  // Generic PUT request
  Future<Response> put(String path, {dynamic data}) async {
    try {
      return await _dio.put(path, data: data);
    } catch (e) {
      _handleError(e);
      rethrow;
    }
  }

  // Generic DELETE request
  Future<Response> delete(String path) async {
    try {
      return await _dio.delete(path);
    } catch (e) {
      _handleError(e);
      rethrow;
    }
  }

  // Error handler
  void _handleError(dynamic error) {
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.connectionTimeout:
          print('انتهت مهلة الاتصال');
          break;
        case DioExceptionType.sendTimeout:
          print('انتهت مهلة الإرسال');
          break;
        case DioExceptionType.receiveTimeout:
          print('انتهت مهلة الاستلام');
          break;
        case DioExceptionType.badResponse:
          print('خطأ في الخادم: ${error.response?.statusCode}');
          break;
        case DioExceptionType.connectionError:
          print('خطأ في الاتصال');
          break;
        default:
          print('خطأ غير معروف: ${error.message}');
      }
    }
  }

  // ==================== API ENDPOINTS ====================

  // Articles
  Future<List> getArticles({String? category, int? page}) async {
    final response = await get(
      '/api/articles',
      queryParameters: {
        if (category != null) 'category': category,
        if (page != null) 'page': page,
      },
    );
    return response.data;
  }

  Future<List> getMostReadArticles() async {
    final response = await get('/api/articles/most-read');
    return response.data;
  }

  Future<List> getFeaturedArticles() async {
    final response = await get(
      '/api/articles',
      queryParameters: {'featured': true},
    );
    return response.data.where((a) => a['isFeatured'] == true).toList();
  }

  // Duas
  Future<List> getDuas() async {
    final response = await get('/api/duas');
    return response.data;
  }

  // Prophet Stories
  Future<List> getProphetStories() async {
    final response = await get('/api/prophet-stories');
    return response.data;
  }

  // Tibb (Prophetic Medicine)
  Future<List> getTibbItems() async {
    final response = await get('/api/tibb');
    return response.data;
  }

  // Podcasts
  Future<List> getPodcasts() async {
    final response = await get('/api/podcasts');
    return response.data;
  }

  // Fatwas
  Future<List> getFatwas() async {
    final response = await get('/api/fatwaArchive');
    return response.data;
  }

  // Zikr
  Future<List> getZikrItems() async {
    final response = await get('/api/zikr');
    return response.data;
  }

  // Hadith
  Future<Map<String, dynamic>> getRandomHadith() async {
    final response = await get('/api/hadith/random');
    return response.data;
  }

  // Quiz
  Future<List> getQuizzes() async {
    final response = await get('/api/quizzes');
    return response.data;
  }

  // Kids Content
  Future<List> getKidsContent() async {
    final response = await get('/api/kidContent');
    return response.data;
  }

  // Daily Quotes
  Future<List> getDailyQuotes() async {
    final response = await get('/api/daily-quotes');
    return response.data;
  }

  // Books
  Future<List> getBooks() async {
    final response = await get('/api/books');
    return response.data;
  }

  // Videos
  Future<List> getVideos() async {
    final response = await get('/api/videosList');
    return response.data;
  }

  // Events
  Future<List> getEvents() async {
    final response = await get('/api/events');
    return response.data;
  }

  // Media
  Future<List> getMedia() async {
    final response = await get('/api/media');
    return response.data;
  }

  // Khatmah
  Future<List> getKhatmahProgress() async {
    final response = await get('/api/khatmah');
    return response.data;
  }

  // Analytics
  Future<void> trackVisit({
    required String country,
    required String countryCode,
    required String path,
  }) async {
    try {
      await post(
        '/api/analytics/track',
        data: {'country': country, 'countryCode': countryCode, 'path': path},
      );
    } catch (e) {
      // Silent fail for analytics
      print('Analytics tracking failed: $e');
    }
  }

  // Newsletter
  Future<void> subscribeToNewsletter(String email) async {
    await post('/api/newsletter/subscribe', data: {'email': email});
  }

  // Contact/Message
  Future<void> sendMessage({
    required String name,
    required String email,
    required String message,
  }) async {
    await post(
      '/api/messages',
      data: {'name': name, 'email': email, 'message': message},
    );
  }
}
