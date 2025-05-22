// context/NotificationContext.js
import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(0);

  const addNotification = () => {
    setNotifications((prev) => prev + 1);
  };

  const clearNotifications = () => {
    setNotifications(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Exporter le hook useNotification
export const useNotification = () => React.useContext(NotificationContext);