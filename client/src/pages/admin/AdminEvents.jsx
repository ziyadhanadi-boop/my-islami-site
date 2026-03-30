import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/events');
            setEvents(res.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/events/${id}`, { headers: { 'x-auth-token': token } });
            fetchEvents();
            alert('تم الحذف بنجاح');
        } catch (error) {
            alert('فشل في الحذف');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ color: 'var(--primary-color)' }}>⚙️ إدارة الفعاليات الإسلامية</h2>
                <Link to="/admin/event/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>➕ إحصائية / فعالية جديدة</span>
                </Link>
            </div>

            <div className="card" style={{ padding: '2rem', overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'right', borderBottom: '2px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem' }}>العنوان</th>
                            <th style={{ padding: '1rem' }}>النوع</th>
                            <th style={{ padding: '1rem' }}>التاريخ</th>
                            <th style={{ padding: '1rem' }}>المكان</th>
                            <th style={{ padding: '1rem' }}>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{event.title}</td>
                                <td style={{ padding: '1rem' }}>{event.type}</td>
                                <td style={{ padding: '1rem' }}>{new Date(event.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>{event.locationName}</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <Link to={`/admin/event/edit/${event._id}`} className="btn btn-sm btn-outline-primary">تعديل</Link>
                                    <button onClick={() => handleDelete(event._id)} className="btn btn-sm btn-danger" style={{ color: 'white' }}>حذف</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminEvents;
