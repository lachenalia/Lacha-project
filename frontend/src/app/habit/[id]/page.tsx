"use client";

import { useEffect, useState, use } from "react";
import { apiGet } from "@/lib/api";
import Link from "next/link";
import { HabitDetail, HabitLog } from "@/type/habit";

export default function HabitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<HabitDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiGet<HabitDetail>(`/habit/${id}/detail`);
        setData(res);
      } catch (err) {
        console.error("Failed to fetch habit details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");

  if (loading) return <div className="p-10 text-center text-slate-400">Loading...</div>;
  if (!data) return <div className="p-10 text-center text-slate-400">Habit not found</div>;

  const HabitCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    const calendarDays = [];
    for (let i = 0; i < startingDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const checkLog = (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return data.logs.find(l => l.logDate === dateStr);
    };

    return (
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {year}년 {month + 1}월
          </h3>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
               <div className="w-2 h-2 rounded-full bg-emerald-500" /> 성공
             </div>
             <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
               <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" /> 미달성
             </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['일', '월', '화', '수', '목', '금', '토'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
          ))}
          {calendarDays.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />;
            
            const log = checkLog(day);
            const isToday = day === today.getDate() && month === today.getMonth();
            
            return (
              <div 
                key={day} 
                className={`group relative flex aspect-square flex-col items-center justify-center rounded-xl transition-all ${
                  log?.isSuccess 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40' 
                  : isToday ? 'border border-slate-200 dark:border-slate-800' : 'bg-slate-50/50 dark:bg-slate-900/50'
                }`}
              >
                <span className={`text-xs font-bold ${log?.isSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}`}>{day}</span>
                {log?.isSuccess && (
                  <div className="mt-0.5 h-1 w-1 rounded-full bg-emerald-500" />
                )}
                {log?.note && (
                  <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-sm" title={log.note} />
                )}
                
                {/* Note Tooltip on Hover */}
                {log?.note && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-32 -translate-x-1/2 scale-95 rounded-lg bg-slate-900 p-2 text-[9px] text-white opacity-0 shadow-xl transition-all group-hover:scale-100 group-hover:opacity-100 z-10">
                    {log.note}
                    <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-slate-900" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <Link href="/habit" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          목록으로 돌아가기
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div 
              className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white dark:bg-slate-900 border text-4xl shadow-sm"
              style={{ borderColor: data.habit.categoryRelation?.color ? `${data.habit.categoryRelation.color}40` : undefined }}
            >
               {data.habit.categoryRelation?.icon || "✨"}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{data.habit.title}</h1>
                <span 
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{ backgroundColor: data.habit.categoryRelation?.color ? `${data.habit.categoryRelation.color}20` : undefined, color: data.habit.categoryRelation?.color || '#10b981' }}
                >
                  {data.habit.categoryRelation?.name || "기본"}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                  {data.habit.repeatType === 'daily' ? '매일' : '정기적'}
                </span>
              </div>
              {data.habit.description && (
                <p className="mt-1 text-slate-600 dark:text-slate-400">{data.habit.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-950/40 dark:bg-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">현재 스트릭</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-emerald-600">{data.stats.currentStreak}</span>
              <span className="text-xs font-bold text-slate-500">일째 달성 중</span>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-950/40 dark:bg-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">최대 스트릭</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-amber-500">{data.stats.maxStreak}</span>
              <span className="text-xs font-bold text-slate-500">일 연속 달성</span>
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-950/40 dark:bg-slate-900">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">총 성공 횟수</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-700 dark:text-slate-200">{data.stats.totalSuccess}</span>
              <span className="text-xs font-bold text-slate-500">회 기록됨</span>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="rounded-3xl border border-emerald-100 bg-white overflow-hidden shadow-sm dark:border-emerald-950/40 dark:bg-slate-900">
          <div className="border-b border-slate-50 dark:border-slate-800 p-6 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 dark:text-slate-200">실천 히스토리</h2>
            <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl">
               <button 
                 onClick={() => setViewMode("calendar")}
                 className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === "calendar" ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 달력
               </button>
               <button 
                 onClick={() => setViewMode("list")}
                 className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === "list" ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 리스트
               </button>
            </div>
          </div>

          {viewMode === "calendar" ? (
             <HabitCalendar />
          ) : (
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {data.logs.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm">아직 기록된 실천 로그가 없습니다.</div>
              ) : (
                data.logs.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${log.isSuccess ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{log.logDate}</p>
                        {log.note && <p className="text-xs text-slate-500">{log.note}</p>}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${log.isSuccess ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                      {log.isSuccess ? '성공' : '미달성'}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
