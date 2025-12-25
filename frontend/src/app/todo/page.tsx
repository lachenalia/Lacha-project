export default function TodoPage() {
  return (
    <main className="min-h-full bg-gradient-to-b from-white to-emerald-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-6">
          <p className="text-xs font-semibold text-emerald-700">Tool</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            To Do List
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            오늘 해야 할 일을 깔끔하게 정리하기.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm backdrop-blur">
          <p className="text-sm text-slate-600">준비 중</p>
        </div>
      </div>
    </main>
  );
}
