class Podcast {
  final String id;
  final String title;
  final String description;
  final String? audioUrl;
  final String? imageUrl;
  final String? slug;
  final DateTime? createdAt;
  final int? duration; // in seconds
  final String? author;

  Podcast({
    required this.id,
    required this.title,
    required this.description,
    this.audioUrl,
    this.imageUrl,
    this.slug,
    this.createdAt,
    this.duration,
    this.author,
  });

  factory Podcast.fromJson(Map<String, dynamic> json) {
    return Podcast(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      audioUrl: json['audioUrl'],
      imageUrl: json['imageUrl'],
      slug: json['slug'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
      duration: json['duration'],
      author: json['author'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'description': description,
      'audioUrl': audioUrl,
      'imageUrl': imageUrl,
      'slug': slug,
      'createdAt': createdAt?.toIso8601String(),
      'duration': duration,
      'author': author,
    };
  }

  String get formattedDuration {
    if (duration == null) return '';
    final hours = duration! ~/ 3600;
    final minutes = (duration! % 3600) ~/ 60;
    final seconds = duration! % 60;

    if (hours > 0) {
      return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
    }
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }
}
