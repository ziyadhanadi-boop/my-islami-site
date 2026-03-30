import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveKhatmahWidget = () => {
    const [stats, setStats] = useState(null);
    const [pagesToAdd, setPagesToAdd] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/khatmah/stats');
                setStats(res.data);
            } catch (error) {
                console.error('Error fetching khatmah stats:', error);
            }
        };
        fetchStats();
        // Refresh every 30 seconds for "Live" feel
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAddPages = async (e) => {
        e.preventDefault();
        if (!pagesToAdd || isNaN(pagesToAdd) || pagesToAdd <= 0) return;
        
        setLoading(true);
        try {
            const res = await axios.post('/api/khatmah/add-pages', { pages: pagesToAdd });
            setStats(res.data);
            setPagesToAdd('');
            alert('تم تسجيل قراءتك بنجاح، تقبل الله منا ومنكم!');
        } catch (error) {
            alert('فشل في تحديث الختمة');
        } finally {
            setLoading(false);
        }
    };

    if (!stats) return null;

    const progressPercent = Math.min(((stats.total_pages % 604) / 604) * 100, 100);

    return (
        <div className="card fade-up" style={{ 
            padding: '1.5rem', 
            marginBottom: '2rem', 
            background: 'linear-gradient(135deg, var(--surface-color) 0%, var(--bg-color) 100%)', 
            border: '2px solid var(--primary-color)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Icon */}
            <div style={{ position: 'absolute', top: '-10px', left: '-10px', fontSize: '5rem', opacity: 0.05, transform: 'rotate(-15deg)' }}>📖</div>

            <h4 style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                <span>🌍</span> الختمة الجماعية المباشرة
            </h4>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>{stats.current_completion_count}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>ختمة تم إكمالها عالمياً</div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600' }}>الختمة الجارية</span>
                    <span style={{ color: 'var(--primary-color)' }}>{Math.floor(progressPercent)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary-color)', transition: 'width 0.5s ease' }}></div>
                </div>
            </div>

            <form onSubmit={handleAddPages} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>ساهم في الختمة الحالية (عدد الصفحات):</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                        type="number" 
                        value={pagesToAdd}
                        onChange={(e) => setPagesToAdd(e.target.value)}
                        placeholder="مثلاً: 10"
                        className="form-control" 
                        style={{ flexGrow: 1, padding: '0.6rem', fontSize: '0.9rem' }} 
                    />
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.6rem 1rem' }}>
                        {loading ? '...' : 'إضافة'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LiveKhatmahWidget;
