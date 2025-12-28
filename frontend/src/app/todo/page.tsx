"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import Link from "next/link";
import PageHeader from "@/components/essential/PageHeader";
import { Category } from "@/type/category";
import { Todo } from "@/type/todo";

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState(2);
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchTodos = async () => {
    try {
      const [todosData, categoriesData] = await Promise.all([
        apiGet<Todo[]>("/todo"),
        apiGet<Category[]>("/categories")
      ]);
      setTodos(todosData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch todos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const added = await apiPost<Todo>("/todo", {
        title: title.trim(),
        description: description.trim() || undefined,
        importance,
        dueDate: dueDate || undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      });
      setTodos([added, ...todos]);
      
      // Reset Form
      setTitle("");
      setDescription("");
      setImportance(2);
      setDueDate("");
      setCategoryId("");
      setIsDetailOpen(false);
    } catch (error) {
      console.error("Failed to add todo", error);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const updated = await apiPut<Todo>(`/todo/${todo.id}`, { isDone: !todo.isDone });
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (error) {
      console.error("Failed to update todo", error);
    }
  };

  const deleteTodo = async (id: number) => {
    if (!confirm("이 항목을 삭제하시겠습니까?")) return;
    try {
      await apiDelete(`/todo/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete todo", error);
    }
  };

  const activeTodos = todos.filter((t) => !t.isDone);
  const completedTodos = todos.filter((t) => t.isDone);

  const getImportanceColor = (level: number) => {
    switch (level) {
      case 1: return "bg-rose-500";
      case 2: return "bg-amber-500";
      case 3: return "bg-emerald-500";
      default: return "bg-slate-300";
    }
  };

  const formatDueDate = (dateStr: string) => {
    if (!dateStr) return "";
    
    // YYYY-MM-DD 형식으로 추출 (T 또는 공백 기준 자르기)
    const simpleDate = dateStr.split('T')[0];
    
    const today = new Date();
    const target = new Date(simpleDate);
    
    // 시간 정보 제거 후 비교
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "오늘까지";
    if (diffDays === 1) return "내일까지";
    
    return `${simpleDate} 까지`;
  };

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <PageHeader
          label="Tool"
          title="To Do List"
          description="오늘 해야 할 일을 깔끔하게 정리하기."
          settingHref="/settings/categories"
        />

        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm backdrop-blur dark:border-emerald-950/40 dark:bg-slate-900 overflow-hidden">
            <form onSubmit={handleAddTodo} className="p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                  placeholder="새로운 할 일을 입력하세요..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setIsDetailOpen(!isDetailOpen)}
                  className={`flex h-9 px-3 items-center justify-center rounded-xl text-xs font-medium transition-all ${isDetailOpen ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  상세 {isDetailOpen ? '닫기' : '열기'}
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
                    <label className="block text-xs font-semibold text-slate-500 mb-1">설명</label>
                    <textarea 
                      className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 resize-none"
                      placeholder="구체적인 내용을 적어주세요..."
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">중요도</label>
                      <select 
                        className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none appearance-none"
                        value={importance}
                        onChange={(e) => setImportance(Number(e.target.value))}
                      >
                        <option value={1}>높음 (High)</option>
                        <option value={2}>보통 (Medium)</option>
                        <option value={3}>낮음 (Low)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">마감일</label>
                      <input 
                        type="date"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
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
                        <option value="">전체/없음</option>
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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">데이터를 불러오는 중...</div>
          ) : todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">기록된 할 일이 없습니다.</div>
          ) : (
            <div className="space-y-8">
              {activeTodos.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">진행 중 ({activeTodos.length})</h2>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeTodos.map((todo) => (
                      <div key={todo.id} className="flex items-start gap-4 py-4 group">
                        <div 
                          className="mt-1 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-slate-200 transition-all group-hover:border-emerald-500 dark:border-slate-700" 
                          onClick={() => toggleTodo(todo)}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{todo.title}</span>
                            <div className={`h-1.5 w-1.5 rounded-full ${getImportanceColor(todo.importance)}`} title={`중요도: ${todo.importance}`} />
                            {todo.category && (
                              <span 
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider flex items-center gap-1"
                                style={{ backgroundColor: `${todo.category.color}20`, color: todo.category.color }}
                              >
                                <span>{todo.category.icon}</span>
                                <span>{todo.category.name}</span>
                              </span>
                            )}
                          </div>
                          {todo.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{todo.description}</p>
                          )}
                          {todo.dueDate && (
                            <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5v-1.25A.75.75 0 0 1 5.75 2Zm-2.25 4.75c0-.69.56-1.25 1.25-1.25h10.5c.69 0 1.25.56 1.25 1.25v8.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-8.5Z" clipRule="evenodd" />
                              </svg>
                              {formatDueDate(todo.dueDate)}
                            </p>
                          )}
                        </div>
                        <button className="invisible py-1 pl-2 text-slate-300 transition-all hover:text-rose-500 group-hover:visible" onClick={() => deleteTodo(todo.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.518.149.022a.75.75 0 00.23-1.482 41.03 41.03 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4V2.5A1.25 1.25 0 0111.25 3.75v.443c-.795.077-1.584.176-2.365.298V3.75A1.25 1.25 0 0110 2.5z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {completedTodos.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">완료 ({completedTodos.length})</h2>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {completedTodos.map((todo) => (
                      <div key={todo.id} className="flex items-center gap-4 py-3 group">
                        <div className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500 text-white transition-all dark:border-emerald-500" onClick={() => toggleTodo(todo)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="flex-1 text-sm text-slate-400 line-through transition-all">{todo.title}</span>
                        <button className="invisible py-1 pl-2 text-slate-300 transition-all hover:text-rose-500 group-hover:visible" onClick={() => deleteTodo(todo.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.518.149.022a.75.75 0 00.23-1.482 41.03 41.03 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4V2.5A1.25 1.25 0 0111.25 3.75v.443c-.795.077-1.584.176-2.365.298V3.75A1.25 1.25 0 0110 2.5z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}



