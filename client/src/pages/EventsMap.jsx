import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const EventsMap = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchEvents();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span style={{ fontSize: '3rem' }}>📍</span>
                <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '1rem' }}>خريطة الفعاليات الإسلامية</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>اكتشف المحاضرات، الدروس، وموائد الإفطار القريبة منك</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {events.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', background: 'var(--surface-color)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                        لا توجد فعاليات قادمة حالياً. كن أول من يضيف فعالية!
                    </div>
                ) : (
                    events.map(event => (
                        <div key={event._id} className="card fade-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <span style={{ 
                                    padding: '0.4rem 0.8rem', 
                                    backgroundColor: 'rgba(13, 148, 136, 0.1)', 
                                    color: 'var(--primary-color)', 
                                    borderRadius: '2rem', 
                                    fontSize: '0.85rem', 
                                    fontWeight: 'bold' 
                                }}>
                                    {event.type}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    📅 {new Date(event.date).toLocaleDateString('ar-EG')}
                                </span>
                            </div>
                            
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{event.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', flexGrow: 1, marginBottom: '1.5rem' }}>{event.description}</p>
                            
                            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>🕌 <strong>المكان:</strong> {event.locationName}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>👤 <strong>المنظم:</strong> {event.organizer}</div>
                            </div>
                            
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${event.lat},${event.lng}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-outline-primary"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                            >
                                🗺️ فتح في الخريطة
                            </a>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventsMap;
