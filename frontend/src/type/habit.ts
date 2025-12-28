import { Category } from "./category";

export interface Habit {
  id: number;
  title: string;
  description?: string;
  categoryName?: string;
  categoryId?: number;
  category?: Category;
  repeatType: 'daily' | 'weekly' | 'monthly' | 'custom';
  repeatConfig?: any;
  startDate: string;
  endDate?: string;
  createdAt: string;
  isCompleted?: boolean;
}

export interface HabitLog {
  id: string;
  logDate: string;
  isSuccess: boolean;
  note?: string;
}

export interface HabitDetail {
  habit: Habit & {
    categoryRelation?: Category;
  };
  logs: HabitLog[];
  stats: {
    totalSuccess: number;
    currentStreak: number;
    maxStreak: number;
  };
}
