import React, { useState } from 'react';
import { Calendar, Filter, Search, Edit2, Trash2, Utensils } from 'lucide-react';
import { useMealStore } from '../../store/mealStore';
import { format, subDays, isSameDay } from 'date-fns';

export const MealHistory: React.FC = () => {
  const { meals, deleteMeal } = useMealStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMeals = meals.filter(meal => {
    const matchesDate = selectedDate === 'all' || isSameDay(new Date(meal.date), new Date(selectedDate));
    const matchesType = selectedMealType === 'all' || meal.type === selectedMealType;
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.foods.some(food => food.food.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesDate && matchesType && matchesSearch;
  });

  const sortedMeals = filteredMeals.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getMealTypeColor = (type: string) => {
    const colors = {
      breakfast: 'bg-orange-100 text-orange-800',
      lunch: 'bg-green-100 text-green-800',
      dinner: 'bg-blue-100 text-blue-800',
      snack: 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const groupedMeals = sortedMeals.reduce((groups, meal) => {
    const dateKey = format(new Date(meal.date), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(meal);
    return groups;
  }, {} as Record<string, typeof sortedMeals>);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal History</h1>
        <p className="text-gray-600">View and manage your meal history</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="type-filter"
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search meals or foods..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {Object.keys(groupedMeals).length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No meals found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedMealType !== 'all' || selectedDate !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'Start by adding your first meal!'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMeals).map(([dateKey, dayMeals]) => (
            <div key={dateKey} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="text-sm text-gray-600">
                  {dayMeals.length} meal{dayMeals.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-4">
                {dayMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Utensils className="w-4 h-4" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(meal.type)}`}>
                            {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(meal.createdAt), 'h:mm a')}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">{meal.name}</h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="font-medium">{Math.round(meal.totalCalories)} cal</span>
                          <span>{Math.round(meal.totalProtein)}g protein</span>
                          <span>{Math.round(meal.totalCarbs)}g carbs</span>
                          <span>{Math.round(meal.totalFat)}g fat</span>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Foods:</span>
                          {meal.foods.map((food, index) => (
                            <span key={food.food.id}>
                              {index > 0 ? ', ' : ' '}
                              {food.food.name} ({food.quantity}{food.food.unit})
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this meal?')) {
                              deleteMeal(meal.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Day Summary */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Day Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Total Calories</div>
                    <div className="font-semibold">
                      {Math.round(dayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0))}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Protein</div>
                    <div className="font-semibold">
                      {Math.round(dayMeals.reduce((sum, meal) => sum + meal.totalProtein, 0))}g
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Carbs</div>
                    <div className="font-semibold">
                      {Math.round(dayMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0))}g
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Total Fat</div>
                    <div className="font-semibold">
                      {Math.round(dayMeals.reduce((sum, meal) => sum + meal.totalFat, 0))}g
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};