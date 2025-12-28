import { Category } from "./category";

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: number | null;
  category?: Category | null;
}

export interface NoteListResponse {
  list: Note[];
  count: number;
}
