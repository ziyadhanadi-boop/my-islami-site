import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminArticleForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

     if (isEditMode) {
       const fetchArticle = async () => {
         setLoading(true);
         try {
           const res = await axios.get(`/api/articles/${id}?admin=true&t=${Date.now()}`, {
             headers: { 'x-auth-token': token }
           });
           setTitle(res.data.title);
           setCategory(res.data.category);
           setContent(res.data.content);
           if (res.data.tags) setTags(res.data.tags.join(', '));
           setIsFeatured(res.data.isFeatured || false);
           setExistingImageUrl(res.data.imageUrl || '');
         } catch (error) {
           console.error('Error fetching article', error);
         } finally {
           setLoading(false);
         }
       };
       fetchArticle();
     }
   }, [id, isEditMode, navigate]);

   useEffect(() => {
    const timer = setTimeout(() => {
      if (title.trim().length > 3) {
        const checkDup = async () => {
          try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`/api/articles/check-duplicate?title=${encodeURIComponent(title)}&excludeId=${id || ''}`, {
              headers: { 'x-auth-token': token }
            });
            setIsDuplicate(res.data.exists);
          } catch (err) { console.error(err); }
        };
        checkDup();
      } else {
        setIsDuplicate(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [title, id]);

  const handleSuggestTopic = async () => {
    setIsSuggesting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('/api/ai/suggest-topic', {}, {
        headers: { 'x-auth-token': token }
      });
      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.response?.data?.msg || err.message;
      alert(`فشل في جلب الاقتراحات: ${msg}`);
    } finally {
      setIsSuggesting(false);
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !category || !content) {
      alert('يرجى ملء كافة الحقول المطلوبة (العنوان، القسم، المحتوى)');
      return;
    }

    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('content', content);
    formData.append('isFeatured', isFeatured);
    
    // Process tags
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    formData.append('tags', JSON.stringify(tagsArray));

    if (image) {
      formData.append('image', image);
    }
    
    if (shouldDeleteImage) {
      formData.append('shouldDeleteImage', 'true');
    }

    try {
      if (isEditMode) {
        await axios.put(`/api/articles/${id}`, formData, {
          headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/api/articles', formData, {
          headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error saving article', error);
      const data = error.response?.data;
      const message = data?.msg || error.message;
      const technicalError = data?.error ? ` (${data.error})` : '';
      alert(`حدث خطأ أثناء الحفظ: ${message}${technicalError}`);
    }
  };

  const handleGenerateAI = async () => {
    if (!keyword) {
      alert('يرجى إدخال كلمة مفتاحية للبحث');
      return;
    }

    const token = localStorage.getItem('adminToken');
    setIsGenerating(true);
    try {
      const res = await axios.post('/api/ai/generate-article', { keyword }, {
        headers: { 'x-auth-token': token }
      });
      setTitle(res.data.title || '');
      setContent(res.data.content || '');
      if (res.data.category) setCategory(res.data.category);
      if (res.data.tags) setTags(Array.isArray(res.data.tags) ? res.data.tags.join(', ') : res.data.tags);
      alert('تم توليد المقال بنجاح!');
    } catch (error) {
      console.error('Error generating AI article', error);
      const errorMsg = error.response?.data?.msg || error.response?.data?.error || error.message;
      alert(`فشل في توليد المقال: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <Loader message="جاري تحميل بيانات المقال..." />;

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '850px' }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)', fontSize: '2rem' }}>
        {isEditMode ? 'تعديل مقال' : 'إضافة مقال جديد'}
      </h2>
      <div className="card" style={{ padding: '2.5rem', borderRadius: '0.75rem' }}>
        <div className="ai-section" style={{ 
          marginBottom: '2rem', 
          padding: '1.5rem', 
          backgroundColor: 'var(--bg-color)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '0.5rem' 
        }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>كتابة مقال بالذكاء الاصطناعي</h4>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="اكتب كلمة مفتاحية هنا... (مثال: فضل الصيام)" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ flex: 1 }}
            />
            <button 
              type="button" 
              className="btn" 
              onClick={handleGenerateAI}
              disabled={isGenerating}
              style={{ backgroundColor: 'var(--primary-color)', color: 'white', minWidth: '130px' }}
            >
              {isGenerating ? 'جاري التوليد...' : 'توليد المقال ✨'}
            </button>
            <button 
              type="button" 
              className="btn" 
              onClick={handleSuggestTopic}
              disabled={isSuggesting}
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: '1px solid #3b82f6' }}
            >
              {isSuggesting ? 'جاري الاقتراح...' : '💡 اقترح موضوعات'}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
              {suggestions.map((s, i) => (
                <span key={i} onClick={() => setKeyword(s)} style={{ cursor: 'pointer', padding: '0.4rem 0.8rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: '2rem', fontSize: '0.8rem', transition: 'all 0.2s' }} className="suggestion-pill">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {isDuplicate && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.25rem' }}>⚠️</span> <strong>ملاحظة:</strong> هناك مقال بنفس هذا العنوان منشور مسبقاً!
            </div>
          )}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>عنوان المقال</label>
            <input type="text" className="form-control" style={{ padding: '0.75rem', fontSize: '1rem' }} value={title} onChange={e => setTitle(e.target.value)} required placeholder="أدخل عنوان المقال" />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>القسم</label>
            <select className="form-control" style={{ padding: '0.75rem', fontSize: '1rem' }} value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="" disabled>اختر القسم المناسب</option>
              <optgroup label="الشريعة والفقه">
                <option value="فقه الصلاة">الصلاة في الإسلام</option>
                <option value="فقه الزكاة">أحكام الزكاة والصدقات</option>
                <option value="فقه الصيام">الصيام والحج</option>
                <option value="المعاملات المالية">المعاملات المالية</option>
              </optgroup>
              <optgroup label="القرآن والحديث">
                <option value="علوم القرآن">علوم وتفسير القرآن</option>
                <option value="الحديث النبوي">الحديث والشروح</option>
                <option value="الهدي النبوي">الهدي النبوي والسنن</option>
              </optgroup>
              <optgroup label="العقيدة والروح">
                <option value="العقيدة والتوحيد">أركان الإيمان والتوحيد</option>
                <option value="نماء وتزكية">نماء وتزكية وإصلاح القلوب</option>
                <option value="فضل الدعاء">فضل الذكر والدعاء</option>
              </optgroup>
              <optgroup label="عامة">
                <option value="السيرة والتاريخ">السيرة النبوية والتاريخ</option>
                <option value="الأسرة والمجتمع">الأسرة والتربية</option>
                <option value="فتاوى">فتاوى شرعية</option>
              </optgroup>
            </select>
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>الوسوم (Tags)</label>
            <input type="text" className="form-control" style={{ padding: '0.75rem', fontSize: '1rem' }} value={tags} onChange={e => setTags(e.target.value)} placeholder="مثال: صيام، رمضان، زكاة (افصل بينها بفاصلة)" />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="featured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} style={{ width: '1.25rem', height: '1.25rem' }} />
            <label htmlFor="featured" className="form-label" style={{ margin: 0, fontSize: '1.125rem', cursor: 'pointer' }}>تثبيت كمقال مميز في الرئيسية</label>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>صورة الغلاف (اختياري)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="file" 
                className="form-control" 
                style={{ flex: 1, padding: '0.75rem', borderStyle: 'dotted', borderColor: 'var(--primary-color)', backgroundColor: 'rgba(13, 148, 136, 0.05)' }} 
                onChange={e => {
                   setImage(e.target.files[0]);
                   setShouldDeleteImage(false);
                }} 
                accept="image/*" 
              />
              {(image || (existingImageUrl && !shouldDeleteImage)) && (
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => {
                    setImage(null);
                    if (existingImageUrl) setShouldDeleteImage(true);
                  }}
                  style={{ backgroundColor: '#ef4444', color: 'white', padding: '0 1.5rem', borderRadius: '0.5rem' }}
                >
                  حذف الصورة 🗑️
                </button>
              )}
            </div>
            
            {(image || (existingImageUrl && !shouldDeleteImage)) && (
              <div style={{ marginTop: '1rem', textAlign: 'center', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {image ? 'معاينة الصورة المختارة حديثاً:' : 'الصورة الحالية للمقال:'}
                </p>
                <img 
                  src={image ? URL.createObjectURL(image) : existingImageUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '0.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
              </div>
            )}
          </div>
          <div className="form-group" style={{ marginBottom: '4.5rem' }}>
            <label className="form-label" style={{ fontSize: '1.125rem' }}>محتوى المقال</label>
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }],
                  [{ 'color': [] }, { 'background': [] }],
                  ['link'],
                  ['clean']
                ]
              }}
              style={{ height: '350px', backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', direction: 'rtl', marginBottom: '1rem' }} 
              placeholder="اكتب محتوى المقال مع التنسيقات (آيات، أحاديث، تلوين)..."
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}>
              {isEditMode ? '💾 حفظ التعديلات' : '🚀 نشر المقال'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin/dashboard')} 
              className="btn" 
              style={{ 
                backgroundColor: 'var(--bg-color)', 
                color: 'var(--text-secondary)', 
                padding: '0.75rem 2rem', 
                fontSize: '1.125rem', 
                border: '1px solid var(--border-color)',
                fontWeight: 'bold'
              }}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .ql-editor { font-size: 1.1rem; line-height: 1.8; }
        .ql-toolbar { background: #f8fafc; border-radius: 0.5rem 0.5rem 0 0; }
        .ql-container { border-radius: 0 0 0.5rem 0.5rem; }
        .suggestion-pill:hover { background: var(--primary-color) !important; color: white !important; }
      `}</style>
    </div>
  );
};

export default AdminArticleForm;
