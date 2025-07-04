import { useEffect } from 'react';

export const useNotifications = () => {
  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    // Request permission for notifications
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Set up meal reminders
    const checkMealReminders = () => {
      const settings = JSON.parse(localStorage.getItem('nutrition-notifications') || '{}');
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      Object.entries(settings.reminderTimes || {}).forEach(([mealType, time]) => {
        if (settings[mealType] && time === currentTime) {
          if (Notification.permission === 'granted') {
            new Notification(`NutriTrack Reminder`, {
              body: `Don't forget to log your ${mealType}!`,
              icon: '/vite.svg',
              tag: `${mealType}-reminder`,
            });
          }
        }
      });
    };

    // Check reminders every minute
    const interval = setInterval(checkMealReminders, 60000);

    return () => clearInterval(interval);
  }, []);
};