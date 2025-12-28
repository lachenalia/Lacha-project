import PageHeader from "@/components/essential/PageHeader";

export default function CalendarPage() {
  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50 dark:from-slate-950 dark:to-emerald-950/20">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <PageHeader
          label="Tool"
          title="일정관리"
          description="개인 일정과 루틴을 한 눈에."
        />

        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm text-slate-600">준비 중</p>
        </div>
      </div>
    </main>
  );
}
