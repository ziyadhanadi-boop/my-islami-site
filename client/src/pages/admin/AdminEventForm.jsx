import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';

const AdminEventForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        locationName: '',
        lat: 31.9, // Default Amman
        lng: 35.9,
        date: '',
        type: 'محاضرة',
        organizer: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const fetchEvent = async () => {
                try {
                    const res = await axios.get('/api/events');
                    const event = res.data.find(e => e._id === id);
                    if (event) {
                        setFormData({
                            ...event,
                            date: new Date(event.date).toISOString().split('T')[0]
                        });
                    }
                } catch (error) {
                    console.error('Error fetching event:', error);
                }
            };
            fetchEvent();
        }
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (isEdit) {
                await axios.put(`/api/events/${id}`, formData, { headers: { 'x-auth-token': token } });
            } else {
                await axios.post('/api/events', formData, { headers: { 'x-auth-token': token } });
            }
            alert('تم الحفظ بنجاح');
            navigate('/admin/dashboard?tab=events');
        } catch (error) {
            alert('خطأ في الحفظ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h2 style={{ marginBottom: '2.5rem', color: 'var(--primary-color)' }}>{isEdit ? '📝 تعديل فعالية' : '➕ إضافة فعالية جديدة'}</h2>
            
            <form className="card" style={{ padding: '2rem', maxWidth: '800px' }} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">العنوان:</label>
                    <input type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">الوصف:</label>
                    <textarea className="form-control" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="mb-3">
                        <label className="form-label">التاريخ:</label>
                        <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">النوع:</label>
                        <select className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                            <option value="محاضرة">محاضرة</option>
                            <option value="مائدة إفطار">مائدة إفطار</option>
                            <option value="دروس علمية">دروس علمية</option>
                            <option value="فعالية اجتماعية">فعالية اجتماعية</option>
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">اسم المكان (مثلاً: مسجد الروضة):</label>
                    <input type="text" className="form-control" value={formData.locationName} onChange={e => setFormData({...formData, locationName: e.target.value})} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="mb-3">
                        <label className="form-label">خط العرض (Latitude):</label>
                        <input type="number" step="0.000001" className="form-control" value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">خط الطول (Longitude):</label>
                        <input type="number" step="0.000001" className="form-control" value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})} required />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="form-label">المنظم:</label>
                    <input type="text" className="form-control" value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '1rem', width: '100%', fontSize: '1.1rem' }}>{loading ? 'جاري الحفظ...' : 'حفظ الفعالية'}</button>
            </form>
        </div>
    );
};

export default AdminEventForm;
