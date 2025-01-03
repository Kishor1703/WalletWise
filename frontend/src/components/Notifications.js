import React, { useEffect, useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      // Mock fetching notifications
      setNotifications([
        { id: 1, message: 'New expense added for Food' },
        { id: 2, message: 'Budget exceeded!' },
      ]);
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((note) => (
        <div key={note.id}>{note.message}</div>
      ))}
    </div>
  );
};

export default Notifications;
