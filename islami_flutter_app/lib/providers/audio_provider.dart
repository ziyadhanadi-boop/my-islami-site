import 'package:flutter/foundation.dart';
import '../core/services/audio_service.dart';

class AudioProvider with ChangeNotifier {
  final AudioPlayerService _audioService;

  AudioProvider(this._audioService);

  bool _isPlaying = false;
  bool _isPaused = false;
  Duration _position = Duration.zero;
  Duration _duration = Duration.zero;
  Map<String, dynamic>? _currentTrack;
  double _volume = 1.0;
  double _speed = 1.0;

  bool get isPlaying => _isPlaying;
  bool get isPaused => _isPaused;
  Duration get position => _position;
  Duration get duration => _duration;
  Map<String, dynamic>? get currentTrack => _currentTrack;
  double get volume => _volume;
  double get speed => _speed;

  void init() {
    _audioService.playerStateStream.listen((state) {
      _isPlaying = state.playing;
      _isPaused = !state.playing && state.processingState.processing;
      notifyListeners();
    });

    _audioService.positionStream.listen((pos) {
      _position = pos;
      notifyListeners();
    });

    _audioService.durationStream.listen((dur) {
      _duration = dur ?? Duration.zero;
      notifyListeners();
    });
  }

  Future<void> playTrack(Map<String, dynamic> track) async {
    _currentTrack = track;
    if (track['url'] != null) {
      await _audioService.setUrl(track['url']);
      await _audioService.play();
    }
    notifyListeners();
  }

  Future<void> play() async {
    await _audioService.play();
    notifyListeners();
  }

  Future<void> pause() async {
    await _audioService.pause();
    notifyListeners();
  }

  Future<void> stop() async {
    await _audioService.stop();
    _currentTrack = null;
    notifyListeners();
  }

  Future<void> seek(Duration position) async {
    await _audioService.seek(position);
    notifyListeners();
  }

  Future<void> setVolume(double volume) async {
    await _audioService.setVolume(volume);
    _volume = volume;
    notifyListeners();
  }

  Future<void> setSpeed(double speed) async {
    await _audioService.setSpeed(speed);
    _speed = speed;
    notifyListeners();
  }

  Future<void> skipForward() async {
    await _audioService.skipForward();
    notifyListeners();
  }

  Future<void> skipBackward() async {
    await _audioService.skipBackward();
    notifyListeners();
  }

  String get formattedPosition => AudioPlayerService.formatDuration(_position);
  String get formattedDuration => AudioPlayerService.formatDuration(_duration);

  double get progress {
    if (_duration.inMilliseconds == 0) return 0.0;
    return _position.inMilliseconds / _duration.inMilliseconds;
  }

  void dispose() {
    _audioService.dispose();
  }
}
