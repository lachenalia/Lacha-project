"use client";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { useEffect, useState } from "react";
import { Category } from "@/type/category";

const COLORS = [
  { name: "Slate", value: "#64748b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
];

const ICONS = ["✨", "🏋️‍♂️", "🏃", "🧘", "📚", "🥗", "💧", "🛌"];

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[4].value); // Default emerald
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await apiGet<Category[]>("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setIcon(ICONS[0]);
    setColor(COLORS[4].value);
    setIsSubmitting(false);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setIcon(cat.icon || ICONS[0]);
    setColor(cat.color || COLORS[4].value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = { name: name.trim(), icon, color };
      if (editingId) {
        await apiPut(`/categories/${editingId}`, payload);
      } else {
        await apiPost("/categories", payload);
      }
      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Failed to save category", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("카테고리를 삭제하시겠습니까? 해당 카테고리를 사용하는 항목의 분류가 해제됩니다.")) return;
    try {
      await apiDelete(`/categories/${id}`);
      await fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm p-6 shadow-md dark:border-emerald-950/40 dark:bg-slate-900/80">
        <h2 className="mb-4 text-base font-bold text-slate-800 dark:text-slate-200">
          {editingId ? "카테고리 수정" : "새 카테고리 추가"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-tight">
              아이콘 선택
            </label>
            <div className="grid grid-cols-8 gap-2">
              {ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                    icon === i
                      ? "bg-emerald-600 text-white shadow-lg scale-110 ring-2 ring-emerald-200 dark:ring-emerald-900"
                      : "bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-600 hover:scale-105"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-tight">
              색상 선택
            </label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    color === c.value
                      ? "border-slate-800 scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-tight">
                카테고리 이름
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 건강, 자기계발..."
                  className="flex-1 rounded-xl border border-slate-100 bg-white dark:bg-slate-800 dark:border-slate-700 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all active:scale-95"
                >
                  {editingId ? "수정" : "추가"}
                </button>
              </div>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                취소하기
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="grid gap-3">
        {loading ? (
          <div className="py-10 text-center animate-pulse">
             <p className="text-sm text-slate-400">카테고리를 불러오는 중...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 py-10 text-center">
            <p className="text-sm text-slate-400">
              등록된 카테고리가 없습니다.<br/>새로운 카테고리를 만들어 보세요!
            </p>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white/50 p-4 shadow-sm transition-all hover:border-emerald-200 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-all"
                  style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                >
                  {cat.icon || "✨"}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">{cat.name}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(cat)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30 transition-all"
                  title="수정"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 transition-all"
                  title="삭제"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.518.149.022a.75.75 0 0 0 .23-1.482 41.03 41.03 0 0 0-2.365-.298V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4V2.5A1.25 1.25 0 0 0 11.25 3.75v.443c-.795.077-1.584.176-2.365.298V3.75A1.25 1.25 0 0 0 10 2.5Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
