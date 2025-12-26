"use client";

import { apiGet, apiPut, apiDelete } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: number | null;
}

interface Category {
  id: number;
  name: string;
}

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [noteData, categoriesData] = await Promise.all([
          apiGet<Note>(`/note/${id}`),
          apiGet<Category[]>("/note-category")
        ]);
        setNote(noteData);
        setTitle(noteData.title);
        setContent(noteData.content);
        setCategoryId(noteData.categoryId ?? "");
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
        alert("데이터를 불러오는데 실패했습니다.");
        router.push("/notes");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    try {
      await apiPut(`/note/${id}`, { 
        title, 
        content,
        categoryId: categoryId === "" ? null : Number(categoryId)
      });
      alert("저장되었습니다.");
      router.refresh();
    } catch (error) {
      console.error("Failed to update note", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      await apiDelete(`/note/${id}`);
      router.push("/notes");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete note", error);
      alert("삭제에 실패했습니다.");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-full bg-gradient-to-b from-white to-emerald-50">
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <p className="text-center text-slate-500">로딩 중...</p>
        </div>
      </main>
    );
  }

  if (!note) return null;

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700">Edit Note</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              메모 상세
            </h1>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            {isDeleting ? "삭제 중..." : "삭제하기"}
          </button>
        </div>

        <form
          onSubmit={handleUpdate}
          className="overflow-hidden rounded-3xl border border-emerald-100 bg-white/80 shadow-sm backdrop-blur"
        >
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                카테고리
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">카테고리 선택 (없음)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                제목
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="mb-8">
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                내용
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <div className="text-xs text-slate-400">
                <p>생성일: {new Date(note.createdAt).toLocaleString()}</p>
                <p>수정일: {new Date(note.updatedAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  뒤로
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSaving ? "저장 중..." : "저장하기"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
