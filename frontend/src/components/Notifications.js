import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://your-api.com/api/notifications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error.message);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications at the moment.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification, index) => (
            <li
              key={index}
              className="bg-white p-3 rounded-lg shadow hover:bg-gray-50 transition duration-200"
            >
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
