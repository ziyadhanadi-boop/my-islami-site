import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader';

const AdminKhatmah = () => {
    const [stats, setStats] = useState(null);
    const [goal, setGoal] = useState('');
    const [totalPages, setTotalPages] = useState('');
    const [currentCompletionCount, setCurrentCompletionCount] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/khatmah/stats');
            setStats(res.data);
            setGoal(res.data.target_completion_goal || '');
            setTotalPages(res.data.total_pages);
            setCurrentCompletionCount(res.data.current_completion_count);
        } catch (error) {
            console.error('Error fetching khatmah stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleUpdateGoal = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put('/api/khatmah/admin-goal', { goal }, { headers: { 'x-auth-token': token } });
            alert('تم تحديث الهدف بنجاح');
            fetchStats();
        } catch (error) {
            alert('فشل في التحديث');
        }
    };

    const handleResetKhatmah = async () => {
        if (!window.confirm('هل أنت متأكد من تصفير الختمة الحالية؟ سيتم إعادة عدد الصفحات إلى الصفر.')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put('/api/khatmah/reset', {}, { headers: { 'x-auth-token': token } });
            alert('تم تصفير الختمة بنجاح');
            fetchStats();
        } catch (error) {
            alert('فشل في التصفير');
        }
    };

    const handleManualUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put('/api/khatmah/update-stats', { 
                total_pages: totalPages, 
                current_completion_count: currentCompletionCount 
            }, { headers: { 'x-auth-token': token } });
            alert('تم التعديل بنجاح');
            fetchStats();
        } catch (error) {
            alert('فشل في التعديل');
        }
    };

    if (loading || !stats) return <Loader message="جاري تحميل بيانات الختمة..." />;

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <h2 style={{ marginBottom: '2.5rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }}>📖 إدارة الختمة الجماعية</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ padding: '2.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--primary-color)', pb: '0.5rem', display: 'inline-block' }}>إحصائيات حالية</h3>
                    <div style={{ padding: '1.5rem', background: 'rgba(13, 148, 136, 0.05)', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                           <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>الصفحات المقروءة:</span>
                           <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-color)' }}>{stats.total_pages}</div>
                        </div>
                        <div>
                           <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>مرات الختم المكتملة:</span>
                           <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.current_completion_count} 🕋</div>
                        </div>
                    </div>
                    
                    <button onClick={handleResetKhatmah} className="btn btn-danger" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                        🔄 تصفير الختمة الحالية (تجديد الختمة)
                    </button>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        هذا الخيار يعيد عدد الصفحات إلى 0 للبدء من جديد مع الحفاظ على عدد الختمات السابقة.
                    </p>
                </div>

                <div className="card" style={{ padding: '2.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '2px solid var(--secondary-color)', pb: '0.5rem', display: 'inline-block' }}>تعديل البيانات يدوياً</h3>
                    
                    <form onSubmit={handleManualUpdate} style={{ marginBottom: '2.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">إجمالي الصفحات المقروءة</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={totalPages}
                                onChange={(e) => setTotalPages(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">مرات الختم (تراكمي)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                value={currentCompletionCount}
                                onChange={(e) => setCurrentCompletionCount(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary" style={{ width: '100%', padding: '0.75rem' }}>💾 حفظ التعديل اليدوي</button>
                    </form>

                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>الهدف العام</h3>
                    <form onSubmit={handleUpdateGoal}>
                        <div className="form-group">
                            <input 
                                type="number" 
                                className="form-control" 
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                placeholder="مثلاً: 100 ختمة مجمعة"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>🎯 تحديث الهدف</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminKhatmah;
