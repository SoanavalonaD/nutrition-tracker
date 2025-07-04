import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useMealStore } from '../../store/mealStore';
import { useAuthStore } from '../../store/authStore';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Charts: React.FC = () => {
  const { user } = useAuthStore();
  const { getWeeklyIntakes } = useMealStore();

  const weeklyData = getWeeklyIntakes(new Date());

  // Weekly Progress Chart
  const weeklyProgressData = {
    labels: weeklyData.map(day => format(day.date, 'MMM d')),
    datasets: [
      {
        label: 'Calories',
        data: weeklyData.map(day => day.totalCalories),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Protein (x10)',
        data: weeklyData.map(day => day.totalProtein * 10),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Carbs (x10)',
        data: weeklyData.map(day => day.totalCarbs * 10),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Fat (x10)',
        data: weeklyData.map(day => day.totalFat * 10),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const weeklyProgressOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Nutrition Progress',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Daily Macronutrient Breakdown (Today)
  const today = new Date();
  const todayData = weeklyData.find(day => 
    format(day.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  const macroData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [
          todayData?.totalProtein || 0,
          todayData?.totalCarbs || 0,
          todayData?.totalFat || 0,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const macroOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Today\'s Macronutrient Breakdown',
      },
    },
  };

  // Goal vs Actual Comparison
  const goalData = {
    labels: ['Calories', 'Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        label: 'Goal',
        data: [
          user?.dailyCalorieGoal || 2000,
          user?.dailyProteinGoal || 150,
          user?.dailyCarbGoal || 250,
          user?.dailyFatGoal || 67,
        ],
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
      },
      {
        label: 'Actual',
        data: [
          todayData?.totalCalories || 0,
          todayData?.totalProtein || 0,
          todayData?.totalCarbs || 0,
          todayData?.totalFat || 0,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const goalOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Goal vs Actual (Today)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition Analytics</h1>
        <p className="text-gray-600">Track your progress and visualize your nutrition patterns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Line data={weeklyProgressData} options={weeklyProgressOptions} />
        </div>

        {/* Today's Macros */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Doughnut data={macroData} options={macroOptions} />
        </div>

        {/* Goal vs Actual */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
          <Bar data={goalData} options={goalOptions} />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weekly Average</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(weeklyData.reduce((sum, day) => sum + day.totalCalories, 0) / 7)}
              </p>
              <p className="text-sm text-gray-500">calories/day</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Best Day</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(Math.max(...weeklyData.map(day => day.totalCalories)))}
              </p>
              <p className="text-sm text-gray-500">calories</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Meals This Week</p>
              <p className="text-2xl font-bold text-purple-600">
                {weeklyData.reduce((sum, day) => sum + day.meals.length, 0)}
              </p>
              <p className="text-sm text-gray-500">total meals</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Goal Achievement</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(((todayData?.totalCalories || 0) / (user?.dailyCalorieGoal || 2000)) * 100)}%
              </p>
              <p className="text-sm text-gray-500">of daily goal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};