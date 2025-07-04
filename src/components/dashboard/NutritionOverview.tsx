import React from 'react';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useMealStore } from '../../store/mealStore';

export const NutritionOverview: React.FC = () => {
  const { user } = useAuthStore();
  const { getDailyIntake } = useMealStore();

  const today = new Date();
  const todayIntake = getDailyIntake(today);

  const nutrients = [
    {
      name: 'Calories',
      current: Math.round(todayIntake.totalCalories),
      goal: user?.dailyCalorieGoal || 2000,
      unit: 'kcal',
      color: 'bg-blue-500',
    },
    {
      name: 'Protein',
      current: Math.round(todayIntake.totalProtein),
      goal: user?.dailyProteinGoal || 150,
      unit: 'g',
      color: 'bg-red-500',
    },
    {
      name: 'Carbs',
      current: Math.round(todayIntake.totalCarbs),
      goal: user?.dailyCarbGoal || 250,
      unit: 'g',
      color: 'bg-yellow-500',
    },
    {
      name: 'Fat',
      current: Math.round(todayIntake.totalFat),
      goal: user?.dailyFatGoal || 67,
      unit: 'g',
      color: 'bg-green-500',
    },
  ];

  const getProgressIcon = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return TrendingUp;
    if (percentage >= 75) return TrendingUp;
    if (percentage >= 25) return Minus;
    return TrendingDown;
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-green-600" />
          Today's Nutrition
        </h2>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {nutrients.map((nutrient) => {
          const percentage = Math.min((nutrient.current / nutrient.goal) * 100, 100);
          const ProgressIcon = getProgressIcon(nutrient.current, nutrient.goal);
          const progressColor = getProgressColor(nutrient.current, nutrient.goal);

          return (
            <div
              key={nutrient.name}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{nutrient.name}</h3>
                <ProgressIcon className={`w-4 h-4 ${progressColor}`} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current</span>
                  <span className="font-semibold">
                    {nutrient.current} {nutrient.unit}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Goal</span>
                  <span className="font-semibold">
                    {nutrient.goal} {nutrient.unit}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${nutrient.color} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="text-right text-sm">
                  <span className={`font-semibold ${progressColor}`}>
                    {Math.round(percentage)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Daily Progress</h3>
            <p className="text-sm text-gray-600">
              {todayIntake.meals.length} meals logged today
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(((todayIntake.totalCalories / (user?.dailyCalorieGoal || 2000)) * 100))}%
            </div>
            <div className="text-sm text-gray-600">of daily goal</div>
          </div>
        </div>
      </div>
    </div>
  );
};