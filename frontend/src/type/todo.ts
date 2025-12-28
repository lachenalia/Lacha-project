import { Category } from "./category";

export interface Todo {
  id: number;
  title: string;
  description?: string;
  category?: Category;
  categoryId?: number;
  importance: number;
  isDone: boolean;
  dueDate?: string;
  completedAt?: string;
}
