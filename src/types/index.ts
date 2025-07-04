export interface User {
  id: string;
  name: string;
  email: string;
  dietaryPreferences: string[];
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbGoal: number;
  dailyFatGoal: number;
  createdAt: Date;
}

export interface Food {
  id: string;
  name: string;
  caloriesPerUnit: number;
  proteinPerUnit: number;
  carbsPerUnit: number;
  fatPerUnit: number;
  unit: string; // e.g., "g", "ml", "piece"
}

export interface MealFood {
  food: Food;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: MealFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  date: Date;
  createdAt: Date;
}

export interface DailyIntake {
  date: Date;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NotificationSettings {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  snack: boolean;
  reminderTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
}