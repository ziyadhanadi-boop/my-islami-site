class Article {
  final String id;
  final String title;
  final String content;
  final String category;
  final String? imageUrl;
  final String? slug;
  final DateTime createdAt;
  final int views;
  final bool isFeatured;
  final int? featuredPosition;
  final bool isHidden;

  Article({
    required this.id,
    required this.title,
    required this.content,
    required this.category,
    this.imageUrl,
    this.slug,
    required this.createdAt,
    this.views = 0,
    this.isFeatured = false,
    this.featuredPosition,
    this.isHidden = false,
  });

  factory Article.fromJson(Map<String, dynamic> json) {
    return Article(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      category: json['category'] ?? '',
      imageUrl: json['imageUrl'],
      slug: json['slug'],
      createdAt: DateTime.parse(
        json['createdAt'] ?? DateTime.now().toIso8601String(),
      ),
      views: json['views'] ?? 0,
      isFeatured: json['isFeatured'] ?? false,
      featuredPosition: json['featuredPosition'],
      isHidden: json['isHidden'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'content': content,
      'category': category,
      'imageUrl': imageUrl,
      'slug': slug,
      'createdAt': createdAt.toIso8601String(),
      'views': views,
      'isFeatured': isFeatured,
      'featuredPosition': featuredPosition,
      'isHidden': isHidden,
    };
  }

  String get excerpt {
    // Remove HTML tags and return first 150 characters
    String plainText = content.replaceAll(RegExp(r'<[^>]*>'), '');
    if (plainText.length > 150) {
      return '${plainText.substring(0, 150)}...';
    }
    return plainText;
  }
}
