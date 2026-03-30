import React, { useState, useRef } from 'react';
import axios from 'axios';

/**
 * FileUploadField — مكوّن رفع الملفات
 * Props:
 *   value       — القيمة الحالية للـ URL
 *   onChange    — (url) => void
 *   accept      — 'image' | 'audio' | 'both' (default: 'image')
 *   label       — نص التسمية
 *   placeholder — placeholder للـ input
 */
const FileUploadField = ({ value, onChange, accept = 'image', label, placeholder }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

  const acceptStr = accept === 'audio'
    ? 'audio/mpeg,audio/ogg,audio/wav,audio/aac,audio/mp4,.mp3,.ogg,.wav,.aac'
    : accept === 'both'
    ? 'image/jpeg,image/png,image/webp,audio/mpeg,audio/ogg,.jpg,.jpeg,.png,.webp,.mp3,.ogg'
    : 'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif';

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');

    // Local preview
    if (file.type.startsWith('image/')) {
      setPreview({ type: 'image', url: URL.createObjectURL(file) });
    } else if (file.type.startsWith('audio/')) {
      setPreview({ type: 'audio', name: file.name });
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/upload', formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
      });
      onChange(res.data.url);
      setPreview(null); // clear local preview, use server URL
    } catch (err) {
      setError('فشل الرفع: ' + (err.response?.data?.msg || err.message));
      setPreview(null);
    }
    setUploading(false);
    e.target.value = ''; // reset input
  };

  const displayUrl = value ? (value.startsWith('http') ? value : `${API_BASE}${value}`) : '';
  const isAudioUrl = value && (value.includes('.mp3') || value.includes('.ogg') || value.includes('.wav') || value.includes('/audio/'));

  return (
    <div>
      {label && <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.4rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{label}</label>}

      {/* URL Input + Upload Button row */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'أدخل رابطاً أو ارفع ملفاً...'}
          style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.65rem', border: '1.5px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ padding: '0.65rem 1rem', borderRadius: '0.65rem', border: '1.5px solid var(--border-color)', background: uploading ? 'var(--bg-color)' : 'var(--surface-color)', color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.85rem', cursor: uploading ? 'wait' : 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}
        >
          {uploading ? '⏳ جاري الرفع...' : (accept === 'audio' ? '🎵 رفع صوت' : '🖼️ رفع صورة')}
        </button>
        <input ref={inputRef} type="file" accept={acceptStr} onChange={handleFileChange} style={{ display: 'none' }} />
      </div>

      {error && <p style={{ fontSize: '0.8rem', color: '#dc2626', marginTop: '0.35rem' }}>⚠️ {error}</p>}

      {/* Preview area */}
      {uploading && (
        <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(13,148,136,0.07)', borderRadius: '0.5rem', fontSize: '0.85rem', color: 'var(--primary-color)' }}>
          ⏳ جاري رفع الملف على السيرفر...
        </div>
      )}
      {!uploading && value && displayUrl && (
        <div style={{ marginTop: '0.5rem' }}>
          {isAudioUrl ? (
            <audio controls src={displayUrl} style={{ width: '100%', borderRadius: '0.5rem', height: '36px' }} />
          ) : (
            <img src={displayUrl} alt="preview" onError={() => {}}
              style={{ maxWidth: '180px', maxHeight: '120px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
