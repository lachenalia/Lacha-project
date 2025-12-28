"use client";

import { useEffect, useState } from "react";
import { Schedule } from "@/type/schedule";
import { Category } from "@/type/category";
import { apiGet } from "@/lib/api";
import { IconX, IconTrash } from "@tabler/icons-react";

interface Props {
  schedule?: Schedule | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Schedule>) => void;
  onDelete?: (id: number) => void;
}

export default function ScheduleModal({ schedule, isOpen, onClose, onSave, onDelete }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAllDay, setIsAllDay] = useState(false);

  useEffect(() => {
    if (isOpen) {
      apiGet<Category[]>("/categories").then(setCategories).catch(console.error);
      
      if (schedule) {
        setTitle(schedule.title);
        setDescription(schedule.description || "");
        setStartDate(schedule.startAt.split('.')[0]); // Remove ms
        setEndDate(schedule.endAt?.split('.')[0] || "");
        setCategoryId(schedule.categoryId || "");
        setIsAllDay(schedule.isAllDay);
      } else {
        const now = new Date();
        now.setMinutes(0, 0, 0);
        const start = now.toISOString().slice(0, 16);
        now.setHours(now.getHours() + 1);
        const end = now.toISOString().slice(0, 16);
        
        setTitle("");
        setDescription("");
        setStartDate(start);
        setEndDate(end);
        setCategoryId("");
        setIsAllDay(false);
      }
    }
  }, [isOpen, schedule]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      startAt: new Date(startDate).toISOString(),
      endAt: endDate ? new Date(endDate).toISOString() : undefined,
      categoryId: categoryId === "" ? undefined : categoryId,
      isAllDay,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {schedule ? "일정 수정" : "새 일정 추가"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">제목</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정 제목을 입력하세요"
              className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">시작 일시</label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">종료 일시</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
            <input
              type="checkbox"
              id="isAllDay"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isAllDay" className="text-sm font-medium text-slate-600 dark:text-slate-400">하루 종일</label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">카테고리</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
            >
              <option value="">카테고리 선택 없음</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">설명</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="추가 내용을 입력하세요"
              className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            {schedule && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(schedule.id)}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
              >
                <IconTrash size={18} />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-500 transition-all"
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
