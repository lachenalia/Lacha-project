import { Category } from "./category";

export interface Schedule {
  id: number;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  isAllDay: boolean;
  categoryId?: number;
  category?: Category;
  location?: string;
  createdAt: string;
  updatedAt: string;
}
