import React from 'react';
import { Sun, Moon, Cloud, Star } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const WelcomeSection: React.FC = () => {
  const { user } = useAuthStore();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const getGreeting = () => {
    const timeOfDay = getTimeOfDay();
    const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    const greetings = {
      morning: `Good morning, ${user?.name}! Ready to start your ${day}?`,
      afternoon: `Good afternoon, ${user?.name}! How's your ${day} going?`,
      evening: `Good evening, ${user?.name}! Hope you had a great ${day}!`,
      night: `Good night, ${user?.name}! Time to wind down this ${day}.`,
    };

    return greetings[timeOfDay];
  };

  const getTimeIcon = () => {
    const timeOfDay = getTimeOfDay();
    const icons = {
      morning: Sun,
      afternoon: Cloud,
      evening: Star,
      night: Moon,
    };

    return icons[timeOfDay];
  };

  const TimeIcon = getTimeIcon();

  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <TimeIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{getGreeting()}</h1>
            <p className="text-green-100 mt-1">
              Let's track your nutrition and reach your goals together!
            </p>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="text-right">
            <div className="text-2xl font-bold">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-green-100">
              {new Date().toLocaleDateString('en-US', { year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};