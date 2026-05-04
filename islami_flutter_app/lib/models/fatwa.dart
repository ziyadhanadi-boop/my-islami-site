class Fatwa {
  final String id;
  final String question;
  final String answer;
  final String? category;
  final DateTime? createdAt;
  final String? scholar;

  Fatwa({
    required this.id,
    required this.question,
    required this.answer,
    this.category,
    this.createdAt,
    this.scholar,
  });

  factory Fatwa.fromJson(Map<String, dynamic> json) {
    return Fatwa(
      id: json['_id'] ?? json['id'] ?? '',
      question: json['question'] ?? '',
      answer: json['answer'] ?? '',
      category: json['category'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      scholar: json['scholar'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'question': question,
      'answer': answer,
      'category': category,
      'createdAt': createdAt?.toIso8601String(),
      'scholar': scholar,
    };
  }
}
