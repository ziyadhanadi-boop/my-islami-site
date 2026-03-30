import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('/api/books');
        setBooks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) return <Loader message="جاري ترتيب أرفف المكتبة... 📚" />;

  return (
    <div className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>📚 المكتبة الإسلامية</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>حمل واقرأ أفضل الكتب الإسلامية الموثوقة بصيغة PDF مجاناً.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
        {books.map(book => (
          <div key={book._id} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <img src={book.coverUrl} alt={book.title} style={{ width: '120px', height: '170px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{book.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>الكاتب: {book.author}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--primary-color)', background: 'rgba(13, 148, 136, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
              <span>{book.category}</span>
              <span>{book.pages} صفحة</span>
            </div>
            <a href={book.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}>
              ⬇️ تحميل الكتاب
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
