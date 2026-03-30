import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="container" style={{ padding: '8rem 1rem', maxWidth: '450px' }}>
      <div className="card" style={{ padding: '3rem 2rem', borderTop: '4px solid var(--primary-color)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text-primary)', fontSize: '1.75rem' }}>تسجيل الدخول للإدارة</h2>
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--text-secondary)' }}>البريد الإلكتروني</label>
            <input type="email" className="form-control" style={{ padding: '0.75rem' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label" style={{ color: 'var(--text-secondary)' }}>كلمة المرور</label>
            <input type="password" className="form-control" style={{ padding: '0.75rem' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1.125rem' }}>تسجيل الدخول</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
