import React, { useEffect } from 'react';

const Notification = ({ message }) => {
  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => {
      const notification = document.getElementById('notification');
      if (notification) {
        notification.classList.remove('show');
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [message]);
  
  if (!message) return null;
  
  // Create portal manually since we're not using ReactDOM
  const notificationElement = document.getElementById('notification');
  if (!notificationElement) return null;
  
  return React.createElement(
    'div',
    { className: 'notification show' },
    message
  );
};

export default Notification;