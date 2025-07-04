import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // Simulate API call
        const users = JSON.parse(localStorage.getItem('nutrition-users') || '[]');
        const user = users.find((u: User) => u.email === email);
        
        if (user && password === 'password') { // Simple password check for demo
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      register: async (userData) => {
        const users = JSON.parse(localStorage.getItem('nutrition-users') || '[]');
        const existingUser = users.find((u: User) => u.email === userData.email);
        
        if (existingUser) {
          return false;
        }
        
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        
        users.push(newUser);
        localStorage.setItem('nutrition-users', JSON.stringify(users));
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
          
          // Update in localStorage
          const users = JSON.parse(localStorage.getItem('nutrition-users') || '[]');
          const userIndex = users.findIndex((u: User) => u.id === user.id);
          if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('nutrition-users', JSON.stringify(users));
          }
        }
      },
    }),
    {
      name: 'nutrition-auth',
    }
  )
);