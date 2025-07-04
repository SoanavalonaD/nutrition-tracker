import React from 'react';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { NutritionOverview } from '../components/dashboard/NutritionOverview';
import { RecentMeals } from '../components/dashboard/RecentMeals';

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <WelcomeSection />
      <NutritionOverview />
      <RecentMeals />
    </div>
  );
};