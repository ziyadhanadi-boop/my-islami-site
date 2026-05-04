import 'package:just_audio/just_audio.dart';

class AudioPlayerService {
  static final AudioPlayerService _instance = AudioPlayerService._internal();
  factory AudioPlayerService() => _instance;
  AudioPlayerService._internal();

  final AudioPlayer _audioPlayer = AudioPlayer();

  AudioPlayer get player => _audioPlayer;

  // Get current position stream
  Stream<Duration> get positionStream => _audioPlayer.positionStream;

  // Get duration stream
  Stream<Duration> get durationStream => _audioPlayer.durationStream;

  // Get player state stream
  Stream<PlayerState> get playerStateStream => _audioPlayer.playerStateStream;

  // Get current position
  Duration get currentPosition => _audioPlayer.position;

  // Get duration
  Duration? get duration => _audioPlayer.duration;

  // Check if playing
  bool get isPlaying => _audioPlayer.playing;

  // Check if processing state
  ProcessingState get processingState => _audioPlayer.processingState;

  // Set audio source
  Future<void> setAudioSource(AudioSource source) async {
    await _audioPlayer.setAudioSource(source);
  }

  // Set URL
  Future<void> setUrl(String url) async {
    await _audioPlayer.setUrl(url);
  }

  // Play
  Future<void> play() async {
    await _audioPlayer.play();
  }

  // Pause
  Future<void> pause() async {
    await _audioPlayer.pause();
  }

  // Stop
  Future<void> stop() async {
    await _audioPlayer.stop();
  }

  // Seek to position
  Future<void> seek(Duration position) async {
    await _audioPlayer.seek(position);
  }

  // Set speed
  Future<void> setSpeed(double speed) async {
    await _audioPlayer.setSpeed(speed);
  }

  // Set volume
  Future<void> setVolume(double volume) async {
    await _audioPlayer.setVolume(volume);
  }

  // Get current speed
  double get speed => _audioPlayer.speed;

  // Get current volume
  double get volume => _audioPlayer.volume;

  // Skip forward
  Future<void> skipForward() async {
    final position = _audioPlayer.position;
    final duration = _audioPlayer.duration;
    if (duration != null) {
      final newPosition = position + const Duration(seconds: 10);
      if (newPosition < duration) {
        await _audioPlayer.seek(newPosition);
      }
    }
  }

  // Skip backward
  Future<void> skipBackward() async {
    final position = _audioPlayer.position;
    final newPosition = position - const Duration(seconds: 10);
    if (newPosition.isNegative) {
      await _audioPlayer.seek(Duration.zero);
    } else {
      await _audioPlayer.seek(newPosition);
    }
  }

  // Dispose
  Future<void> dispose() async {
    await _audioPlayer.dispose();
  }

  // Format duration to string
  static String formatDuration(Duration duration) {
    final hours = duration.inHours;
    final minutes = duration.inMinutes.remainder(60);
    final seconds = duration.inSeconds.remainder(60);

    if (hours > 0) {
      return '${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
    }
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }
}
