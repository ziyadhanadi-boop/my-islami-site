class ProphetStory {
  final String id;
  final String title;
  final String content;
  final String prophetName;
  final String? imageUrl;
  final String? slug;
  final DateTime? createdAt;
  final String? summary;

  ProphetStory({
    required this.id,
    required this.title,
    required this.content,
    required this.prophetName,
    this.imageUrl,
    this.slug,
    this.createdAt,
    this.summary,
  });

  factory ProphetStory.fromJson(Map<String, dynamic> json) {
    return ProphetStory(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      prophetName: json['prophetName'] ?? '',
      imageUrl: json['imageUrl'],
      slug: json['slug'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      summary: json['summary'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'content': content,
      'prophetName': prophetName,
      'imageUrl': imageUrl,
      'slug': slug,
      'createdAt': createdAt?.toIso8601String(),
      'summary': summary,
    };
  }

  String get excerpt {
    if (summary != null && summary!.isNotEmpty) {
      return summary!;
    }
    String plainText = content.replaceAll(RegExp(r'<[^>]*>'), '');
    if (plainText.length > 200) {
      return '${plainText.substring(0, 200)}...';
    }
    return plainText;
  }
}
