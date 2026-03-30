import React from 'react';

const Loader = ({ fullPage = true, message = 'جاري التحميل...' }) => {
  const loaderStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: fullPage ? '70vh' : '200px',
    width: '100%',
    padding: '2rem',
    gap: '1.5rem'
  };

  const spinnerStyle = {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid var(--primary-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const textStyle = {
    fontSize: '1.25rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    fontFamily: 'inherit'
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={loaderStyle}>
      <style>{keyframes}</style>
      <div style={spinnerStyle}></div>
      {message && <div style={textStyle}>{message}</div>}
    </div>
  );
};

export default Loader;
