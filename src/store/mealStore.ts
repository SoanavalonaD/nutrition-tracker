import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meal, Food, MealFood, DailyIntake } from '../types';
import { format, isSameDay, subDays } from 'date-fns';

interface MealState {
  meals: Meal[];
  foods: Food[];
  addMeal: (meal: Omit<Meal, 'id' | 'createdAt'>) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  getMealsByDate: (date: Date) => Meal[];
  getDailyIntake: (date: Date) => DailyIntake;
  getWeeklyIntakes: (endDate: Date) => DailyIntake[];
  initializeFoods: () => void;
}

const DEFAULT_FOODS: Food[] = [
  // Grains and Cereals
  { id: '1', name: 'Rice (cooked)', caloriesPerUnit: 1.3, proteinPerUnit: 0.03, carbsPerUnit: 0.28, fatPerUnit: 0.003, unit: 'g' },
  { id: '2', name: 'Bread (white)', caloriesPerUnit: 2.65, proteinPerUnit: 0.09, carbsPerUnit: 0.49, fatPerUnit: 0.032, unit: 'g' },
  { id: '3', name: 'Pasta (cooked)', caloriesPerUnit: 1.31, proteinPerUnit: 0.05, carbsPerUnit: 0.25, fatPerUnit: 0.011, unit: 'g' },
  { id: '4', name: 'Oats', caloriesPerUnit: 3.89, proteinPerUnit: 0.17, carbsPerUnit: 0.66, fatPerUnit: 0.069, unit: 'g' },
  
  // Proteins
  { id: '5', name: 'Chicken Breast', caloriesPerUnit: 1.65, proteinPerUnit: 0.31, carbsPerUnit: 0, fatPerUnit: 0.036, unit: 'g' },
  { id: '6', name: 'Salmon', caloriesPerUnit: 2.08, proteinPerUnit: 0.25, carbsPerUnit: 0, fatPerUnit: 0.12, unit: 'g' },
  { id: '7', name: 'Eggs', caloriesPerUnit: 155, proteinPerUnit: 13, carbsPerUnit: 1.1, fatPerUnit: 11, unit: 'piece' },
  { id: '8', name: 'Ground Beef (85% lean)', caloriesPerUnit: 2.12, proteinPerUnit: 0.26, carbsPerUnit: 0, fatPerUnit: 0.11, unit: 'g' },
  
  // Dairy
  { id: '9', name: 'Milk (whole)', caloriesPerUnit: 0.42, proteinPerUnit: 0.034, carbsPerUnit: 0.047, fatPerUnit: 0.034, unit: 'ml' },
  { id: '10', name: 'Greek Yogurt', caloriesPerUnit: 0.59, proteinPerUnit: 0.10, carbsPerUnit: 0.036, fatPerUnit: 0.004, unit: 'g' },
  { id: '11', name: 'Cheese (cheddar)', caloriesPerUnit: 4.02, proteinPerUnit: 0.25, carbsPerUnit: 0.013, fatPerUnit: 0.33, unit: 'g' },
  
  // Fruits
  { id: '12', name: 'Apple', caloriesPerUnit: 0.52, proteinPerUnit: 0.003, carbsPerUnit: 0.14, fatPerUnit: 0.002, unit: 'g' },
  { id: '13', name: 'Banana', caloriesPerUnit: 0.89, proteinPerUnit: 0.011, carbsPerUnit: 0.23, fatPerUnit: 0.003, unit: 'g' },
  { id: '14', name: 'Orange', caloriesPerUnit: 0.47, proteinPerUnit: 0.009, carbsPerUnit: 0.12, fatPerUnit: 0.001, unit: 'g' },
  
  // Vegetables
  { id: '15', name: 'Broccoli', caloriesPerUnit: 0.34, proteinPerUnit: 0.028, carbsPerUnit: 0.07, fatPerUnit: 0.004, unit: 'g' },
  { id: '16', name: 'Spinach', caloriesPerUnit: 0.23, proteinPerUnit: 0.029, carbsPerUnit: 0.036, fatPerUnit: 0.004, unit: 'g' },
  { id: '17', name: 'Carrots', caloriesPerUnit: 0.41, proteinPerUnit: 0.009, carbsPerUnit: 0.096, fatPerUnit: 0.002, unit: 'g' },
  
  // Nuts and Seeds
  { id: '18', name: 'Almonds', caloriesPerUnit: 5.79, proteinPerUnit: 0.21, carbsPerUnit: 0.22, fatPerUnit: 0.50, unit: 'g' },
  { id: '19', name: 'Peanut Butter', caloriesPerUnit: 5.88, proteinPerUnit: 0.25, carbsPerUnit: 0.20, fatPerUnit: 0.50, unit: 'g' },
  
  // Oils and Fats
  { id: '20', name: 'Olive Oil', caloriesPerUnit: 8.84, proteinPerUnit: 0, carbsPerUnit: 0, fatPerUnit: 1.0, unit: 'ml' },
];

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      meals: [],
      foods: [],
      
      addMeal: (mealData) => {
        const meal: Meal = {
          ...mealData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          meals: [...state.meals, meal],
        }));
      },
      
      updateMeal: (id, mealData) => {
        set((state) => ({
          meals: state.meals.map((meal) =>
            meal.id === id ? { ...meal, ...mealData } : meal
          ),
        }));
      },
      
      deleteMeal: (id) => {
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== id),
        }));
      },
      
      getMealsByDate: (date) => {
        const { meals } = get();
        return meals.filter((meal) => isSameDay(new Date(meal.date), date));
      },
      
      getDailyIntake: (date) => {
        const { getMealsByDate } = get();
        const dayMeals = getMealsByDate(date);
        
        const totals = dayMeals.reduce(
          (acc, meal) => ({
            totalCalories: acc.totalCalories + meal.totalCalories,
            totalProtein: acc.totalProtein + meal.totalProtein,
            totalCarbs: acc.totalCarbs + meal.totalCarbs,
            totalFat: acc.totalFat + meal.totalFat,
          }),
          { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
        );
        
        return {
          date,
          meals: dayMeals,
          ...totals,
        };
      },
      
      getWeeklyIntakes: (endDate) => {
        const { getDailyIntake } = get();
        const intakes: DailyIntake[] = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = subDays(endDate, i);
          intakes.push(getDailyIntake(date));
        }
        
        return intakes;
      },
      
      initializeFoods: () => {
        const { foods } = get();
        if (foods.length === 0) {
          set({ foods: DEFAULT_FOODS });
        }
      },
    }),
    {
      name: 'nutrition-meals',
    }
  )
);