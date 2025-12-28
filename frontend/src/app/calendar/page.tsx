"use client";

import PageHeader from "@/components/essential/PageHeader";
import { useEffect, useState } from "react";
import { 
  IconCalendar, 
  IconList, 
  IconLayoutGrid, 
  IconChevronLeft, 
  IconChevronRight, 
  IconPlus 
} from "@tabler/icons-react";
import { Schedule } from "@/type/schedule";
import { range } from "@/lib/utils";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import ScheduleModal from "@/components/schedule/ScheduleModal";

type ViewMode = "calendar" | "list" | "card";

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await apiGet<Schedule[]>("/schedules");
      setSchedules(data);
    } catch (error) {
      console.error("Failed to fetch schedules", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Schedule>) => {
    try {
      if (selectedSchedule) {
        await apiPut(`/schedules/${selectedSchedule.id}`, data);
      } else {
        await apiPost("/schedules", data);
      }
      await fetchSchedules();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save schedule", error);
      alert("저장에 실패했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("일정을 삭제하시겠습니까?")) return;
    try {
      await apiDelete(`/schedules/${id}`);
      await fetchSchedules();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to delete schedule", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const offset = startDayOfMonth(year, month);
    
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-emerald-950/40 p-4 shadow-sm overflow-hidden">
        <div className="mb-6 flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {year}년 {month + 1}월
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <IconChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-2 text-sm font-medium rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              오늘
            </button>
            <button onClick={nextMonth} className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <IconChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 pb-2">
          {weekDays.map((d, i) => (
            <div key={d} className={`text-center text-xs font-bold uppercase tracking-tighter ${i === 0 ? "text-rose-500" : i === 6 ? "text-blue-500" : "text-slate-400"}`}>
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {range(0, offset - 1).map((i) => (
            <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-slate-50 dark:border-slate-800/50 p-1 opacity-20" />
          ))}
          {range(1, totalDays).map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const daySchedules = schedules.filter(s => s.startAt.startsWith(dateStr));
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            return (
              <div key={day} className="min-h-[120px] border-b border-r border-slate-50 dark:border-slate-800/50 p-2 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? "bg-emerald-600 text-white shadow-lg" : "text-slate-700 dark:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-800"}`}>
                    {day}
                  </span>
                </div>
                <div className="space-y-1">
                  {daySchedules.map(s => (
                    <div 
                      key={s.id} 
                      onClick={(e) => { e.stopPropagation(); handleEditClick(s); }}
                      className="px-1.5 py-0.5 text-[10px] font-medium truncate rounded-md cursor-pointer hover:brightness-95 transition-all"
                      style={{ backgroundColor: `${s.category?.color || "#cbd5e1"}20`, color: s.category?.color || "#64748b", borderLeft: `2px solid ${s.category?.color || "#64748b"}` }}
                    >
                      {s.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className="space-y-4">
        {schedules.length === 0 ? (
          <div className="py-20 text-center text-slate-400">등록된 일정이 없습니다.</div>
        ) : (
          schedules.map(s => (
            <div 
              key={s.id} 
              onClick={() => handleEditClick(s)}
              className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-100 dark:border-emerald-950/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="w-16 flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 font-bold uppercase">{new Date(s.startAt).toLocaleDateString('ko-KR', { weekday: 'short' })}</span>
                <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{new Date(s.startAt).getDate()}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    {s.category && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${s.category.color}15`, color: s.category.color }}>
                        {s.category.icon} {s.category.name}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(s.startAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{s.title}</h3>
                {s.description && <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{s.description}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderCard = () => {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {schedules.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400">등록된 일정이 없습니다.</div>
        ) : (
          schedules.map(s => (
            <div 
              key={s.id} 
              onClick={() => handleEditClick(s)}
              className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-emerald-950/40 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl" style={{ backgroundColor: `${s.category?.color || "#cbd5e1"}20`, color: s.category?.color || "#64748b" }}>
                    {s.category?.icon || "📅"}
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                    {new Date(s.startAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{s.description}</p>
              <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">
                  {new Date(s.startAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline">상세보기</button>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <PageHeader
          label="Tool"
          title="일정관리"
          description="개인 일정과 루틴을 한 눈에 관리하세요."
          settingHref="/settings/categories"
        >
          <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-2xl border border-emerald-100 dark:border-emerald-950/40 shadow-sm">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "calendar"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none"
                  : "text-slate-500 hover:bg-white dark:hover:bg-slate-800"
              }`}
            >
              <IconCalendar size={14} /> 달력
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "list"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none"
                  : "text-slate-500 hover:bg-white dark:hover:bg-slate-800"
              }`}
            >
              <IconList size={14} /> 리스트
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === "card"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none"
                  : "text-slate-500 hover:bg-white dark:hover:bg-slate-800"
              }`}
            >
              <IconLayoutGrid size={14} /> 카드
            </button>
          </div>
        </PageHeader>

        <div className="mb-6 flex justify-between items-center">
           <div className="flex items-center gap-4">
              {loading && <span className="text-xs text-slate-400 animate-pulse">일정을 불러오는 중...</span>}
           </div>
           <button 
            onClick={handleAddClick}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
           >
              <IconPlus size={18} /> 일정 추가
           </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {viewMode === "calendar" && renderCalendar()}
          {viewMode === "list" && renderList()}
          {viewMode === "card" && renderCard()}
        </div>
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        schedule={selectedSchedule}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </main>
  );
}
