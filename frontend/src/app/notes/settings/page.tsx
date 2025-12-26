"use client";

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  color: string;
}

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

export default function NoteSettingsPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await apiGet<Category[]>("/note-category");
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
    setColor(COLORS[0].value);
    setIsSubmitting(false);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setColor(cat.color);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await apiPut(`/note-category/${editingId}`, { name, color });
      } else {
        await apiPost("/note-category", { name, color });
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
    if (!confirm("카테고리를 삭제하시겠습니까?")) return;
    try {
      await apiDelete(`/note-category/${id}`);
      await fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700">Settings</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              카테고리 관리
            </h1>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            돌아가기
          </button>
        </div>

        {/* Input Form */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-800">
            {editingId ? "카테고리 수정" : "새 카테고리 추가"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                색상
              </label>
              <div className="flex flex-wrap gap-2">
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
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                이름
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="카테고리 이름"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {editingId ? "수정" : "추가"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    취소
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-sm text-slate-500">로딩 중...</p>
          ) : categories.length === 0 ? (
            <p className="text-center text-sm text-slate-500">
              등록된 카테고리가 없습니다.
            </p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-100"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-slate-700">{cat.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
