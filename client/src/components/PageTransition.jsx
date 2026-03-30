import React from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  
  return (
    <div key={location.pathname} className="page-transition" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  );
};

export default PageTransition;
