import React, { useState } from 'react';
import { Save, Bell, Target, User, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Settings: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dailyCalorieGoal: user?.dailyCalorieGoal || 2000,
    dailyProteinGoal: user?.dailyProteinGoal || 150,
    dailyCarbGoal: user?.dailyCarbGoal || 250,
    dailyFatGoal: user?.dailyFatGoal || 67,
    dietaryPreferences: user?.dietaryPreferences || [],
  });

  const [notificationSettings, setNotificationSettings] = useState({
    breakfast: true,
    lunch: true,
    dinner: true,
    snack: false,
    reminderTimes: {
      breakfast: '08:00',
      lunch: '12:00',
      dinner: '18:00',
      snack: '15:00',
    },
  });

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-free',
    'Keto',
    'Paleo',
    'Low-carb',
    'High-protein',
    'Mediterranean',
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileData);
    alert('Profile updated successfully!');
  };

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Save notification settings to localStorage
    localStorage.setItem('nutrition-notifications', JSON.stringify(notificationSettings));
    alert('Notification settings updated!');
  };

  const handleDietaryPreferenceToggle = (preference: string) => {
    setProfileData(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Preferences</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dietaryOptions.map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.dietaryPreferences.includes(option)}
                        onChange={() => handleDietaryPreferenceToggle(option)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'goals' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Nutrition Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Calories
                    </label>
                    <input
                      id="calories"
                      type="number"
                      value={profileData.dailyCalorieGoal}
                      onChange={(e) => setProfileData({ ...profileData, dailyCalorieGoal: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1000"
                      max="5000"
                    />
                  </div>
                  <div>
                    <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Protein (g)
                    </label>
                    <input
                      id="protein"
                      type="number"
                      value={profileData.dailyProteinGoal}
                      onChange={(e) => setProfileData({ ...profileData, dailyProteinGoal: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="50"
                      max="300"
                    />
                  </div>
                  <div>
                    <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Carbs (g)
                    </label>
                    <input
                      id="carbs"
                      type="number"
                      value={profileData.dailyCarbGoal}
                      onChange={(e) => setProfileData({ ...profileData, dailyCarbGoal: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="50"
                      max="500"
                    />
                  </div>
                  <div>
                    <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Fat (g)
                    </label>
                    <input
                      id="fat"
                      type="number"
                      value={profileData.dailyFatGoal}
                      onChange={(e) => setProfileData({ ...profileData, dailyFatGoal: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="20"
                      max="200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Goals</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationUpdate} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meal Reminders</h3>
                <div className="space-y-4">
                  {Object.entries(notificationSettings.reminderTimes).map(([mealType, time]) => (
                    <div key={mealType} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={notificationSettings[mealType as keyof typeof notificationSettings] as boolean}
                          onChange={(e) => setNotificationSettings({
                            ...notificationSettings,
                            [mealType]: e.target.checked,
                          })}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="font-medium text-gray-900 capitalize">{mealType}</span>
                      </div>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          reminderTimes: {
                            ...notificationSettings.reminderTimes,
                            [mealType]: e.target.value,
                          },
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={!notificationSettings[mealType as keyof typeof notificationSettings]}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Data Export</div>
                      <div className="text-sm text-gray-600">Download all your nutrition data</div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                      Export Data
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Clear All Data</div>
                      <div className="text-sm text-gray-600">Permanently delete all your nutrition data</div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                      Clear Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};