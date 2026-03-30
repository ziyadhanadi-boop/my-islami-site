import React from 'react';
import { NavLink } from 'react-router-dom';

const MobileBottomNav = () => {
    return (
        <div className="mobile-bottom-nav">
            <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <span className="bottom-nav-icon">🏠</span>
                <span>الرئيسية</span>
            </NavLink>
            <NavLink to="/quran" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <span className="bottom-nav-icon">📖</span>
                <span>المصحف</span>
            </NavLink>
            <NavLink to="/zikr" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <span className="bottom-nav-icon">📿</span>
                <span>الأذكار</span>
            </NavLink>
            <NavLink to="/kids-corner" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <span className="bottom-nav-icon">🎡</span>
                <span>الأطفال</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <span className="bottom-nav-icon">👤</span>
                <span>ملفي</span>
            </NavLink>
        </div>
    );
};

export default MobileBottomNav;
