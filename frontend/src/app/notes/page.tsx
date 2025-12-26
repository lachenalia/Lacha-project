"use client";

import { apiGet } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Category {
  id: number;
  name: string;
  color: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    categoryIds: [] as number[],
    startDate: "",
    endDate: "",
  });

  const fetchNotes = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.search) params.append("search", currentFilters.search);
      if (currentFilters.categoryIds.length > 0) {
        params.append("categoryIds", currentFilters.categoryIds.join(","));
      }
      if (currentFilters.startDate) params.append("startDate", currentFilters.startDate);
      if (currentFilters.endDate) params.append("endDate", currentFilters.endDate);

      const queryString = params.toString();
      const url = `/note${queryString ? `?${queryString}` : ""}`;
      
      const data = await apiGet<{ list: Note[], count: number }>(url);
      setNotes(data.list);
    } catch (error) {
      console.error("Failed to fetch notes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    apiGet<Category[]>("/note-category").then(setCategories).catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotes();
  };

  const toggleCategoryParams = (id: number) => {
    setFilters((prev) => {
      const newIds = prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((cid) => cid !== id)
        : [...prev.categoryIds, id];
      return { ...prev, categoryIds: newIds };
    });
  };

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-emerald-700">Tool</p>
              <div className="flex items-center gap-2">
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  메모장
                </h1>
                <Link
                  href="/notes/settings"
                  className="mt-1 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                가볍게 기록하고, 나중에 다시 찾기 쉽게.
              </p>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`rounded-full p-2 transition-colors ${
                  isSearchOpen
                    ? "bg-emerald-100 text-emerald-600"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <Link
                href="/notes/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-2 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </Link>
            </div>
          </div>

        {/* Search Panel */}
        {isSearchOpen && (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <form onSubmit={handleSearch}>
              <div className="mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="lg:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-500">검색어</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    placeholder="제목 또는 내용 검색"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-500">기간</label>
                  <div className="relative">
                    <DatePicker
                      selectsRange={true}
                      startDate={filters.startDate ? new Date(filters.startDate) : undefined}
                      endDate={filters.endDate ? new Date(filters.endDate) : undefined}
                      onChange={(update) => {
                        const [start, end] = update;
                        const formatDate = (date: Date | null) => {
                          if (!date) return "";
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, "0");
                          const day = String(date.getDate()).padStart(2, "0");
                          return `${year}-${month}-${day}`;
                        };
                        setFilters({
                          ...filters,
                          startDate: formatDate(start),
                          endDate: formatDate(end),
                        });
                      }}
                      isClearable={true}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="기간을 선택하세요"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {categories.length > 0 && (
                <div className="mb-4">
                  <label className="mb-2 block text-xs font-semibold text-slate-500">카테고리</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategoryParams(cat.id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                          filters.categoryIds.includes(cat.id)
                            ? "border-transparent text-white"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                        style={{
                          backgroundColor: filters.categoryIds.includes(cat.id) ? cat.color : undefined,
                          borderColor: filters.categoryIds.includes(cat.id) ? cat.color : undefined
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                 <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  검색
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="text-sm text-slate-500">로딩 중...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="text-sm text-slate-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <Link
                  href={`/notes/${note.id}`}
                  key={note.id}
                  className="flex flex-col rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {note.category && (
                      <div
                        className="h-2.5 w-2.5 rounded-full ring-1 ring-white/50"
                        style={{ backgroundColor: note.category.color }}
                        title={note.category.name}
                      />
                    )}
                    <h3 className="line-clamp-1 text-lg font-semibold text-slate-800">
                      {note.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
