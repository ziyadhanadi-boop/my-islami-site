import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const QuranAI = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await axios.post('/api/ai/search-quran', { query });
            setResult(res.data);
        } catch (error) {
            alert('حدث خطأ أثناء البحث القرآني');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '3rem 1rem', maxWidth: '900px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span style={{ fontSize: '3rem' }}>📖</span>
                <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '1rem' }}>البحث القرآني الذكي</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>ابحث بمعاني الآيات، المواضيع، أو القصص القرآنية باستخدام الذكاء الاصطناعي</p>
            </div>

            <div className="card" style={{ padding: '2rem', marginBottom: '3rem', borderRadius: '1.5rem', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="مثلاً: آيات تتحدث عن الصبر، أو قصة موسى عليه السلام..."
                        className="form-control"
                        style={{ flexGrow: 1, padding: '1rem', fontSize: '1.1rem', borderRadius: '1rem' }}
                    />
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0 2rem', borderRadius: '1rem', fontSize: '1.1rem' }}>
                        {loading ? 'جاري البحث...' : 'بحث ذكي'}
                    </button>
                </form>
            </div>

            {loading && <Loader message="جاري استخراج الآيات وتفسيرها..." />}

            {result && (
                <div className="fade-up">
                    <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: 'rgba(13, 148, 136, 0.05)', border: '1px solid var(--primary-color)' }}>
                        <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>💡 ملخص البحث</h3>
                        <p style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>{result.explanation}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {result.verses.map((v, i) => (
                            <div key={i} className="card" style={{ padding: '2rem', borderRight: '5px solid var(--secondary-color)' }}>
                                <div style={{ 
                                    fontSize: '1.8rem', 
                                    fontFamily: 'var(--font-quran)', 
                                    textAlign: 'center', 
                                    lineHeight: '2.2', 
                                    marginBottom: '1.5rem',
                                    padding: '1rem',
                                    backgroundColor: 'var(--bg-color)',
                                    borderRadius: '0.5rem'
                                }}>
                                    {v.text}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--primary-dark)' }}>📍 {v.surah} - آية {v.number}</span>
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => navigator.clipboard.writeText(`${v.text} [${v.surah}: ${v.number}]`)}>نسخ الآية</button>
                                </div>
                                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.6' }}>
                                    <strong>التفسير الميسر:</strong> {v.meaning}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuranAI;
