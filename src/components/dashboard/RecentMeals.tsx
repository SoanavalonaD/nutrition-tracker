import React from 'react';
import { Clock, Edit2, Trash2, Utensils } from 'lucide-react';
import { useMealStore } from '../../store/mealStore';
import { format } from 'date-fns';

export const RecentMeals: React.FC = () => {
  const { meals, deleteMeal } = useMealStore();

  const recentMeals = meals
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getMealTypeColor = (type: string) => {
    const colors = {
      breakfast: 'bg-orange-100 text-orange-800',
      lunch: 'bg-green-100 text-green-800',
      dinner: 'bg-blue-100 text-blue-800',
      snack: 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMealTypeIcon = (type: string) => {
    return <Utensils className="w-4 h-4" />;
  };

  if (recentMeals.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-green-600" />
          Recent Meals
        </h2>
        <div className="text-center py-8">
          <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No meals logged yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Start by adding your first meal!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-green-600" />
        Recent Meals
      </h2>

      <div className="space-y-4">
        {recentMeals.map((meal) => (
          <div
            key={meal.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getMealTypeIcon(meal.type)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(meal.type)}`}>
                    {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(meal.date), 'MMM d, yyyy')}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{meal.name}</h3>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{Math.round(meal.totalCalories)} cal</span>
                  <span>{Math.round(meal.totalProtein)}g protein</span>
                  <span>{Math.round(meal.totalCarbs)}g carbs</span>
                  <span>{Math.round(meal.totalFat)}g fat</span>
                </div>
                
                <div className="mt-2 text-sm text-gray-500">
                  {meal.foods.length} food{meal.foods.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMeal(meal.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};