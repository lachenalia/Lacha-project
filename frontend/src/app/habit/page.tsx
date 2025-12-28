"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import Link from "next/link";
import PageHeader from "@/components/essential/PageHeader";
import { Category } from "@/type/category";
import { Habit } from "@/type/habit";

export default function HabitPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [repeatType, setRepeatType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchHabits = async () => {
    try {
      const [habitsData, categoriesData] = await Promise.all([
        apiGet<Habit[]>(`/habit?date=${today}`),
        apiGet<Category[]>("/categories")
      ]);
      setHabits(habitsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch habits", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const added = await apiPost<Habit>("/habit", {
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        repeatType,
        startDate,
        endDate: endDate || undefined,
        repeatConfig: {}, // Default empty config for now
      });
      setHabits([{ ...added, isCompleted: false }, ...habits]);
      
      // Reset Form
      setTitle("");
      setDescription("");
      setCategoryId("");
      setRepeatType('daily');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate("");
      setIsDetailOpen(false);
    } catch (error) {
      console.error("Failed to add habit", error);
    }
  };

  const [habitNotes, setHabitNotes] = useState<Record<number, string>>({});

  const toggleHabit = async (habitId: number) => {
    try {
      const note = habitNotes[habitId] || "";
      const isCompleted = await apiPost<boolean>(`/habit/${habitId}/toggle`, { 
        date: today,
        note: note.trim() || undefined 
      });
      setHabits(habits.map(h => h.id === habitId ? { ...h, isCompleted } : h));
      if (isCompleted) {
        // Clear note after success
        setHabitNotes(prev => {
          const next = { ...prev };
          delete next[habitId];
          return next;
        });
      }
    } catch (error) {
      console.error("Failed to toggle habit", error);
    }
  };

  const handleNoteChange = (habitId: number, value: string) => {
    setHabitNotes(prev => ({ ...prev, [habitId]: value }));
  };

  const deleteHabit = async (id: number) => {
    if (!confirm("이 습관을 삭제하시겠습니까? 관련 기록도 모두 사라질 수 있습니다.")) return;
    try {
      await apiDelete(`/habit/${id}`);
      setHabits(habits.filter((h) => h.id !== id));
    } catch (error) {
      console.error("Failed to delete habit", error);
    }
  };

  const getRepeatLabel = (type: string) => {
    switch (type) {
      case 'daily': return '매일';
      case 'weekly': return '매주';
      case 'monthly': return '매월';
      case 'custom': return '사용자 지정';
      default: return type;
    }
  };

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <PageHeader
          label="Tool"
          title="습관 형성"
          description="지속 가능한 습관을 만들고 추적하세요."
          settingHref="/settings/categories"
        >
          <div className="mt-4 sm:mt-0 px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300">
             오늘은 {today} 입니다
          </div>
        </PageHeader>

        <div className="space-y-6">
          {/* Add Habit Form */}
          <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm backdrop-blur dark:border-emerald-950/40 dark:bg-slate-900 overflow-hidden">
            <form onSubmit={handleAddHabit} className="p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                  placeholder="새로운 습관을 입력하세요..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setIsDetailOpen(!isDetailOpen)}
                  className={`flex h-9 px-3 items-center justify-center rounded-xl text-xs font-medium transition-all ${isDetailOpen ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  설정 {isDetailOpen ? '닫기' : '열기'}
                </button>
                <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-all hover:bg-emerald-500 active:scale-95" title="추가">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                </button>
              </div>

              {isDetailOpen && (
                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">상세 설명</label>
                    <textarea 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 resize-none"
                      placeholder="습관에 대한 자세한 내용을 적어주세요..."
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">반복 유형</label>
                      <select 
                        className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none appearance-none"
                        value={repeatType}
                        onChange={(e) => setRepeatType(e.target.value as any)}
                      >
                        <option value="daily">매일</option>
                        <option value="weekly">매주</option>
                        <option value="monthly">매월</option>
                        <option value="custom">사용자 지정</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">시작일</label>
                      <input 
                        type="date"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">종료일 (선택)</label>
                      <input 
                        type="date"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center justify-between">
                         카테고리
                         <Link href="/settings/categories" className="text-[10px] text-emerald-600 hover:underline">관리</Link>
                      </label>
                      <select 
                        className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none appearance-none"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                      >
                        <option value="">카테고리 없음</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Habit List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">데이터를 불러오는 중...</div>
          ) : habits.length === 0 ? (
            <div className="rounded-3xl border border-emerald-100 bg-white/50 p-12 text-center dark:border-emerald-900/40 dark:bg-slate-900/40">
              <p className="text-slate-500 dark:text-slate-400">아직 등록된 습관이 없습니다.<br/>새로운 습관을 시작해 보세요!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {habits.map((habit) => (
                <div 
                  key={habit.id} 
                  className={`group relative flex items-start gap-4 rounded-3xl border p-5 transition-all ${
                    habit.isCompleted 
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' 
                    : 'border-emerald-100 bg-white dark:border-emerald-950/40 dark:bg-slate-900 hover:shadow-md'
                  }`}
                >
                  {/* Category Icon / Status Indicator */}
                  <div 
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                      habit.isCompleted 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' 
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400'
                    }`}
                    style={{ borderColor: habit.isCompleted ? '#10b981' : (habit.category?.color ? `${habit.category.color}40` : undefined) }}
                  >
                    <span className={`text-2xl transition-all duration-500 ${habit.isCompleted ? 'grayscale opacity-20 scale-75' : 'grayscale-0 opacity-100 scale-100'}`}>
                       {habit.category?.icon || "✨"}
                    </span>
                    {habit.isCompleted && (
                      <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 fade-in duration-300">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-emerald-500">
                           <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                         </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link href={`/habit/${habit.id}`} className="block">
                      <div className="mb-0.5 flex items-center gap-2">
                        <h3 className={`truncate text-sm font-bold transition-colors group-hover:text-emerald-600 ${habit.isCompleted ? 'text-emerald-900 dark:text-emerald-100 line-through opacity-70' : 'text-slate-800 dark:text-slate-100'}`}>
                          {habit.title}
                        </h3>
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 uppercase tracking-tighter">
                          {getRepeatLabel(habit.repeatType)}
                        </span>
                      </div>
                      {habit.description && (
                        <p className={`line-clamp-1 text-xs ${habit.isCompleted ? 'text-emerald-600/50 dark:text-emerald-400/30' : 'text-slate-500 dark:text-slate-400'}`}>
                          {habit.description}
                        </p>
                      )}
                    </Link>

                    {!habit.isCompleted && (
                      <div className="mt-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <input 
                          type="text"
                          placeholder="그날의 다짐 또는 메모..."
                          className="flex-1 bg-slate-50/50 dark:bg-slate-800/50 border border-transparent focus:border-emerald-200 dark:focus:border-emerald-900/50 rounded-xl px-3 py-1.5 text-xs outline-none transition-all placeholder:text-slate-400"
                          value={habitNotes[habit.id] || ""}
                          onChange={(e) => handleNoteChange(habit.id, e.target.value)}
                        />
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleHabit(habit.id);
                          }}
                          className="flex h-8 px-3 items-center justify-center rounded-xl bg-emerald-600 text-white text-[11px] font-bold shadow-sm hover:bg-emerald-500 active:scale-95 transition-all"
                        >
                          달성
                        </button>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => deleteHabit(habit.id)}
                    className="absolute top-2 right-2 invisible group-hover:visible p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                    title="삭제"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.518.149.022a.75.75 0 00.23-1.482 41.03 41.03 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4V2.5A1.25 1.25 0 0111.25 3.75v.443c-.795.077-1.584.176-2.365.298V3.75A1.25 1.25 0 0110 2.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

