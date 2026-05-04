import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class DailyQuoteWidget extends StatelessWidget {
  final String quote;
  final String source;

  const DailyQuoteWidget({
    super.key,
    required this.quote,
    required this.source,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.lightSurfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.accentColor.withOpacity(0.3)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('💫', style: TextStyle(fontSize: 20)),
              const SizedBox(width: 8),
              Text(
                'اقتباس اليوم',
                style: AppTheme.heading3.copyWith(
                  color: AppTheme.accentColor,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            quote,
            style: const TextStyle(
              fontSize: 16,
              fontStyle: FontStyle.italic,
              height: 1.8,
              fontFamily: 'Cairo',
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '— $source',
            style: TextStyle(
              fontSize: 12,
              color: AppTheme.lightTextMuted,
              fontFamily: 'Cairo',
            ),
            textAlign: TextAlign.left,
          ),
        ],
      ),
    );
  }
}
