import React, { useState, useEffect } from 'react';

const DeenPlannerWidget = () => {
    const defaultTasks = [
        { id: 1, text: 'صلاة الفجر في وقتها', done: false },
        { id: 2, text: 'أذكار الصباح', done: false },
        { id: 3, text: 'ورد اليوم من القرآن', done: false },
        { id: 4, text: 'صلاة الضحى', done: false },
        { id: 5, text: 'أذكار المساء', done: false },
        { id: 6, text: 'الصلوات الخمس في جماعة', done: false },
        { id: 7, text: 'صلاة الوتر', done: false }
    ];

    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('daily_deen_tasks');
        const lastReset = localStorage.getItem('deen_tasks_date');
        const today = new Date().toDateString();

        if (saved && lastReset === today) {
            return JSON.parse(saved);
        }
        return defaultTasks;
    });

    useEffect(() => {
        localStorage.setItem('daily_deen_tasks', JSON.stringify(tasks));
        localStorage.setItem('deen_tasks_date', new Date().toDateString());
    }, [tasks]);

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
        if (window.navigator.vibrate) window.navigator.vibrate(20);
    };

    const completedCount = tasks.filter(t => t.done).length;
    const progressPercent = (completedCount / tasks.length) * 100;

    return (
        <div className="card fade-up" style={{ 
            padding: '1.5rem', 
            marginBottom: '2rem', 
            background: 'var(--surface-color)', 
            borderRight: '5px solid var(--primary-color)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)' }}>
                <span>📅</span> خطتي الإيمانية لليوم
            </h4>

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
                    <span>الإنجاز اليومي</span>
                    <span>{completedCount} من {tasks.length}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--secondary-color)', transition: 'width 0.4s ease' }}></div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            padding: '0.6rem', 
                            borderRadius: '0.75rem', 
                            cursor: 'pointer',
                            backgroundColor: task.done ? 'rgba(13, 148, 136, 0.05)' : 'transparent',
                            transition: '0.2s'
                        }}
                    >
                        <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            borderRadius: '4px', 
                            border: `2px solid ${task.done ? 'var(--primary-color)' : 'var(--border-color)'}`,
                            backgroundColor: task.done ? 'var(--primary-color)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.7rem'
                        }}>
                            {task.done && '✓'}
                        </div>
                        <span style={{ 
                            fontSize: '0.9rem', 
                            color: task.done ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: task.done ? 'line-through' : 'none'
                        }}>
                            {task.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeenPlannerWidget;
