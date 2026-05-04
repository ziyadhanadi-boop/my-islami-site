class Tibb {
  final String id;
  final String title;
  final String content;
  final String? imageUrl;
  final String? slug;
  final DateTime? createdAt;
  final String? benefits;
  final String? howToUse;
  final String? evidence;

  Tibb({
    required this.id,
    required this.title,
    required this.content,
    this.imageUrl,
    this.slug,
    this.createdAt,
    this.benefits,
    this.howToUse,
    this.evidence,
  });

  factory Tibb.fromJson(Map<String, dynamic> json) {
    return Tibb(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      imageUrl: json['imageUrl'],
      slug: json['slug'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      benefits: json['benefits'],
      howToUse: json['howToUse'],
      evidence: json['evidence'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'content': content,
      'imageUrl': imageUrl,
      'slug': slug,
      'createdAt': createdAt?.toIso8601String(),
      'benefits': benefits,
      'howToUse': howToUse,
      'evidence': evidence,
    };
  }

  String get excerpt {
    String plainText = content.replaceAll(RegExp(r'<[^>]*>'), '');
    if (plainText.length > 150) {
      return '${plainText.substring(0, 150)}...';
    }
    return plainText;
  }
}
