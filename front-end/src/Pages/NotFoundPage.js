import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 

const NotFoundPage = () => {
  const navigate = useNavigate();
  const token = Cookies.get('jwt'); 

  React.useEffect(() => {
    if (token) {
      navigate('/Browse');
    } else {
      navigate('/');
    }
  }, [navigate, token]); 

  return (
    <div>
      <h1>Redirecting...</h1>
      <p>Please wait while we redirect you to the appropriate page.</p>
    </div>
  );
};

export default NotFoundPage;


