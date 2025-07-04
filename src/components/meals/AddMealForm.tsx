import React, { useState, useEffect } from 'react';
import { Plus, Search, X, Save, Utensils } from 'lucide-react';
import { useMealStore } from '../../store/mealStore';
import { useAuthStore } from '../../store/authStore';
import { Food, MealFood } from '../../types';

export const AddMealForm: React.FC = () => {
  const { user } = useAuthStore();
  const { foods, addMeal, initializeFoods } = useMealStore();
  
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFoods, setSelectedFoods] = useState<MealFood[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFoodSearch, setShowFoodSearch] = useState(false);

  useEffect(() => {
    initializeFoods();
  }, [initializeFoods]);

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFoodToMeal = (food: Food) => {
    const existingFood = selectedFoods.find(f => f.food.id === food.id);
    if (existingFood) {
      updateFoodQuantity(food.id, existingFood.quantity + 1);
    } else {
      const mealFood: MealFood = {
        food,
        quantity: 1,
        calories: food.caloriesPerUnit,
        protein: food.proteinPerUnit,
        carbs: food.carbsPerUnit,
        fat: food.fatPerUnit,
      };
      setSelectedFoods([...selectedFoods, mealFood]);
    }
    setSearchTerm('');
    setShowFoodSearch(false);
  };

  const updateFoodQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFoodFromMeal(foodId);
      return;
    }

    setSelectedFoods(selectedFoods.map(mealFood => {
      if (mealFood.food.id === foodId) {
        return {
          ...mealFood,
          quantity,
          calories: mealFood.food.caloriesPerUnit * quantity,
          protein: mealFood.food.proteinPerUnit * quantity,
          carbs: mealFood.food.carbsPerUnit * quantity,
          fat: mealFood.food.fatPerUnit * quantity,
        };
      }
      return mealFood;
    }));
  };

  const removeFoodFromMeal = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter(mealFood => mealFood.food.id !== foodId));
  };

  const calculateTotals = () => {
    return selectedFoods.reduce(
      (totals, mealFood) => ({
        totalCalories: totals.totalCalories + mealFood.calories,
        totalProtein: totals.totalProtein + mealFood.protein,
        totalCarbs: totals.totalCarbs + mealFood.carbs,
        totalFat: totals.totalFat + mealFood.fat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mealName.trim() || selectedFoods.length === 0) {
      alert('Please enter a meal name and add at least one food item.');
      return;
    }

    const totals = calculateTotals();
    
    addMeal({
      userId: user?.id || '',
      name: mealName.trim(),
      type: mealType,
      date: new Date(mealDate),
      foods: selectedFoods,
      ...totals,
    });

    // Reset form
    setMealName('');
    setMealType('breakfast');
    setMealDate(new Date().toISOString().split('T')[0]);
    setSelectedFoods([]);
    setSearchTerm('');
    setShowFoodSearch(false);

    alert('Meal added successfully!');
  };

  const totals = calculateTotals();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Utensils className="w-6 h-6 mr-2 text-green-600" />
            Add New Meal
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="mealName" className="block text-sm font-medium text-gray-700 mb-2">
                Meal Name
              </label>
              <input
                id="mealName"
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Grilled Chicken Salad"
                required
              />
            </div>

            <div>
              <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>
              <select
                id="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label htmlFor="mealDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                id="mealDate"
                type="date"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Foods
            </label>
            <div className="relative">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowFoodSearch(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search for foods..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFoodSearch(!showFoodSearch)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {showFoodSearch && (
                <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                  {filteredFoods.map((food) => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => addFoodToMeal(food)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{food.name}</div>
                      <div className="text-sm text-gray-500">
                        {food.caloriesPerUnit} cal per {food.unit}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedFoods.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Selected Foods</h3>
              
              <div className="space-y-2">
                {selectedFoods.map((mealFood) => (
                  <div
                    key={mealFood.food.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{mealFood.food.name}</div>
                      <div className="text-sm text-gray-500">
                        {Math.round(mealFood.calories)} cal | {Math.round(mealFood.protein)}g protein | {Math.round(mealFood.carbs)}g carbs | {Math.round(mealFood.fat)}g fat
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => updateFoodQuantity(mealFood.food.id, mealFood.quantity - 1)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        -
                      </button>
                      
                      <span className="w-12 text-center font-medium">
                        {mealFood.quantity} {mealFood.food.unit}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => updateFoodQuantity(mealFood.food.id, mealFood.quantity + 1)}
                        className="w-8 h-8 bg-green-100 text-green-600 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        +
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => removeFoodFromMeal(mealFood.food.id)}
                        className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Meal Totals</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Calories</div>
                    <div className="font-semibold">{Math.round(totals.totalCalories)}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Protein</div>
                    <div className="font-semibold">{Math.round(totals.totalProtein)}g</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Carbs</div>
                    <div className="font-semibold">{Math.round(totals.totalCarbs)}g</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Fat</div>
                    <div className="font-semibold">{Math.round(totals.totalFat)}g</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setMealName('');
                setSelectedFoods([]);
                setSearchTerm('');
                setShowFoodSearch(false);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Meal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};