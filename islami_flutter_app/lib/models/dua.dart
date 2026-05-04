class Dua {
  final String id;
  final String title;
  final String content;
  final String? arabicText;
  final String? translation;
  final String? category;
  final String? reference;
  final int? virtue;

  Dua({
    required this.id,
    required this.title,
    required this.content,
    this.arabicText,
    this.translation,
    this.category,
    this.reference,
    this.virtue,
  });

  factory Dua.fromJson(Map<String, dynamic> json) {
    return Dua(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      arabicText: json['arabicText'],
      translation: json['translation'],
      category: json['category'],
      reference: json['reference'],
      virtue: json['virtue'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'content': content,
      'arabicText': arabicText,
      'translation': translation,
      'category': category,
      'reference': reference,
      'virtue': virtue,
    };
  }
}
